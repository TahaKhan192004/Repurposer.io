"use client";

import { useEffect } from "react";
import { scroll } from "motion";

/** Scroll values are written directly to elements, without React rerenders. */
export function ScrollExperience() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia(
      "(min-width: 900px) and (min-height: 650px)",
    );
    let dispose = () => {};
    const setup = () => {
      dispose();
      if (reduced.matches) return;
      const stops: VoidFunction[] = [];
      const originals = new Map<HTMLElement, string | null>();
      const remember = (element: HTMLElement) => {
        if (!originals.has(element))
          originals.set(element, element.getAttribute("style"));
        return element;
      };
      const find = (selector: string) => {
        const element = document.querySelector<HTMLElement>(selector);
        return element ? remember(element) : null;
      };
      document.documentElement.classList.add("motion-ready");
      const progress = find(".reading-progress");
      if (progress)
        stops.push(
          scroll((p: number) => {
            progress.style.transform = `scaleX(${p})`;
          }),
        );
      const hero = find(".scroll-story");
      const deck = find(".content-deck");
      const draft = find(".sheet-draft");
      const linkedin = find(".sheet-linkedin");
      const instagram = find(".sheet-instagram");
      if (hero && deck && draft && linkedin && instagram) {
        if (desktop.matches) {
          document.documentElement.classList.add("motion-desktop");
          stops.push(
            scroll(
              (p: number) => {
                deck.style.transform = `rotateX(${3 - p * 3}deg) rotateY(${-9 + p * 12}deg) rotateZ(${2 - p * 3}deg)`;
                draft.style.transform = `translate3d(0,${-p * 8}px,${45 + p * 20}px)`;
                linkedin.style.transform = `translate3d(${-p * 15}px,${-p * 30}px,${-45 + p * 30}px) rotateZ(${-8 - p * 3}deg)`;
                instagram.style.transform = `translate3d(${p * 12}px,${p * 12}px,${80 + p * 30}px) rotateZ(${-4 + p * 3}deg)`;
              },
              { target: hero, offset: ["start 76px", "end end"] },
            ),
          );
        } else {
          stops.push(
            scroll(
              (p: number) => {
                deck.style.transform = `rotateX(${2 - p * 2}deg) rotateY(${-3 + p * 5}deg)`;
              },
              {
                target: deck.parentElement!,
                offset: ["start end", "end start"],
              },
            ),
          );
        }
      }
      document
        .querySelectorAll<HTMLElement>(".reveal, .process-step, .voice-word")
        .forEach((element) => {
          remember(element);
          stops.push(
            scroll(
              (p: number) => {
                element.style.opacity = String(0.6 + p * 0.4);
                element.style.transform = `translateY(${(1 - p) * 22}px)`;
              },
              { target: element, offset: ["start 98%", "start 78%"] },
            ),
          );
        });
      const formats = find(".formats-story");
      const track = find(".formats-track");
      if (desktop.matches && formats && track) {
        stops.push(
          scroll(
            (p: number) => {
              const distance = Math.max(
                0,
                track.scrollWidth - track.parentElement!.clientWidth,
              );
              track.style.transform = `translate3d(${-p * distance}px,0,0)`;
            },
            { target: formats, offset: ["start 76px", "end end"] },
          ),
        );
        // Keep keyboard-focused cards in view during the horizontal sequence.
        const onFocus = (event: FocusEvent) => {
          const panel = (event.target as HTMLElement).closest<HTMLElement>(
            ".format-panel",
          );
          if (!panel) return;
          const viewport = track.parentElement!;
          const distance = Math.max(
            1,
            track.scrollWidth - viewport.clientWidth,
          );
          const fraction = Math.max(
            0,
            Math.min(1, (panel.offsetLeft - 32) / distance),
          );
          viewport.scrollLeft = 0;
          const start =
            formats.getBoundingClientRect().top + window.scrollY - 76;
          window.scrollTo({
            top:
              start +
              fraction * (formats.offsetHeight - window.innerHeight + 76),
            behavior: "instant",
          });
        };
        track.addEventListener("focusin", onFocus);
        stops.push(() => track.removeEventListener("focusin", onFocus));
      }
      const closing = find(".closing-message");
      if (closing)
        stops.push(
          scroll(
            (p: number) => {
              closing.style.transform = `perspective(1200px) rotateX(${(1 - p) * 14}deg) scale(${0.9 + p * 0.1})`;
            },
            { target: closing, offset: ["start end", "center center"] },
          ),
        );
      dispose = () => {
        stops.forEach((stop) => stop());
        originals.forEach((style, element) =>
          style === null
            ? element.removeAttribute("style")
            : element.setAttribute("style", style),
        );
        document.documentElement.classList.remove(
          "motion-ready",
          "motion-desktop",
        );
      };
    };
    setup();
    reduced.addEventListener("change", setup);
    desktop.addEventListener("change", setup);
    return () => {
      dispose();
      reduced.removeEventListener("change", setup);
      desktop.removeEventListener("change", setup);
    };
  }, []);
  return null;
}
