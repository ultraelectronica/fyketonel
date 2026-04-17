import { cn } from "@/lib/utils";

const workExperiences = [
  {
    company: "Inspire Holdings Inc.",
    role: "Back-End Developer (Intern)",
    period: "January 2026 – February 2026",
    projectsFullWidth: true,
    projects: [
      {
        name: "Inspire Wallet & Admin 2.0",
        highlights: [
          "Served as the Technical Lead for Inspire Wallet and Admin 2.0, a FinTech investment platform, overseeing the full backend lifecycle and architectural decisions.",
          "Architected a scalable backend infrastructure using NestJS and AWS, implementing load balancing, rate limiting, and local/remote caching via Redis to ensure high availability.",
          "Engineered the payment gateway integration for versions 1.0 and 2.0 using the UnionBank API, ensuring secure and seamless financial transactions.",
          "Optimized database performance and management using Supabase and ORMs, while handling transactional emails via Resend.",
          "Wrote comprehensive unit tests to validate core logic and security features, and collaborated cross-functionally to ensure UI/UX quality standards were met.",
          "Defined and implemented the company's first proper SDLC and a collaborative QA testing protocol involving cross-team validation to reduce bugs in production.",
        ],
      },
    ],
  },
  {
    company: "SOCIA I.T. Solutions",
    role: "Software Developer (Intern)",
    period: "February 2026 – March 2026",
    projects: [
      {
        name: "Lootbx Mobile",
        highlights: [
          'Architected and fully implemented the streaming and "reels" functionalities using WebSockets and dedicated APIs.',
          "Improved UI/UX responsiveness to make the mobile experience faster and more fluid.",
          "Engineered the transition from web to mobile by building robust logical states for core functions and components.",
          "Contributed to API development and integration to improve the overall user experience.",
        ],
      },
      {
        name: "Papa Burger Ecosystem",
        highlights: [
          "Built the full front-end architecture from the ground up and integrated critical backend APIs for a large restaurant ecosystem.",
          "Developed an enterprise-level suite covering the POS system, Driver Portal, Landing Page, and Franchising modules.",
          "Contributed to API development and integration to improve the overall user experience.",
        ],
      },
    ],
  },
];

export default function WorkExperienceContainer({ className }: { className?: string }) {
  const count = workExperiences.length;

  return (
    <section
      className={cn(
        "relative overflow-hidden border-2 border-border bg-card text-card-foreground shadow-[4px_4px_0_var(--border)]",
        className,
      )}
    >
      <div className="border-b-2 border-border bg-muted/30 px-4 py-3">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="retro text-[0.65rem] uppercase tracking-[0.25em] text-primary">Career Log</p>
            <h2 className="retro mt-1 text-lg uppercase tracking-[0.14em] text-foreground sm:text-xl">
              Work Experience
            </h2>
          </div>
          <div className="retro text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
            {count} company archive{count === 1 ? "" : "s"} loaded
          </div>
        </div>
      </div>

      <div className="space-y-8 p-4 sm:p-5">
        {workExperiences.map((workExperience) => (
          <div key={workExperience.company} className="space-y-4">
            <div className="border-2 border-dashed border-primary/60 bg-background/70 p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="retro text-[0.65rem] uppercase tracking-[0.25em] text-primary">Employer</p>
                  <h3 className="retro mt-1 text-base uppercase tracking-[0.14em] text-foreground sm:text-lg">
                    {workExperience.company}
                  </h3>
                  <p className="retro mt-2 text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground sm:text-[0.65rem]">
                    {workExperience.period}
                  </p>
                </div>
                <div className="border-2 border-border bg-card px-3 py-2 text-left lg:min-w-[280px] lg:text-right">
                  <p className="retro text-[0.6rem] uppercase tracking-[0.22em] text-muted-foreground">Role</p>
                  <p className="retro mt-1 text-xs uppercase tracking-[0.12em] text-foreground sm:text-sm">
                    {workExperience.role}
                  </p>
                </div>
              </div>
            </div>

            <div
              className={cn(
                "grid gap-4",
                "projectsFullWidth" in workExperience && workExperience.projectsFullWidth
                  ? "grid-cols-1"
                  : "xl:grid-cols-2",
              )}
            >
              {workExperience.projects.map((project) => (
                <article
                  key={`${workExperience.company}-${project.name}`}
                  className="flex h-full flex-col border-2 border-border bg-background/60 p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-3 border-b border-dashed border-border pb-2">
                    <h3 className="retro text-sm uppercase tracking-[0.14em] text-foreground sm:text-base">
                      {project.name}
                    </h3>
                    <span className="retro shrink-0 text-[0.55rem] uppercase tracking-[0.22em] text-primary">
                      Project
                    </span>
                  </div>

                  <ul className="space-y-3">
                    {project.highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-2">
                        <span className="retro pt-0.5 text-[0.65rem] text-primary">&gt;</span>
                        <p className="retro text-[0.65rem] leading-relaxed text-muted-foreground sm:text-[0.7rem]">
                          {highlight}
                        </p>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
