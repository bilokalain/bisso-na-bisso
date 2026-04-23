/**
 * Build a wa.me link with a pre-filled message. The phone must be E.164-ish
 * (digits + optional leading '+'); we strip everything else so users can paste
 * "+32 470 12 34 56" or "0470/12.34.56" and it still produces a valid URL.
 */
export function waLink(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function telLink(phone: string): string {
  // Keep leading + and digits only — tel: handles the rest.
  const clean = phone.replace(/[^+\d]/g, "");
  return `tel:${clean}`;
}

export function mailtoLink(email: string, subject: string, body: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}

export function annonceContactMessage(titre: string, url?: string): string {
  const link = url ? `\n${url}` : "";
  return `Bonjour, je vous contacte suite à votre annonce « ${titre} » sur Bisso na Bisso.${link}`;
}
