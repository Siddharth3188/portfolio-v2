import type { ContactInformation } from "./types";
// Everything contact-related reads from here.
export const contact: ContactInformation = {
  email: "siddharththegreatest@gmail.com",
  whatsapp: "916385581343", // international format, digits only
};
export const whatsappUrl = `https://wa.me/${contact.whatsapp}`;
export const mailtoUrl = `mailto:${contact.email}`;
