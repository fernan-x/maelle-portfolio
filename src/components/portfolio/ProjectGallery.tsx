import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import type { GalleryItem, Project } from "./data";

export type Origin = { x: number; y: number };

function Media({ item }: { item: GalleryItem }) {
  if (item.type === "image")
    return <img src={item.src} alt={item.alt} draggable={false} className="h-full w-full object-contain" />;
  if (item.type === "video")
    return (
      <video src={item.src} poster={item.poster} controls playsInline className="h-full w-full object-contain">
        {item.alt}
      </video>
    );
  return <iframe src={item.src} title={item.alt} allowFullScreen className="h-full w-full border-0" />;
}

/** Swipeable gallery: 1:1 finger tracking and momentum snapping come from Embla. */
function Gallery({ items }: { items: GalleryItem[] }) {
  const [viewportRef, embla] = useEmblaCarousel({ loop: items.length > 1, duration: 25 });
  const prev = useCallback(() => embla?.scrollPrev(), [embla]);
  const next = useCallback(() => embla?.scrollNext(), [embla]);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setSelected(embla.selectedScrollSnap());
    onSelect();
    embla.on("select", onSelect);
    return () => {
      embla.off("select", onSelect);
    };
  }, [embla]);

  return (
    <div className="relative" data-vaul-no-drag>
      <div ref={viewportRef} className="overflow-hidden rounded-2xl bg-mist">
        <div className="flex">
          {items.map((item, n) => (
            <div key={`${item.src}-${n}`} className="aspect-video min-w-0 flex-[0_0_100%]">
              <Media item={item} />
            </div>
          ))}
        </div>
      </div>
      {items.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Précédent"
            onClick={prev}
            className="press absolute left-3 top-1/2 h-11 w-11 -translate-y-1/2 rounded-xl bg-background/90 text-lg font-semibold text-foreground backdrop-blur"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Suivant"
            onClick={next}
            className="press absolute right-3 top-1/2 h-11 w-11 -translate-y-1/2 rounded-xl bg-background/90 text-lg font-semibold text-foreground backdrop-blur"
          >
            →
          </button>
          <p className="mt-3 text-center text-xs text-muted-foreground" aria-live="polite">
            {selected + 1} / {items.length}
          </p>
        </>
      )}
    </div>
  );
}

function Body({ project, items }: { project: Project; items: GalleryItem[] }) {
  return (
    <>
      <div className="space-y-4">
        <p className="leading-relaxed">{project.body}</p>
        {project.details && (
          <div className="rounded-2xl bg-mist p-5 sm:p-6">
            {project.details.heading && (
              <p className="font-display text-lg font-semibold">{project.details.heading}</p>
            )}
            <div className={`space-y-3 text-sm leading-relaxed ${project.details.heading ? "mt-3" : ""}`}>
              {project.details.paragraphs.map((para) => {
                const m = para.match(/^([^:]{2,45}) : (.*)$/s);
                return (
                  <p key={para}>
                    {m ? (<><strong className="font-semibold">{m[1]}</strong> : {m[2]}</>) : para}
                  </p>
                );
              })}
            </div>
          </div>
        )}
        <ul className="flex flex-wrap gap-2">
          {project.bullets.map((b) => (
            <li key={b} className="rounded-xl border border-border px-3 py-1.5 text-xs font-medium">{b}</li>
          ))}
        </ul>
      </div>
      <p className="pt-2 font-display text-lg font-semibold">Galerie</p>
      <Gallery key={project.title} items={items} />
    </>
  );
}

export function ProjectGallery({
  project: current,
  origin,
  onClose,
}: {
  project: Project | null;
  origin: Origin | null;
  onClose: () => void;
}) {
  const isMobile = useIsMobile();
  // Keep the last project mounted so the exit animation has content to show.
  const lastProject = useRef<Project | null>(null);
  if (current) lastProject.current = current;
  const project = current ?? lastProject.current;
  const items: GalleryItem[] = project
    ? [...project.images.map((i) => ({ type: "image" as const, ...i })), ...(project.gallery ?? [])]
    : [];

  // Offset from viewport centre to the trigger: the dialog leaves from and returns to it.
  const dx = origin && typeof window !== "undefined" ? origin.x - window.innerWidth / 2 : 0;
  const dy = origin && typeof window !== "undefined" ? origin.y - window.innerHeight / 2 : 0;

  if (isMobile) {
    return (
      <Drawer open={!!current} onOpenChange={(o) => !o && onClose()} shouldScaleBackground={false}>
        <DrawerContent className="max-h-[92vh]">
          {project && items.length > 0 && (
            <div className="space-y-4 overflow-y-auto overscroll-contain p-5 pb-8">
              <div>
                <DrawerTitle className="font-display text-2xl">{project.title}</DrawerTitle>
                <DrawerDescription className="text-sm text-muted-foreground">{project.kicker}</DrawerDescription>
              </div>
              <Body project={project} items={items} />
            </div>
          )}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={!!current} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        style={{ "--dx": `${dx}px`, "--dy": `${dy}px` } as React.CSSProperties}
        className="dialog-fly max-h-[90vh] max-w-4xl overflow-y-auto overscroll-contain rounded-3xl bg-background p-5 sm:p-8"
      >
        {project && items.length > 0 && (
          <>
            <div>
              <DialogTitle className="font-display text-2xl">{project.title}</DialogTitle>
              <DialogDescription>{project.kicker}</DialogDescription>
            </div>
            <Body project={project} items={items} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
