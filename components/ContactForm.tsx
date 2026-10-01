"use client";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { contact } from "@/data/contact";

type Fields = { name: string; business: string; email: string; phone: string; type: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;
const empty: Fields = { name: "", business: "", email: "", phone: "", type: "Business website", message: "" };
const types = ["Business website", "Premium digital experience", "Redesign of an existing website", "Not sure yet"];
const input = "w-full rounded-lg border border-line bg-card px-3.5 py-3 text-base text-fg";

function validate(v: Fields): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = "Enter your name.";
  if (!/^\S+@\S+\.\S+$/.test(v.email)) e.email = "Enter a valid email address, like name@example.com.";
  if (v.message.trim().length < 10) e.message = "Add a sentence or two about your project.";
  return e;
}

export default function ContactForm() {
  const [v, setV] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const set = (k: keyof Fields) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setV((p) => ({ ...p, [k]: e.target.value }));

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validate(v);
    setErrors(found);
    if (Object.keys(found).length) return;
    setStatus("loading");
    const body = `Name: ${v.name}\nBusiness: ${v.business}\nPhone/WhatsApp: ${v.phone}\nWebsite type: ${v.type}\n\n${v.message}`;
    const href = `mailto:${contact.email}?subject=${encodeURIComponent("Project enquiry from " + v.name)}&body=${encodeURIComponent(body)}`;
    window.setTimeout(() => { window.location.href = href; setStatus("done"); }, 400);
  }

  const field = (id: keyof Fields, label: string, el: React.ReactNode) => (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}</label>
      {el}
      {errors[id] && <p id={`${id}-err`} className="mt-1.5 text-sm text-acc">{errors[id]}</p>}
    </div>
  );
  const aria = (id: keyof Fields) => ({ id, "aria-invalid": errors[id] ? true : undefined, "aria-describedby": errors[id] ? `${id}-err` : undefined });

  return (
    <form onSubmit={onSubmit} noValidate className="mt-10 grid max-w-2xl gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {field("name", "Name", <input {...aria("name")} value={v.name} onChange={set("name")} autoComplete="name" required className={input} />)}
        {field("business", "Business / Organization", <input {...aria("business")} value={v.business} onChange={set("business")} autoComplete="organization" className={input} />)}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {field("email", "Email", <input {...aria("email")} type="email" value={v.email} onChange={set("email")} autoComplete="email" required className={input} />)}
        {field("phone", "Phone / WhatsApp", <input {...aria("phone")} type="tel" value={v.phone} onChange={set("phone")} autoComplete="tel" className={input} />)}
      </div>
      {field("type", "Website type", <select {...aria("type")} value={v.type} onChange={set("type")} className={input}>{types.map((t) => <option key={t}>{t}</option>)}</select>)}
      {field("message", "Tell me about your project", <textarea {...aria("message")} rows={5} value={v.message} onChange={set("message")} required className={input} />)}
      <div>
        <button type="submit" disabled={status === "loading"} className="rounded-full bg-acc px-7 py-3.5 text-[14.5px] font-semibold tracking-wide text-accfg transition hover:-translate-y-0.5 disabled:opacity-60">
          {status === "loading" ? "Opening your email app…" : "Start a conversation →"}
        </button>
      </div>
      <div role="status" aria-live="polite">
        {status === "done" && <p className="rounded-lg border border-acc p-4 text-[15px]">Nothing has been sent to a server. Your email app should now open with a draft addressed to {contact.email}. If it did not, use the email or WhatsApp links below.</p>}
      </div>
    </form>
  );
}
