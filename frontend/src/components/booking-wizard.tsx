"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { liveApi } from "@/lib/api/resources";
import { services } from "@/lib/services";

const steps = ["Choose service", "Business context", "Delivery needs", "Review"];

const bookingSchema = z.object({
  companyName: z.string().min(2, "Please enter the company name."),
  contactEmail: z.string().email("Please enter a valid email."),
  contactPhone: z.string().min(7, "Please enter a valid contact phone number."),
  projectBrief: z.string().min(20, "Give a slightly more detailed project brief."),
  deliveryNotes: z.string().min(5, "Add at least a short delivery note."),
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
  requestedFields: true,
});

function parsePriceAmount(price: string) {
  const match = price.replace(/,/g, "").match(/\d+/);
  return match ? Number(match[0]) : 0;
}

export function BookingWizard() {
  const [step, setStep] = useState(0);
  const [serviceSlug, setServiceSlug] = useState(services[0].slug);
  const [formError, setFormError] = useState<string | null>(null);
  const bookingMutation = useMutation({
    mutationFn: (values: BookingFormValues) =>
      liveApi.createBooking({
        companyName: values.companyName,
        contactEmail: values.contactEmail,
        contactPhone: values.contactPhone,
        serviceSlug: service.slug,
        serviceName: service.name,
        priceLabel: service.priceFrom,
        amount: parsePriceAmount(service.priceFrom),
        projectBrief: values.projectBrief,
        deliveryNotes: values.deliveryNotes,
        requestedFields: values.requestedFields,
      }),
  });
  const form = useForm<BookingFormValues>({
    defaultValues: {
      companyName: "",
      contactEmail: "",
      contactPhone: "",
      projectBrief: "",
      deliveryNotes: "",
      requestedFields: {},
    },
    mode: "onBlur",
  });

  const service = useMemo(
    () => services.find((item) => item.slug === serviceSlug) ?? services[0],
    [serviceSlug],
  );

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
                  <h3>Select a service</h3>
                  <p>Each PRD-defined service has its own intake logic and workflow summary.</p>
                  <div className="option-grid">
                    {services.map((item) => (
                      <button
                        key={item.slug}
                        type="button"
                        className={`select-card ${item.slug === service.slug ? "selected" : ""}`}
                        onClick={() => setServiceSlug(item.slug)}
                      >
                        <strong>{item.name}</strong>
                        <span>{item.short}</span>
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
                </div>
              ) : null}
              {step === 3 ? (
                <div className="stack">
                  <h3>Review</h3>
                  <p>This review step is now schema-backed and ready to hand off to the auth and payment APIs.</p>
                  <ul className="detail-list">
                    <li>Selected service: {service.name}</li>
                    <li>Starting price: {service.priceFrom}</li>
                    <li>Expected delivery: {service.delivery}</li>
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
          <p className="eyebrow">Selected service</p>
          <h3>{service.name}</h3>
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
