import type { ContactInformation } from "./types";
// Single source of truth for all contact details and links.
export const contact: ContactInformation = {
  email: "siddharththegreatest@gmail.com",
  altEmail: "siddharthcleaver@gmail.com",
  whatsapp: "916385581343",
  whatsappDisplay: "+91 6385581343",
  location: "Chennai, India",
  instagram: { handle: "@me_sid7", url: "https://www.instagram.com/me_sid7" },
  linkedin: { handle: "@Siddharth3188", url: "https://www.linkedin.com/in/siddharth3188" },
  // GitHub intentionally omitted until a real profile URL is provided.
};
export const whatsappUrl = `https://wa.me/${contact.whatsapp}`;
/** Primary email actions open Gmail compose in a new tab (use with target="_blank" rel="noopener noreferrer"). */
export const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(contact.email)}`;
export const altMailtoUrl = `mailto:${contact.altEmail}`;
