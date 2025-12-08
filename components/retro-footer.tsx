import Image from "next/image";
import Link from "next/link";
import { SiGithub, SiFacebook, SiLinkedin } from "react-icons/si";

const socialLinks = [
  {
    name: "GitHub",
    icon: SiGithub,
    url: "https://github.com/ultraelectronica",
  },
  {
    name: "Facebook",
    icon: SiFacebook,
    url: "https://www.facebook.com/profile.php?id=61577905192138",
  },
  {
    name: "LinkedIn",
    icon: SiLinkedin,
    url: "https://www.linkedin.com/in/fyke-tonel-906663228/",
  },
];

export default function RetroFooter() {
  return (
    <footer className="mt-8 border-t-2 border-border bg-card/80 backdrop-blur-sm dark:border-ring sm:mt-10 sm:border-t-3 md:mt-12 lg:mt-16 md:border-t-4">
      <div className="mx-auto flex max-w-[95vw] flex-col items-center justify-between gap-4 px-4 py-6 sm:gap-5 sm:px-5 sm:py-7 md:flex-row md:gap-8 md:px-6 md:py-8 lg:gap-12">
        {/* Logo and Copyright */}
        <div className="flex flex-col items-center gap-3 sm:gap-3.5 md:flex-row md:items-center md:gap-4">
          <div className="relative h-10 w-10 rounded-none border-2 border-border bg-background p-1 shadow-[3px_3px_0_var(--border)] dark:border-ring sm:h-11 sm:w-11 sm:border-3 sm:shadow-[3.5px_3.5px_0_var(--border)] md:h-12 md:w-12 md:border-4 md:shadow-[4px_4px_0_var(--border)]">
            <Image
              src="/assets/logobrain.png"
              alt="Logo"
              width={40}
              height={40}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="text-center md:text-left">
            <p className="retro text-[0.45rem] uppercase tracking-[0.18em] text-muted-foreground sm:text-[0.55rem] sm:tracking-[0.22em] md:text-xs md:tracking-[0.25em]">
              © 2025 All Rights Reserved
            </p>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="flex items-center gap-3 sm:gap-3.5 md:gap-4">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <Link
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex h-10 w-10 items-center justify-center rounded-none border-2 border-border bg-background shadow-[3px_3px_0_var(--border)] transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-[4px_4px_0_var(--primary)] dark:border-ring sm:h-11 sm:w-11 sm:border-3 sm:shadow-[3.5px_3.5px_0_var(--border)] sm:hover:shadow-[5px_5px_0_var(--primary)] md:h-12 md:w-12 md:border-4 md:shadow-[4px_4px_0_var(--border)] md:hover:shadow-[6px_6px_0_var(--primary)]"
                aria-label={social.name}
              >
                <Icon className="h-5 w-5 transition-colors group-hover:text-primary sm:h-5.5 sm:w-5.5 md:h-6 md:w-6" />
              </Link>
            );
          })}
        </div>
      </div>
    </footer>
  );
}

