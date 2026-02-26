import { z } from "zod";

export const checkoutSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  email: z.string().email("E-mail inválido"),
  phone: z
    .string()
    .regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, "Telefone inválido")
    .optional(),
  address: z.object({
    street: z.string().min(3, "Endereço obrigatório"),
    number: z.string().min(1, "Número obrigatório"),
    complement: z.string().optional(),
    neighborhood: z.string().min(2, "Bairro obrigatório"),
    city: z.string().min(2, "Cidade obrigatória"),
    state: z.string().length(2, "UF deve ter 2 letras"),
    zipCode: z
      .string()
      .regex(/^\d{5}-?\d{3}$/, "CEP inválido"),
  }),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
