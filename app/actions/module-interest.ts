"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getModuleByKey } from "@/lib/modules";

const schema = z.object({
  moduleKey: z.string().min(1),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("E-mail invalide."),
});

export type CaptureInterestState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function captureInterest(
  _prev: CaptureInterestState,
  formData: FormData,
): Promise<CaptureInterestState> {
  const parsed = schema.safeParse({
    moduleKey: formData.get("moduleKey"),
    email: formData.get("email"),
  });
  if (!parsed.success) {
    const flat = z.flattenError(parsed.error);
    return {
      status: "error",
      message: flat.fieldErrors.email?.[0] ?? "Vérifie ton e-mail.",
    };
  }

  const module = await getModuleByKey(parsed.data.moduleKey);
  if (!module) {
    return { status: "error", message: "Module inconnu." };
  }

  try {
    await prisma.moduleInterest.create({
      data: {
        moduleId: module.id,
        email: parsed.data.email,
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    // Unique constraint violation = already registered — treat as success.
    if (!msg.includes("UNIQUE") && !msg.includes("unique")) {
      return {
        status: "error",
        message: "Impossible d'enregistrer pour l'instant, réessaie.",
      };
    }
  }

  return {
    status: "success",
    message: "C'est noté. On te prévient dès l'ouverture.",
  };
}
