"use client";

import { useMutation } from "@tanstack/react-query";
import { Building2, Clock3, Mail, MapPin, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { FadeIn, SkeletonReveal } from "@/components/motion-primitives";
import { ContactPageSkeleton } from "@/components/skeleton-system";
import { company } from "@/lib/company";
import { liveApi } from "@/lib/api/resources";
import { services } from "@/lib/services";

export function ContactFormSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [inquiryType, setInquiryType] = useState("Project enquiry");
  const [budgetRange, setBudgetRange] = useState("To be discussed");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [consentConfirmed, setConsentConfirmed] = useState(false);
  const mutation = useMutation({
    mutationFn: () => {
      if (honeypot) {
        return Promise.reject(new Error("Submission rejected."));
      }
      return liveApi.createLead({
        name,
        email,
        phone,
        service,
        inquiryType,
        budgetRange,
        serviceInterest: service,
        message,
        source: "Contact form",
        budget: budgetRange,
      });
    },
  });

  const canSubmit = name && email && service && message && consentConfirmed && !mutation.isPending;

  return (
    <SkeletonReveal skeleton={<ContactPageSkeleton />} delay={120}>
      <div className="premium-contact-grid">
        <FadeIn>
          <article className="card glass">
            <p className="eyebrow">Send us a message</p>
            <h3>Tell us about your project or enquiry.</h3>
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
                  <option value="" disabled>Select a service</option>
                  {services.map((item) => (
                    <option key={item.slug}>{item.name}</option>
                  ))}
                </select>
              </label>
              <label>
                Inquiry type
                <select value={inquiryType} onChange={(event) => setInquiryType(event.target.value)}>
                  <option>Project enquiry</option>
                  <option>Support request</option>
                  <option>Access upgrade request</option>
                  <option>Partnership</option>
                  <option>Billing question</option>
                  <option>Career enquiry</option>
                </select>
              </label>
              <label>
                Budget range
                <select value={budgetRange} onChange={(event) => setBudgetRange(event.target.value)}>
                  <option>To be discussed</option>
                  <option>Under Rs 50,000</option>
                  <option>Rs 50,000 - Rs 1,00,000</option>
                  <option>Rs 1,00,000 - Rs 3,00,000</option>
                  <option>Rs 3,00,000+</option>
                  <option>Monthly retainer</option>
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
            <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }}>
              <label htmlFor="honeypot">Leave this empty</label>
              <input id="honeypot" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} />
            </div>
            <label className="consent-checkbox">
              <input
                type="checkbox"
                checked={consentConfirmed}
                onChange={(event) => setConsentConfirmed(event.target.checked)}
              />
              <span>
                I consent to being contacted about my enquiry and agree to the privacy policy.
              </span>
            </label>
            <button type="button" className="primary-button" disabled={!canSubmit} onClick={() => mutation.mutate()}>
              {mutation.isPending ? "Submitting..." : "Submit enquiry"}
            </button>
            {mutation.error ? <p className="field-error">{mutation.error.message}</p> : null}
            {mutation.data ? <p>Lead created successfully.</p> : null}
          </article>
        </FadeIn>
        <FadeIn delay={0.1}>
          <article className="card glass">
            <p className="eyebrow">Direct contact channels</p>
            <h3>Reach us directly through your preferred channel.</h3>
            <div className="contact-action-grid">
              <a href={`mailto:${company.email}`}>
                <Mail aria-hidden="true" />
                <strong>Email</strong>
                <span>{company.email}</span>
              </a>
              <a href={`tel:${company.phone.replace(/\s/g, "")}`}>
                <Phone aria-hidden="true" />
                <strong>Call</strong>
                <span>{company.phone}</span>
              </a>
              <a href={`https://wa.me/${company.whatsapp.replace(/\D/g, "")}`}>
                <MessageCircle aria-hidden="true" />
                <strong>WhatsApp</strong>
                <span>{company.whatsapp}</span>
              </a>
            </div>
            <ul className="detail-list">
              <li><Building2 aria-hidden="true" /> Company operations desk</li>
              <li><MapPin aria-hidden="true" /> {company.address}</li>
              <li><Clock3 aria-hidden="true" /> {company.hours}</li>
              <li><ShieldCheck aria-hidden="true" /> Secure form with CRM-backed routing</li>
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
        </FadeIn>
      </div>
    </SkeletonReveal>
  );
}
