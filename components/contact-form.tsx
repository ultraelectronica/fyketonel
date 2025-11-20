"use client";

import { useState } from "react";
import { Button } from "@/components/ui/8bit/button";
import { Input } from "@/components/ui/8bit/input";
import { Textarea } from "@/components/ui/8bit/textarea";

export default function ContactForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          message,
          to: "athrundiscinity@protonmail.com",
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setEmail("");
        setMessage("");
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 md:space-y-8">
      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
          <label
            htmlFor="email"
            className="retro block text-[0.5rem] uppercase tracking-[0.18em] text-muted-foreground sm:text-xs sm:tracking-[0.22em] md:text-sm lg:text-base md:tracking-[0.25em]"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={isSubmitting}
            className="w-full h-10 text-xs px-3 sm:h-12 sm:text-sm sm:px-4 md:h-14 md:text-base md:px-6"
          />
        </div>

        <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
          <label
            htmlFor="message"
            className="retro block text-[0.5rem] uppercase tracking-[0.18em] text-muted-foreground sm:text-xs sm:tracking-[0.22em] md:text-sm lg:text-base md:tracking-[0.25em]"
          >
            Message
          </label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Got any goodies? Send me a message.."
            required
            disabled={isSubmitting}
            rows={8}
            className="w-full resize-none text-xs px-3 py-3 sm:text-sm sm:px-4 sm:py-3 sm:rows-9 md:text-base md:px-6 md:py-4 md:rows-10"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="retro w-full uppercase tracking-[0.2em] h-10 text-xs sm:h-12 sm:text-sm sm:tracking-[0.25em] md:h-14 lg:h-16 md:text-base md:tracking-[0.3em]"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>

      {submitStatus === "success" && (
        <div className="retro rounded-none border-2 border-green-500 bg-green-500/10 p-3 text-center text-[0.5rem] uppercase tracking-[0.15em] text-green-500 sm:border-3 sm:p-3.5 sm:text-xs sm:tracking-[0.18em] md:border-4 md:p-4 md:text-sm md:tracking-[0.2em]">
          Message sent successfully!
        </div>
      )}

      {submitStatus === "error" && (
        <div className="retro rounded-none border-2 border-destructive bg-destructive/10 p-3 text-center text-[0.5rem] uppercase tracking-[0.15em] text-destructive sm:border-3 sm:p-3.5 sm:text-xs sm:tracking-[0.18em] md:border-4 md:p-4 md:text-sm md:tracking-[0.2em]">
          Failed to send message. Please try again.
        </div>
      )}
    </form>
  );
}

