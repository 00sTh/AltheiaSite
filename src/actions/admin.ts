"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { stringifyImages } from "@/lib/utils";
import { getServerAuth } from "@/lib/auth";
import { uploadImage } from "@/lib/blob";
import { z } from "zod";

// ─── Auth guard ─────────────────────────────────────────────────────────────

async function requireAdmin() {
  const { userId, sessionClaims } = await getServerAuth();
  if (!userId) redirect("/sign-in");
  const role = sessionClaims?.metadata?.role;
  if (role !== "admin") redirect("/");
}

// ─── SiteSettings ────────────────────────────────────────────────────────────

export async function getSiteSettings() {
  return prisma.siteSettings.upsert({
    where: { id: "default" },
    create: { id: "default" },
    update: {},
  });
}

const siteSettingsSchema = z.object({
  heroTitle: z.string().min(1).max(200),
  heroSubtitle: z.string().min(1).max(500),
  heroImageUrl: z.string().url().optional().or(z.literal("")),
  heroVideoUrl: z.string().url().optional().or(z.literal("")),
  aboutTitle: z.string().min(1).max(200),
  aboutText: z.string().min(1).max(5000),
  aboutImageUrl: z.string().url().optional().or(z.literal("")),
  featuredVideoUrl: z.string().url().optional().or(z.literal("")),
  featuredVideoTitle: z.string().max(200).optional().or(z.literal("")),
  featuredVideoDesc: z.string().max(500).optional().or(z.literal("")),
  instagramUrl: z.string().url().optional().or(z.literal("")),
  youtubeUrl: z.string().url().optional().or(z.literal("")),
  twitterUrl: z.string().url().optional().or(z.literal("")),
  newsletterTitle: z.string().max(200).optional().or(z.literal("")),
  newsletterSubtitle: z.string().max(500).optional().or(z.literal("")),
  metaTitle: z.string().max(70).optional().or(z.literal("")),
  metaDescription: z.string().max(160).optional().or(z.literal("")),
  shippingFreeThreshold: z.coerce.number().min(0),
});

export async function updateSiteSettings(formData: FormData) {
  await requireAdmin();

  const raw = Object.fromEntries(formData.entries());
  const parsed = siteSettingsSchema.safeParse(raw);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const data = parsed.data;

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      ...data,
      heroImageUrl: data.heroImageUrl || null,
      heroVideoUrl: data.heroVideoUrl || null,
      aboutImageUrl: data.aboutImageUrl || null,
      featuredVideoUrl: data.featuredVideoUrl || null,
      instagramUrl: data.instagramUrl || null,
      youtubeUrl: data.youtubeUrl || null,
      twitterUrl: data.twitterUrl || null,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
    },
    update: {
      ...data,
      heroImageUrl: data.heroImageUrl || null,
      heroVideoUrl: data.heroVideoUrl || null,
      aboutImageUrl: data.aboutImageUrl || null,
      featuredVideoUrl: data.featuredVideoUrl || null,
      instagramUrl: data.instagramUrl || null,
      youtubeUrl: data.youtubeUrl || null,
      twitterUrl: data.twitterUrl || null,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
    },
  });

  revalidatePath("/", "layout");
  revalidatePath("/sobre-nos");
  revalidatePath("/videos");
  return { success: true };
}

// ─── Products ────────────────────────────────────────────────────────────────

const productSchema = z.object({
  name: z.string().min(2).max(200),
  slug: z
    .string()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9-]+$/),
  description: z.string().min(10).max(5000),
  price: z.coerce.number().min(0.01),
  stock: z.coerce.number().int().min(0),
  categoryId: z.string().uuid(),
  featured: z
    .string()
    .optional()
    .transform((v) => v === "on"),
  active: z
    .string()
    .optional()
    .transform((v) => v !== "off"),
  imageUrls: z.string().optional(), // JSON array of URLs
  ingredients: z.string().optional(),
  usage: z.string().optional(),
});

export async function createProduct(formData: FormData) {
  await requireAdmin();

  const raw = Object.fromEntries(formData.entries());
  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { imageUrls, ingredients, usage, ...data } = parsed.data;
  let images: string[] = [];
  try {
    images = imageUrls ? JSON.parse(imageUrls) : [];
  } catch {}

  // Handle file upload
  const file = formData.get("imageFile") as File | null;
  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const { url } = await uploadImage(buffer, `${data.slug}-${Date.now()}.jpg`);
    images = [url, ...images];
  }

  const product = await prisma.product.create({
    data: {
      ...data,
      images: stringifyImages(images),
      ingredients: ingredients || null,
      usage: usage || null,
    },
  });

  revalidatePath("/products");
  revalidatePath("/admin/products");
  return { success: true, id: product.id };
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();

  const raw = Object.fromEntries(formData.entries());
  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { imageUrls, ingredients, usage, ...data } = parsed.data;
  let images: string[] = [];
  try {
    images = imageUrls ? JSON.parse(imageUrls) : [];
  } catch {}

  const file = formData.get("imageFile") as File | null;
  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const { url } = await uploadImage(buffer, `${data.slug}-${Date.now()}.jpg`);
    images = [url, ...images];
  }

  await prisma.product.update({
    where: { id },
    data: {
      ...data,
      images: stringifyImages(images),
      ingredients: ingredients || null,
      usage: usage || null,
    },
  });

  revalidatePath(`/products/${data.slug}`);
  revalidatePath("/products");
  revalidatePath("/admin/products");
  return { success: true };
}

export async function deleteProduct(id: string) {
  await requireAdmin();

  await prisma.product.update({
    where: { id },
    data: { active: false },
  });

  revalidatePath("/products");
  revalidatePath("/admin/products");
  return { success: true };
}

export async function getAdminProducts() {
  await requireAdmin();
  return prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

// ─── Orders ──────────────────────────────────────────────────────────────────

const VALID_STATUSES = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

export async function updateOrderStatus(orderId: string, status: string) {
  await requireAdmin();
  if (!VALID_STATUSES.includes(status)) {
    return { success: false, error: "Status inválido" };
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}

export async function getAdminOrders(page = 1, pageSize = 20) {
  await requireAdmin();
  const skip = (page - 1) * pageSize;
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      take: pageSize,
      skip,
      orderBy: { createdAt: "desc" },
      include: {
        userProfile: { select: { email: true, firstName: true, lastName: true } },
        items: {
          include: { product: { select: { name: true, images: true } } },
        },
      },
    }),
    prisma.order.count(),
  ]);
  return { orders, total, pages: Math.ceil(total / pageSize) };
}

export async function getAdminOrder(id: string) {
  await requireAdmin();
  return prisma.order.findUnique({
    where: { id },
    include: {
      userProfile: true,
      items: {
        include: { product: true },
      },
    },
  });
}

// ─── Newsletter subscribers ───────────────────────────────────────────────────

export async function getNewsletterSubscribers() {
  await requireAdmin();
  return prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" },
  });
}
