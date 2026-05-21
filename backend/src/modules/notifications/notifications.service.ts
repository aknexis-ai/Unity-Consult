import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { Resend } from "resend";
import Twilio from "twilio";

import { appConfig } from "../../config/app.config";

type EmailInput = {
  to: string;
  subject: string;
  html: string;
};

type WhatsappInput = {
  to: string;
  body: string;
};

@Injectable()
export class NotificationsService {
  private readonly resend = appConfig.resendApiKey ? new Resend(appConfig.resendApiKey) : null;
  private readonly twilio =
    appConfig.twilioAccountSid && appConfig.twilioAuthToken
      ? Twilio(appConfig.twilioAccountSid, appConfig.twilioAuthToken)
      : null;

  async sendEmail(input: EmailInput) {
    if (!this.resend) {
      throw new ServiceUnavailableException("RESEND_API_KEY is missing. Add it to backend/.env to send live email.");
    }

    return this.resend.emails.send({
      from: "Unity Consult <onboarding@resend.dev>",
      to: input.to,
      subject: input.subject,
      html: input.html,
    });
  }

  async sendEmailIfConfigured(input: EmailInput) {
    if (!this.resend) {
      return { delivered: false, reason: "RESEND_API_KEY is not configured." };
    }

    await this.sendEmail(input);
    return { delivered: true };
  }

  async sendWhatsapp(input: WhatsappInput) {
    if (!this.twilio || !appConfig.twilioWhatsappFrom) {
      throw new ServiceUnavailableException(
        "Twilio WhatsApp keys are missing. Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_WHATSAPP_FROM to backend/.env.",
      );
    }

    return this.twilio.messages.create({
      from: appConfig.twilioWhatsappFrom,
      to: input.to,
      body: input.body,
    });
  }
}
