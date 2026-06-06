"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, CreditCard, Layers3, Repeat2, ShieldCheck } from "lucide-react";
import { z } from "zod";

import { liveApi } from "@/lib/api/resources";
import { services } from "@/lib/services";

const steps = ["Service", "Business", "Payment", "Review"];
const paymentModes = [
  {
    value: "advance_payment",
    title: "Advance payment",
    detail: "Recommended for projects that start with a deposit and milestone balance.",
    icon: ShieldCheck,
  },
  {
    value: "full_payment",
    title: "Full payment",
    detail: "Best for fixed-scope launches and fast delivery packages.",
    icon: CreditCard,
  },
  {
    value: "milestone_billing",
    title: "Milestone billing",
    detail: "Split invoices across discovery, build, review, and release.",
    icon: Layers3,
  },
  {
    value: "recurring_billing",
    title: "Recurring retainer",
    detail: "Monthly billing for SEO, growth, support, and managed operations.",
    icon: Repeat2,
  },
] as const;

const bookingSchema = z.object({
  companyName: z.string().min(2, "Please enter the company name."),
  contactEmail: z.string().email("Please enter a valid email."),
  contactPhone: z.string().min(7, "Please enter a valid contact phone number."),
  projectBrief: z.string().min(20, "Give a slightly more detailed project brief."),
  deliveryNotes: z.string().min(5, "Add at least a short delivery note."),
  paymentMode: z.enum(["full_payment", "advance_payment", "milestone_billing", "recurring_billing"]),
  requestedFields: z.record(z.string(), z.string()).default({}),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const businessContextSchema = bookingSchema.pick({
  companyName: true,
  contactEmail: true,
  contactPhone: true,
  projectBrief: true,
});

const deliveryNeedsSchema = bookingSchema.pick({
  deliveryNotes: true,
  paymentMode: true,
  requestedFields: true,
});

function parsePriceAmount(price: string) {
  const match = price.replace(/,/g, "").match(/\d+/);
  return match ? Number(match[0]) : 0;
}

export function BookingWizard() {
  const [step, setStep] = useState(0);
  const [serviceSlug, setServiceSlug] = useState(services[0].slug);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const service = useMemo(
    () => services.find((item) => item.slug === serviceSlug) ?? services[0],
    [serviceSlug],
  );
  const priceLabel = selectedPrice ?? service.priceFrom;
  const bookingMutation = useMutation({
    mutationFn: (values: BookingFormValues) =>
      liveApi.createBooking({
        companyName: values.companyName,
        contactEmail: values.contactEmail,
        contactPhone: values.contactPhone,
        serviceSlug: service.slug,
        serviceName: service.name,
        priceLabel,
        amount: parsePriceAmount(priceLabel),
        paymentMode: values.paymentMode,
        projectBrief: values.projectBrief,
        deliveryNotes: values.deliveryNotes,
        requestedFields: {
          ...values.requestedFields,
          ...(selectedPackage ? { selectedPackage } : {}),
        },
      }),
  });
  const form = useForm<BookingFormValues>({
    defaultValues: {
      companyName: "",
      contactEmail: "",
      contactPhone: "",
      projectBrief: "",
      deliveryNotes: "",
      paymentMode: "advance_payment",
      requestedFields: {},
    },
    mode: "onBlur",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const selectedSlug = params.get("service");
    const packageName = params.get("package");
    const packagePrice = params.get("price");

    if (selectedSlug && services.some((item) => item.slug === selectedSlug)) {
      setServiceSlug(selectedSlug);
    }
    if (packageName) {
      setSelectedPackage(packageName);
    }
    if (packagePrice) {
      setSelectedPrice(packagePrice);
    }
  }, []);

  const isLast = step === steps.length - 1;

  const handleContinue = async () => {
    setFormError(null);

    if (step === 1) {
      const result = businessContextSchema.safeParse(form.getValues());

      if (!result.success) {
        setFormError(result.error.issues[0]?.message ?? "Please complete the required fields.");
        return;
      }
    }

    if (step === 2) {
      const result = deliveryNeedsSchema.safeParse(form.getValues());

      if (!result.success) {
        setFormError(result.error.issues[0]?.message ?? "Please complete the required fields.");
        return;
      }
    }

    if (isLast) {
      const isValid = await form.trigger();
      const result = bookingSchema.safeParse(form.getValues());
      if (!isValid || !result.success) {
        setFormError(result.success ? "Please complete the required fields." : result.error.issues[0]?.message);
        return;
      }
      bookingMutation.mutate(form.getValues());
      return;
    }

    setStep(Math.min(steps.length - 1, step + 1));
  };

  return (
    <div className="booking-shell">
      <div className="progress-row">
        {steps.map((item, index) => (
          <div key={item} className={`progress-step ${index <= step ? "active" : ""}`}>
            <span>{index + 1}</span>
            <strong>{item}</strong>
          </div>
        ))}
      </div>
      <div className="booking-grid">
        <div className="card booking-panel glass">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {step === 0 ? (
                <div className="stack">
                  <p className="eyebrow">Premium onboarding</p>
                  <h3>Select the service track</h3>
                  <p>Each PRD-defined service now carries its own visual identity, intake logic, pricing model, and delivery workflow.</p>
                  <div className="booking-service-grid">
                    {services.map((item) => (
                      <button
                        key={item.slug}
                        type="button"
                        className={`booking-service-card ${item.slug === service.slug ? "selected" : ""}`}
                        style={{ ["--svc-base" as string]: item.accent } as React.CSSProperties}
                        onClick={() => {
                          setServiceSlug(item.slug);
                          setSelectedPackage(null);
                          setSelectedPrice(null);
                        }}
                      >
                        <span className="service-card-check">
                            <CheckCircle2 size={14} />
                          </span>
                          <div className="service-card-image">
                            <Image src={item.media.card} alt="" fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 320px" style={{ objectFit: "cover" }} />
                          </div>
                          <div className="service-card-body">
                            <span className="service-card-category">{item.category}</span>
                            <strong className="service-card-name">{item.name}</strong>
                            <span className="service-card-short">{item.short}</span>
                            <span className="service-card-price">{item.priceFrom}</span>
                          </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
              {step === 1 ? (
                <div className="stack">
                  <h3>Business context</h3>
                  <div className="form-grid">
                    <label>
                      Company name
                      <input placeholder="Acme Technologies Pvt Ltd" {...form.register("companyName")} />
                      {form.formState.errors.companyName ? (
                        <small className="field-error">{form.formState.errors.companyName.message}</small>
                      ) : null}
                    </label>
                    <label>
                      Contact email
                      <input placeholder="operations@company.com" {...form.register("contactEmail")} />
                      {form.formState.errors.contactEmail ? (
                        <small className="field-error">{form.formState.errors.contactEmail.message}</small>
                      ) : null}
                    </label>
                    <label>
                      Contact phone
                      <input placeholder="+91 98765 43210" {...form.register("contactPhone")} />
                      {form.formState.errors.contactPhone ? (
                        <small className="field-error">{form.formState.errors.contactPhone.message}</small>
                      ) : null}
                    </label>
                    <label className="span-2">
                      Project brief
                      <textarea
                        placeholder="Describe your goals, scope, and current bottlenecks"
                        rows={5}
                        {...form.register("projectBrief")}
                      />
                      {form.formState.errors.projectBrief ? (
                        <small className="field-error">{form.formState.errors.projectBrief.message}</small>
                      ) : null}
                    </label>
                  </div>
                </div>
              ) : null}
              {step === 2 ? (
                <div className="stack">
                  <p className="eyebrow">Scope and billing</p>
                  <h3>Delivery requirements</h3>
                  <div className="form-grid">
                    {service.bookingFields.map((field) => (
                      <label key={field}>
                        {field}
                        <input
                          placeholder={field}
                          value={form.watch(`requestedFields.${field}`) ?? ""}
                          onChange={(event) => form.setValue(`requestedFields.${field}`, event.target.value)}
                        />
                      </label>
                    ))}
                    <label className="span-2">
                      Delivery notes
                      <textarea
                        placeholder="Preferred timeline, stakeholder notes, success conditions"
                        rows={4}
                        {...form.register("deliveryNotes")}
                      />
                      {form.formState.errors.deliveryNotes ? (
                        <small className="field-error">{form.formState.errors.deliveryNotes.message}</small>
                      ) : null}
                    </label>
                  </div>
                  <div className="payment-mode-grid">
                    {paymentModes.map((mode) => {
                      const Icon = mode.icon;
                      const selected = form.watch("paymentMode") === mode.value;

                      return (
                        <button
                          key={mode.value}
                          type="button"
                          className={`payment-mode-card ${selected ? "selected" : ""}`}
                          onClick={() => form.setValue("paymentMode", mode.value, { shouldValidate: true })}
                        >
                          <Icon aria-hidden="true" />
                          <strong>{mode.title}</strong>
                          <span>{mode.detail}</span>
                          {selected ? <CheckCircle2 aria-hidden="true" /> : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
              {step === 3 ? (
                <div className="stack">
                  <p className="eyebrow">Review and submit</p>
                  <h3>Confirm the booking request</h3>
                  <p>The backend creates the CRM lead, order, project, invoice, payment status, and realtime admin update from this submission.</p>
                  <ul className="detail-list">
                    <li>Selected service: {service.name}</li>
                    <li>Selected package: {selectedPackage ?? "Service starting package"}</li>
                    <li>Selected price: {priceLabel}</li>
                    <li>Expected delivery: {service.delivery}</li>
                    <li>Payment mode: {paymentModes.find((mode) => mode.value === form.getValues("paymentMode"))?.title}</li>
                    <li>Company: {form.getValues("companyName") || "Not provided yet"}</li>
                    <li>Contact: {form.getValues("contactEmail") || "Not provided yet"}</li>
                    <li>Phone: {form.getValues("contactPhone") || "Not provided yet"}</li>
                    <li>Next action: auth, payment, and CRM activation</li>
                  </ul>
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>
          <div className="button-row">
            <button type="button" className="ghost-button" onClick={() => setStep(Math.max(0, step - 1))}>
              Back
            </button>
            <button type="button" className="primary-button" onClick={() => void handleContinue()}>
              {isLast ? "Submit booking" : "Continue"}
            </button>
          </div>
          {bookingMutation.error ? <p className="field-error">{bookingMutation.error.message}</p> : null}
          {formError ? <p className="field-error">{formError}</p> : null}
          {bookingMutation.data ? (
            <p>
              Booking created with invoice {bookingMutation.data.invoice.invoiceNumber}. Admin can now track the order,
              project, invoice, and payment status.
            </p>
          ) : null}
        </div>
        <aside className="card booking-summary glass">
          <div className="booking-summary-image-wrapper">
            <Image src={service.media.hero} alt="" fill sizes="(max-width: 1024px) 100vw, 720px" style={{ objectFit: "cover" }} />
          </div>
          <p className="eyebrow">Selected service</p>
          <h3>{service.name}</h3>
          {selectedPackage ? <p className="selected-package-pill">{selectedPackage} - {priceLabel}</p> : null}
          <p>{service.description}</p>
          <div className="stack-sm">
            <div className="detail-item">
              <strong>Outcomes</strong>
              <span>{service.outcomes.join(" | ")}</span>
            </div>
            <div className="detail-item">
              <strong>Workflow</strong>
              <span>{service.workflow.join(" -> ")}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
