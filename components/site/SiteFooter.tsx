import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
export function SiteFooter() {
  return (
    <footer className="site-footer section-wrap">
      <div>
        <a href="#top" className="wordmark">
          repurposer<span className="wordmark-dot">.</span>
        </a>
        <p>One idea. More possibilities.</p>
      </div>
      <div className="footer-links">
        <a href="#how">How it works</a>
        <a href="#formats">Formats</a>
        <a href="#faq">FAQ</a>
        <a href="https://aisavvyfounders.com" target="_blank" rel="noreferrer">
          By AI Savvy Founders <ArrowUpRight size={14} />
        </a>
      </div>
      <small>© {new Date().getFullYear()} Repurposer</small>
    </footer>
  );
}
