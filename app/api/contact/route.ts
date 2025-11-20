import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, message, to } = body;

    if (!email || !message) {
      return NextResponse.json(
        { error: "Email and message are required" },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>", // You'll need to update this with your verified domain
      to: to || "athrundiscinity@protonmail.com",
      replyTo: email,
      subject: "New Contact Form Submission",
      html: `
        <div style="font-family: monospace; padding: 20px; background-color: #f5f5f5;">
          <h2 style="color: #333; text-transform: uppercase; letter-spacing: 0.2em;">New Message from Contact Form</h2>
          <div style="background-color: white; border: 4px solid #333; padding: 20px; margin-top: 20px;">
            <p style="margin-bottom: 10px;"><strong>From:</strong> ${email}</p>
            <hr style="border: 2px dashed #333; margin: 20px 0;" />
            <div style="white-space: pre-wrap; line-height: 1.6;">
              ${message}
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Email sent successfully", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}

