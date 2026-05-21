"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { Section } from "@/components/section";
import { SiteShell } from "@/components/site-shell";
import { company } from "@/lib/company";
import { liveApi } from "@/lib/api/resources";
import { services } from "@/lib/services";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");
  const [captchaConfirmed, setCaptchaConfirmed] = useState(false);
  const mutation = useMutation({
    mutationFn: () =>
      liveApi.createLead({
        name,
        email,
        phone,
        service,
        source: "Contact form",
        budget: message,
      }),
  });

  const canSubmit = name && email && service && message && captchaConfirmed && !mutation.isPending;

  return (
    <SiteShell>
      <Section
        eyebrow="Contact"
        title="Lead capture and contact"
        description="Contact submissions now create live backend leads for the admin CRM."
      >
        <div className="split-grid">
          <article className="card">
            <h3>Get in touch</h3>
            <div className="form-grid">
              <label>
                Name
                <input placeholder="Your full name" value={name} onChange={(event) => setName(event.target.value)} />
              </label>
              <label>
                Email
                <input placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} />
              </label>
              <label>
                Phone
                <input placeholder="+91 98765 43210" value={phone} onChange={(event) => setPhone(event.target.value)} />
              </label>
              <label>
                Service
                <select value={service} onChange={(event) => setService(event.target.value)}>
                  <option value="" disabled>
                    Select a service
                  </option>
                  {services.map((item) => (
                    <option key={item.slug}>{item.name}</option>
                  ))}
                </select>
              </label>
              <label className="span-2">
                Message
                <textarea
                  placeholder="Tell us what you need, your timeline, and the current blockers."
                  rows={5}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                />
              </label>
            </div>
            <label className="recaptcha-fallback">
              <input
                type="checkbox"
                checked={captchaConfirmed}
                onChange={(event) => setCaptchaConfirmed(event.target.checked)}
              />
              <span>
                I confirm this enquiry is genuine. This field is reCAPTCHA-ready and can be replaced by
                Google reCAPTCHA keys in production.
              </span>
            </label>
            <button type="button" className="primary-button" disabled={!canSubmit} onClick={() => mutation.mutate()}>
              {mutation.isPending ? "Submitting..." : "Submit enquiry"}
            </button>
            {mutation.error ? <p className="field-error">{mutation.error.message}</p> : null}
            {mutation.data ? <p>Lead created successfully.</p> : null}
          </article>
          <article className="card">
            <h3>Business details</h3>
            <ul className="detail-list">
              <li>{company.email}</li>
              <li>{company.phone}</li>
              <li>{company.whatsapp}</li>
              <li>{company.address}</li>
              <li>{company.hours}</li>
            </ul>
            <div className="map-embed" aria-label="Unity Consult office map">
              <iframe
                title="Unity Consult office location"
                src={company.mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </article>
        </div>
      </Section>
    </SiteShell>
  );
}
