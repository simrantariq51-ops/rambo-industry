// Minimal brand glyphs — lucide-react no longer ships social/brand icons,
// so these small inline SVGs keep the footer dependency-free.

const base = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "currentColor" };

export function LinkedinIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.9 8.65 22 11 22 14.2V21h-4v-6c0-1.4-.03-3.2-1.95-3.2-1.95 0-2.25 1.5-2.25 3.1V21H9z" />
    </svg>
  );
}

export function FacebookIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.7c0-.9.26-1.6 1.6-1.6H16.7V3.2C16.4 3.15 15.4 3 14.3 3c-2.4 0-4 1.45-4 4.1v2.7H7.6V13h2.7v8z" />
    </svg>
  );
}

export function InstagramIcon(props) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function YoutubeIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="2" y="5" width="20" height="14" rx="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10 8.5v7l6-3.5z" />
    </svg>
  );
}
