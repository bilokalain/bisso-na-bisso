"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { buildOrderReference } from "@/lib/baskets";

const schema = z.object({
  basketId: z.string().min(1),
  senderName: z.string().trim().min(2, "Ton nom stp.").max(80),
  senderEmail: z.string().trim().toLowerCase().email("E-mail invalide."),
  senderPhone: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : undefined))
    .pipe(
      z
        .string()
        .min(6, "Numéro invalide.")
        .max(30, "Numéro invalide.")
        .optional(),
    ),
  recipientName: z
    .string()
    .trim()
    .min(2, "Nom du destinataire requis.")
    .max(80),
  recipientPhone: z
    .string()
    .trim()
    .min(6, "Numéro de téléphone requis.")
    .max(30, "Numéro invalide.")
    .refine((v) => /[\d+]/.test(v), "Numéro invalide."),
  recipientAddress: z
    .string()
    .trim()
    .min(10, "Adresse trop courte.")
    .max(300),
  recipientNotes: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform((v) => (v ? v : undefined)),
  messageToFamily: z
    .string()
    .trim()
    .max(400)
    .optional()
    .transform((v) => (v ? v : undefined)),
});

export type CreateOrderState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function createOrder(
  _prev: CreateOrderState,
  formData: FormData,
): Promise<CreateOrderState> {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const flat = z.flattenError(parsed.error);
    return {
      error: "Vérifie les champs marqués en rouge.",
      fieldErrors: flat.fieldErrors,
    };
  }

  const data = parsed.data;
  const basket = await prisma.basket.findUnique({
    where: { id: data.basketId },
  });
  if (!basket || !basket.active) {
    return { error: "Ce panier n'est plus disponible." };
  }

  // Ensure reference uniqueness. Collisions on 6 chars from 32 alphabet =
  // 1 in ~10^9, but retry once is cheap insurance.
  let reference = buildOrderReference();
  const existing = await prisma.order.findUnique({ where: { reference } });
  if (existing) reference = buildOrderReference();

  const order = await prisma.order.create({
    data: {
      reference,
      basketId: basket.id,
      senderName: data.senderName,
      senderEmail: data.senderEmail,
      senderPhone: data.senderPhone,
      recipientName: data.recipientName,
      recipientPhone: data.recipientPhone,
      recipientAddress: data.recipientAddress,
      recipientNotes: data.recipientNotes,
      messageToFamily: data.messageToFamily,
      amountEUR: basket.priceEUR,
      paymentStatus: "PENDING",
      status: "RECEIVED",
    },
  });

  revalidatePath("/admin/commandes");
  // Phase A2 will swap this for a Stripe Checkout redirect.
  redirect(`/ndumba/commande/${order.reference}?pending=1`);
}
