import Image from "next/image";
import { Button } from "@/components/ui/8bit/button";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-24 text-foreground">
      <Image
        className="w-28 dark:invert"
        src="/next.svg"
        alt="Next.js logo"
        width={100}
        height={20}
        priority
      />

      <div className="flex flex-col gap-6 rounded-none border-4 border-border bg-card/80 p-8 text-center shadow-[6px_6px_0_var(--border)] backdrop-blur-sm md:text-left">
        <h1 className="retro text-2xl uppercase tracking-[0.4em] text-foreground">
          Welcome to Fyke&apos;s Laboratory
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          Swap out this hero with your own 8-bit experiments, world-building
          updates, or mission briefings. The animated background stays active
          across every page, so the lab always feels alive.
        </p>
        <div className="flex flex-col gap-4 text-sm font-medium sm:flex-row">
          <Button
            asChild
            variant="default"
            className="h-12 w-full uppercase tracking-[0.3em] md:w-auto"
          >
            <a
              href="https://vercel.com/templates?framework=next.js"
              target="_blank"
              rel="noopener noreferrer"
            >
              Launch Mission
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-12 w-full uppercase tracking-[0.3em] md:w-auto"
          >
            <a
              href="https://nextjs.org/learn"
              target="_blank"
              rel="noopener noreferrer"
            >
              See Docs
            </a>
          </Button>
        </div>
      </div>
    </main>
  );
}
