import { useEffect, useRef, useState } from "react";
import { Palette, Share2, Globe, Users, Sparkles, Wrench, ListChecks, type LucideIcon } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { ProjectGallery, type Origin } from "@/components/portfolio/ProjectGallery";
import portrait from "@/assets/portrait.webp";
import portraitSm from "@/assets/portrait-320.webp";
import { type Project, projects, strengths, experiences, toolGroups, highlights } from "@/components/portfolio/data";

/** Public origin, injected at build time (`VITE_SITE_URL`); used for canonical / OG URLs. */
const SITE_URL = (import.meta.env.VITE_SITE_URL ?? "https://example.com").replace(/\/$/, "");
const TITLE = "Maëlle Picourlat — Marketing & Communication Digitale";
const DESCRIPTION =
  "Portfolio de Maëlle Picourlat : stratégie digitale, réseaux sociaux, création graphique, site web et événementiel. Basée à Nantes.";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Maëlle Picourlat",
  jobTitle: "Cheffe de projet marketing & communication digitale",
  url: SITE_URL,
  image: `${SITE_URL}/og-image.jpg`,
  email: "mailto:mae.picourlat@gmail.com",
  address: { "@type": "PostalAddress", addressLocality: "Nantes", addressCountry: "FR" },
  sameAs: ["https://www.linkedin.com/in/ma%C3%ABlle-picourlat/"],
  knowsAbout: ["Marketing digital", "Réseaux sociaux", "SEO", "CRM", "Événementiel"],
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "ISEG Nantes" },
    { "@type": "CollegeOrUniversity", name: "UCO Nantes" },
  ],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fr_FR" },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: `${SITE_URL}/og-image.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Maëlle Picourlat — Marketing & communication digitale" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${SITE_URL}/og-image.jpg` },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(personJsonLd) }],
  }),
  component: Index,
});

const toneClasses: Record<string, string> = {
  ink: "bg-ink text-primary-foreground",
  lilac: "bg-lilac text-lilac-foreground",
  wisteria: "bg-wisteria text-wisteria-foreground",
  spruce: "bg-spruce text-spruce-foreground",
};

const toneChip: Record<string, string> = {
  ink: "bg-primary-foreground/15 text-primary-foreground",
  lilac: "bg-lilac-foreground/20 text-lilac-foreground",
  wisteria: "bg-ink/10 text-ink",
  spruce: "bg-spruce-foreground/15 text-spruce-foreground",
};

const toolIcons: Record<string, LucideIcon> = {
  "Création": Palette,
  Social: Share2,
  "Google & web": Globe,
  CRM: Users,
  IA: Sparkles,
  Projet: ListChecks,
};

const sections = [
  { id: "profil", label: "Qui je suis" },
  { id: "projets", label: "Projets" },
  { id: "atouts", label: "Atouts" },
  { id: "contact", label: "Contact" },
];

/** True once the element has entered the viewport (one-shot). */
function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return setSeen(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

/** Fades/translates a block in once, when it first enters the viewport. `step` staggers siblings by 40ms. */
function Reveal({
  children,
  className = "",
  step = 0,
}: {
  children: React.ReactNode;
  className?: string;
  step?: number;
}) {
  const [ref, seen] = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      data-in={seen}
      className={`reveal ${className}`}
      style={step ? { transitionDelay: `${Math.min(step, 5) * 40}ms` } : undefined}
    >
      {children}
    </div>
  );
}

/** Career timeline: the line draws down, then entries fade in 80ms apart. */
function Timeline() {
  const [ref, seen] = useInView<HTMLOListElement>();
  return (
    <ol ref={ref} data-in={seen} className="timeline relative mt-8 pl-8">
      <span aria-hidden className="tl-line absolute bottom-0 left-0 top-0 w-0.5 bg-lilac" />
      {experiences.map((x, n) => (
        <li
          key={x.company}
          className="tl-item relative pb-10 last:pb-0"
          style={{ transitionDelay: `${150 + n * 80}ms` }}
        >
          <span className="absolute -left-[2.6rem] top-1 h-4 w-4 rounded-md bg-ink ring-4 ring-background" />
          <p className="text-xs font-semibold uppercase tracking-widest text-spruce">{x.period}</p>
          <p className="mt-2 font-display text-2xl font-semibold">{x.company}</p>
          <p className="mt-1 text-muted-foreground">{x.role}</p>
        </li>
      ))}
    </ol>
  );
}

/** Contact link that confirms the hand-off to the mail/phone app (the OS does it silently). */
function ContactLink({
  href,
  label,
  value,
  external = false,
}: {
  href: string;
  label: string;
  value: string;
  external?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const onClick = () => {
    if (external) return;
    setBusy(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setBusy(false), 1200);
  };
  return (
    <a
      href={href}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="press rounded-2xl bg-surface/85 p-6 transition-colors hover:bg-surface"
    >
      <span className="grid text-xs uppercase tracking-widest opacity-75">
        <span className={`col-start-1 row-start-1 transition-opacity duration-150 ${busy ? "opacity-0" : ""}`}>
          {label}
        </span>
        <span
          aria-live="polite"
          className={`col-start-1 row-start-1 transition-opacity duration-150 ${busy ? "" : "opacity-0"}`}
        >
          {busy ? "Ouverture…" : ""}
        </span>
      </span>
      <p className="mt-2 font-medium">{value}</p>
    </a>
  );
}

function Index() {
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const [origin, setOrigin] = useState<Origin | null>(null);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const openFrom = (p: Project, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    setOrigin({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    setOpenProject(p);
  };
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className={`glass sticky top-0 z-30 border-b bg-background/70 backdrop-blur-xl backdrop-saturate-150 transition-colors duration-200 ${scrolled ? "border-border" : "border-transparent"}`}>
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <a href="#profil" className="press -my-2 inline-flex items-center py-2 font-display text-base font-semibold tracking-tight">
            Maëlle Picourlat
          </a>
          <ul className="hidden items-center gap-1 md:flex">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="press rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="mailto:mae.picourlat@gmail.com"
            className="press rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Me contacter
          </a>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-24">
        {/* Hero */}
        <section id="profil" className="grid gap-4 pt-10 md:grid-cols-12 md:pt-16">
          <div className="block-card md:col-span-8 p-8 md:p-12">
            <span className="inline-block rounded-lg bg-mist px-3 py-1.5 text-xs font-medium uppercase tracking-widest text-primary">
              Portfolio 2026
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.03em] md:text-6xl">
              Cheffe de projet<br />
              market &amp; com digitale
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              J'aime la communication autant que ce qui la fait aboutir : cadrer un projet, confronter
              les idées à plusieurs, tenir les objectifs du brief à la publication. Contenus, réseaux
              sociaux, site web, print, événements : je les conçois et je les produis. Six ans en B2B,
              de Nantes à New York.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {["Gestion de projet", "Site web & SEO", "CRM & marketing automation", "Événementiel", "Collaboration"].map(
                (e) => (
                  <span
                    key={e}
                    className="rounded-xl border border-border bg-mist px-4 py-2 text-sm font-medium"
                  >
                    {e}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="md:col-span-4 grid gap-4">
            <div className="overflow-hidden rounded-3xl border border-border bg-mist">
              <img
                src={portrait}
                srcSet={`${portraitSm} 320w, ${portrait} 600w`}
                sizes="(min-width: 768px) 380px, 90vw"
                width={600}
                height={600}
                fetchPriority="high"
                decoding="async"
                alt="Portrait de Maëlle Picourlat"
                className="aspect-square w-full object-cover"
              />
            </div>
            <HighlightCard />
          </div>
        </section>

        {/* Projets */}
        <section id="projets" className="scroll-mt-24 pt-10">
          <h2 className="font-display text-3xl font-semibold md:text-4xl">Mes projets</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Quatre terrains sur lesquels j'interviens, de la stratégie à la production.
          </p>
          <div className="mt-14 flex flex-col gap-20 md:gap-28">
            {projects.map((p, i) => {
              const reverse = i % 2 === 1;
              const shape = (toneClasses[p.tone] ?? "").split(" ")[0] ?? "";
              return (
                <Reveal key={p.title}>
                <article className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
                  <button
                    type="button"
                    onClick={(e) => openFrom(p, e.currentTarget)}
                    className={`press group relative md:col-span-6 ${reverse ? "md:order-2" : ""}`}
                    aria-label={`En savoir plus : ${p.title}`}
                  >
                    <span
                      aria-hidden
                      className={`absolute -z-0 h-2/3 w-2/3 rounded-3xl ${shape} ${reverse ? "-right-4 -top-4 md:-right-6 md:-top-6" : "-left-4 -top-4 md:-left-6 md:-top-6"}`}
                    />
                    <span
                      aria-hidden
                      className={`absolute h-16 w-16 rounded-2xl bg-lilac ${reverse ? "-bottom-5 -left-5" : "-bottom-5 -right-5"}`}
                    />
                    <img
                      src={p.images[0].small}
                      srcSet={`${p.images[0].small} 640w, ${p.images[0].src} 1200w`}
                      sizes="(min-width: 768px) 560px, 90vw"
                      decoding="async"
                      alt={p.images[0].alt}
                      loading="lazy"
                      width={1024}
                      height={768}
                      className="relative aspect-[4/3] w-full rounded-3xl object-cover transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-1"
                    />
                  </button>
                  <div className={`md:col-span-6 ${reverse ? "md:order-1" : ""}`}>
                    <p className="font-display text-sm font-semibold text-accent">
                      {String(i + 1).padStart(2, "0")} — {p.kicker}
                    </p>
                    <h3 className="mt-3 font-display text-3xl font-semibold md:text-4xl">{p.title}</h3>
                    <p className="mt-4 leading-relaxed text-muted-foreground">{p.body}</p>
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {p.bullets.map((b) => (
                        <li key={b} className="rounded-xl bg-mist px-3 py-1.5 text-xs font-medium">
                          {b}
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={(e) => openFrom(p, e.currentTarget)}
                      className="press mt-8 rounded-xl bg-ink px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
                    >
                      En savoir plus →
                    </button>
                  </div>
                </article>
                </Reveal>
              );
            })}
          </div>
          <ProjectGallery project={openProject} origin={origin} onClose={() => setOpenProject(null)} />
        </section>

        {/* Parcours */}
        <section className="scroll-mt-24 pt-20 grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <h2 className="font-display text-3xl font-semibold md:text-4xl">Parcours</h2>
            <Timeline />
          </div>
          <div className="md:col-span-5">
            <h2 className="font-display text-3xl font-semibold md:text-4xl">Formation</h2>
            <dl className="mt-8">
              {[
                { year: "2021", title: "Master Communication & Marketing Digital", place: "ISEG Nantes" },
                { year: "2019", title: "Licence Information & Communication", place: "UCO Nantes" },
                { year: "FR · EN", title: "Langues", place: "Français natif · Anglais professionnel" },
              ].map((f) => (
                <div key={f.title} className="grid grid-cols-[5.5rem_1fr] gap-4 border-t-2 border-ink py-5 last:border-b-2">
                  <dt className="font-display text-xl font-semibold text-lilac">{f.year}</dt>
                  <dd>
                    <p className="font-medium">{f.title}</p>
                    <p className="text-sm text-muted-foreground">{f.place}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Atouts */}
        <section id="atouts" className="scroll-mt-24 pt-20">
          <h2 className="font-display text-3xl font-semibold md:text-4xl">Mes atouts</h2>
          <div className="mt-8 grid gap-4 rounded-3xl bg-mist p-4 sm:grid-cols-2 md:p-6 lg:grid-cols-3">
            {strengths.map((s, i) => (
              <Reveal key={s.title} step={i % 3} className="h-full">
              <div className="h-full rounded-2xl bg-surface p-7">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-lilac text-sm font-semibold text-lilac-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-12">
            <h3 className="font-display text-lg font-semibold">Outils</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {toolGroups.map((g, gi) => (
                <Reveal key={g.label} step={gi % 3} className="h-full">
                <div className="block-card h-full p-5">
                  <div className="flex items-center gap-3">
                    {(() => { const I = toolIcons[g.label] ?? Wrench; return (
                      <I size={22} className="text-accent" />
                    ); })()}
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary">{g.label}</p>
                  </div>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {g.items.map((it) => (
                      <li key={it} className="rounded-lg bg-mist px-2.5 py-1 text-xs font-medium">{it}</li>
                    ))}
                  </ul>
                </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

      </main>

      <footer className="mt-20 bg-wisteria text-wisteria-foreground">
        <div className="mx-auto max-w-6xl px-5 pb-8 pt-16">
        {/* Contact */}
        <section id="contact" className="scroll-mt-24">
          <div className="pb-4">
            <h2 className="font-display text-3xl font-semibold md:text-5xl">Travaillons ensemble</h2>
            <p className="mt-4 max-w-lg opacity-80">
              Disponible pour des missions en marketing et communication digitale, à Nantes et à
              distance.
            </p>
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              <ContactLink href="mailto:mae.picourlat@gmail.com" label="Email" value="mae.picourlat@gmail.com" />
              <ContactLink href="tel:+33601401834" label="Téléphone" value="06 01 40 18 34" />
              <ContactLink
                href="https://www.linkedin.com/in/ma%C3%ABlle-picourlat/"
                label="LinkedIn"
                value="Maëlle Picourlat"
                external
              />
              <div className="rounded-2xl bg-surface/85 p-6">
                <p className="text-xs uppercase tracking-widest opacity-75">Localisation</p>
                <p className="mt-2 font-medium">Nantes, France</p>
              </div>
            </div>
          </div>
        </section>
          <p className="mt-16 font-display text-5xl font-semibold leading-none tracking-tight md:text-8xl">
            Maëlle Picourlat
          </p>
          <div className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t-2 border-wisteria-foreground pt-6 text-sm">
            <nav className="flex flex-wrap gap-x-6 gap-y-2 font-medium">
              {sections.map((s) => (
                <a key={s.id} href={`#${s.id}`} className="inline-block py-2 underline-offset-4 hover:underline">
                  {s.label}
                </a>
              ))}
              <a href="https://www.linkedin.com/in/ma%C3%ABlle-picourlat/" target="_blank" rel="noreferrer" className="inline-block py-2 underline-offset-4 hover:underline">
                LinkedIn ↗
              </a>
            </nav>
            <p className="opacity-80">© 2026 · Marketing &amp; communication digitale · Nantes</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HighlightCard() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % highlights.length), 3500);
    return () => clearInterval(t);
  }, [paused, i]);
  // `shown` lags `i` by the exit: old value fades out (150ms), then the new one rises in (250ms).
  const [shown, setShown] = useState(0);
  const [out, setOut] = useState(false);
  useEffect(() => {
    if (i === shown) return;
    setOut(true);
    const t = setTimeout(() => {
      setShown(i);
      setOut(false);
    }, 150);
    return () => clearTimeout(t);
  }, [i, shown]);
  const h = highlights[shown] ?? highlights[0]!;
  return (
    <div
      className="flex min-h-[11rem] flex-col justify-between rounded-3xl bg-ink p-7 text-primary-foreground"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        aria-live="off"
        className={`transition-[opacity,transform] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:translate-y-0 motion-reduce:duration-150 ${out ? "translate-y-2 opacity-0 duration-150" : "translate-y-0 opacity-100 duration-[250ms]"}`}
      >
        <p className="font-display text-5xl font-semibold">{h.value}</p>
        <p className="mt-2 text-sm opacity-80">{h.text}</p>
      </div>
      <div className="-mb-2 mt-5 flex">
        {highlights.map((_, n) => (
          <button
            key={n}
            type="button"
            aria-label={`Chiffre clé ${n + 1}`}
            onClick={() => setI(n)}
            className="press group flex h-6 items-center px-1"
          >
            <span
              className={`block h-1.5 rounded-full transition-all duration-300 ${n === i ? "w-6 bg-primary-foreground" : "w-3 bg-primary-foreground/30 group-hover:bg-primary-foreground/60"}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
