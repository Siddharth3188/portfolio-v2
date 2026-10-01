import type { ContactInformation } from "./types";
// TODO: replace with real details. Everything contact-related reads from here.
export const contact: ContactInformation = {
  email: "hello@example.com",
  whatsapp: "910000000000", // international format, digits only
};
export const whatsappUrl = `https://wa.me/${contact.whatsapp}`;
export const mailtoUrl = `mailto:${contact.email}`;
