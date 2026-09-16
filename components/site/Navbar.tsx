"use client";
import { useEffect, useState } from "react";
import { List, X, ArrowUpRight } from "@phosphor-icons/react";
const LINKS = [
  ["How it works", "#how"],
  ["Formats", "#formats"],
  ["FAQ", "#faq"],
] as const;
export function Navbar() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  return (
    <header className="site-nav">
      <nav className="nav-inner" aria-label="Main navigation">
        <a href="#top" className="wordmark" onClick={() => setOpen(false)}>
          repurposer<span className="wordmark-dot">.</span>
        </a>
        <div className="nav-links">
          {LINKS.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </div>
        <div className="nav-actions">
          <a
            href="#tool"
            className="button-primary nav-cta"
            onClick={() => setOpen(false)}
          >
            Start creating <ArrowUpRight size={16} />
          </a>
          <button
            className="menu-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <List size={22} />}
          </button>
        </div>
      </nav>
      {open && (
        <div id="mobile-navigation" className="mobile-navigation">
          {LINKS.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
