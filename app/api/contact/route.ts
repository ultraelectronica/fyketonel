import { NextResponse } from "next/server";
import { Resend } from "resend";
import { isValidContactDeviceId } from "@/lib/contact-device-id";
import {
  escapeHtml,
  isValidContactEmail,
  isValidContactMessage,
  normalizeContactEmail,
  normalizeContactMessage,
} from "@/lib/contact-validation";
import { tryReserveContactSend, undoContactReserve } from "@/lib/contact-rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY);
const CONTACT_RECIPIENT = "athrundiscinity@protonmail.com";

export async function POST(request: Request) {
  let slotReservedForDevice: string | undefined;
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { deviceId } = body;
    const email = normalizeContactEmail(body.email);
    const message = normalizeContactMessage(body.message);

    if (!email || !message) {
      return NextResponse.json(
        { error: "Email and message are required" },
        { status: 400 }
      );
    }

    if (!isValidContactEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    if (!isValidContactMessage(message)) {
      return NextResponse.json(
        { error: "Message is too long" },
        { status: 400 }
      );
    }

    if (!isValidContactDeviceId(deviceId)) {
      return NextResponse.json(
        { error: "Invalid or missing device id" },
        { status: 400 }
      );
    }

    const rate = tryReserveContactSend(deviceId);
    if (!rate.ok) {
      const retryAfterSec = Math.ceil(rate.retryAfterMs / 1000);
      return NextResponse.json(
        {
          error: "Too many messages. You can send up to 3 emails every 5 hours from this device.",
          retryAfterSeconds: retryAfterSec,
        },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfterSec) },
        }
      );
    }

    slotReservedForDevice = deviceId;

    const escapedEmail = escapeHtml(email);
    const escapedMessage = escapeHtml(message);

    const { data, error } = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>", // You'll need to update this with your verified domain
      to: CONTACT_RECIPIENT,
      replyTo: email,
      subject: "New Contact Form Submission",
      html: `
        <div style="font-family: monospace; padding: 20px; background-color: #f5f5f5;">
          <h2 style="color: #333; text-transform: uppercase; letter-spacing: 0.2em;">New Message from Contact Form</h2>
          <div style="background-color: white; border: 4px solid #333; padding: 20px; margin-top: 20px;">
            <p style="margin-bottom: 10px;"><strong>From:</strong> ${escapedEmail}</p>
            <hr style="border: 2px dashed #333; margin: 20px 0;" />
            <div style="white-space: pre-wrap; line-height: 1.6;">
              ${escapedMessage}
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      undoContactReserve(deviceId);
      slotReservedForDevice = undefined;
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    slotReservedForDevice = undefined;

    return NextResponse.json(
      { message: "Email sent successfully", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    if (slotReservedForDevice) undoContactReserve(slotReservedForDevice);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
