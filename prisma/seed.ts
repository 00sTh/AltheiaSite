/**
 * Seed do banco de dados — dados iniciais para desenvolvimento
 * Execução: npm run db:seed
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // ── Categorias ──────────────────────────────────────────────────────
  const skincare = await prisma.category.upsert({
    where: { slug: "skincare" },
    update: {},
    create: {
      name: "Skincare",
      slug: "skincare",
      imageUrl:
        "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400",
    },
  });

  const makeup = await prisma.category.upsert({
    where: { slug: "maquiagem" },
    update: {},
    create: {
      name: "Maquiagem",
      slug: "maquiagem",
      imageUrl:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400",
    },
  });

  const perfumes = await prisma.category.upsert({
    where: { slug: "perfumes" },
    update: {},
    create: {
      name: "Perfumes",
      slug: "perfumes",
      imageUrl:
        "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400",
    },
  });

  console.log("✅ Categorias criadas");

  // ── Produtos ─────────────────────────────────────────────────────────
  const produtos = [
    {
      name: "Sérum Facial Vitamina C",
      slug: "serum-facial-vitamina-c",
      description:
        "Sérum antioxidante com vitamina C a 20%. Clareia manchas, ilumina e protege a pele contra radicais livres. Uso diário, textura leve de rápida absorção.",
      price: 129.9,
      stock: 50,
      featured: true,
      categoryId: skincare.id,
      images: [
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600",
      ],
    },
    {
      name: "Hidratante Facial FPS 50",
      slug: "hidratante-facial-fps-50",
      description:
        "Hidratante diário com fator de proteção solar 50. Fórmula leve, não oleosa, ideal para uso debaixo da maquiagem.",
      price: 89.9,
      stock: 80,
      featured: true,
      categoryId: skincare.id,
      images: [
        "https://images.unsplash.com/photo-1601049541271-af39c6b2b3f6?w=600",
      ],
    },
    {
      name: "Máscara Facial de Argila",
      slug: "mascara-facial-argila",
      description:
        "Máscara purificante com argila verde e carvão ativado. Remove impurezas, controla oleosidade e minimiza os poros.",
      price: 59.9,
      stock: 120,
      featured: false,
      categoryId: skincare.id,
      images: [
        "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600",
      ],
    },
    {
      name: "Óleo Facial de Roseira",
      slug: "oleo-facial-roseira",
      description:
        "Óleo seco de roseira mosqueta puro. Regenera, nutre e reduz a aparência de cicatrizes e linhas finas.",
      price: 149.9,
      stock: 35,
      featured: true,
      categoryId: skincare.id,
      images: [
        "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600",
      ],
    },
    {
      name: "Base Líquida HD",
      slug: "base-liquida-hd",
      description:
        "Base de alta cobertura com acabamento natural. Formulação vegana, 30 tons disponíveis, dura até 24h.",
      price: 119.9,
      stock: 60,
      featured: true,
      categoryId: makeup.id,
      images: [
        "https://images.unsplash.com/photo-1631730486572-226d1f595058?w=600",
      ],
    },
    {
      name: "Paleta de Sombras Nude",
      slug: "paleta-sombras-nude",
      description:
        "12 cores em tons nude e terrosos. Altamente pigmentadas, com acabamentos matte, shimmer e glitter.",
      price: 179.9,
      stock: 45,
      featured: false,
      categoryId: makeup.id,
      images: [
        "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600",
      ],
    },
    {
      name: "Batom Líquido Matte",
      slug: "batom-liquido-matte",
      description:
        "Batom líquido de longa duração com acabamento matte. Fórmula hidratante que não resseca os lábios.",
      price: 49.9,
      stock: 200,
      featured: false,
      categoryId: makeup.id,
      images: [
        "https://images.unsplash.com/photo-1586495777744-4e6232bf9017?w=600",
      ],
    },
    {
      name: "Eau de Parfum Floral",
      slug: "eau-de-parfum-floral",
      description:
        "Perfume feminino com notas de peônia, jasmim e fundo almiscarado. Frasco 50ml, fixação de 8 a 12 horas.",
      price: 299.9,
      stock: 25,
      featured: true,
      categoryId: perfumes.id,
      images: [
        "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=600",
      ],
    },
    {
      name: "Colônia Cítrica Refrescante",
      slug: "colonia-citrica-refrescante",
      description:
        "Água de colônia com notas de bergamota, limão siciliano e cedro. Leveza e frescor para o dia a dia. 100ml.",
      price: 159.9,
      stock: 40,
      featured: false,
      categoryId: perfumes.id,
      images: [
        "https://images.unsplash.com/photo-1541643600914-78b084683702?w=600",
      ],
    },
    {
      name: "Body Mist Rose Gold",
      slug: "body-mist-rose-gold",
      description:
        "Névoa corporal perfumada com extrato de rosa e óleo de argan. Hidrata e perfuma com delicadeza. 200ml.",
      price: 79.9,
      stock: 90,
      featured: false,
      categoryId: perfumes.id,
      images: [
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600",
      ],
    },
  ];

  for (const produto of produtos) {
    await prisma.product.upsert({
      where: { slug: produto.slug },
      update: {},
      create: produto,
    });
    console.log(`  📦 ${produto.name}`);
  }

  console.log("✅ 10 produtos criados");
  console.log("🎉 Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
