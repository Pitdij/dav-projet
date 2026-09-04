// Icônes SVG (traits fins, couleur héritée via currentColor).

const svg = (size, stroke, body) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

export const icons = {
  target: (s = 18, w = 1.6) => svg(s, w, '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r=".6" fill="currentColor"/>'),
  pin: (s = 72, w = 1.4) => svg(s, w, '<path d="M12 21s7-7.4 7-12a7 7 0 1 0-14 0c0 4.6 7 12 7 12Z"/><circle cx="12" cy="9" r="2.3"/>'),
  wallet: (s = 72, w = 1.4) => svg(s, w, '<path d="M3 7h15a3 3 0 0 1 3 3v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/><path d="M3 7l2-3h12"/><circle cx="16.5" cy="14" r="1.3" fill="currentColor" stroke="none"/>'),
  menu: () => svg(18, 1.8, '<path d="M4 7h16M4 12h16M4 17h16"/>'),
  bell: () => svg(17, 1.8, '<path d="M12 3a5 5 0 0 0-5 5v3.2c0 .8-.3 1.6-.9 2.2L5 15h14l-1.1-1.6c-.6-.6-.9-1.4-.9-2.2V8a5 5 0 0 0-5-5Z"/><path d="M10 18a2 2 0 0 0 4 0"/>'),
  box: (s = 22, w = 1.5) => svg(s, w, '<path d="M3 8l9-4 9 4-9 4-9-4Z"/><path d="M3 8v8l9 4 9-4V8"/><path d="M12 12v8"/>'),
  boxFlat: (s = 14, w = 1.8) => svg(s, w, '<path d="M3 8l9-4 9 4-9 4-9-4Z"/><path d="M3 8v8l9 4 9-4V8"/>'),
  chevronRight: (s = 18, w = 1.8) => svg(s, w, '<path d="M9 6l6 6-6 6"/>'),
  chevronLeft: (s = 20, w = 1.8) => svg(s, w, '<path d="M15 6l-6 6 6 6"/>'),
  check: (s = 16, w = 2) => svg(s, w, '<path d="M5 13l4 4L19 7"/>'),
  camera: (s = 16, w = 1.6) => svg(s, w, '<path d="M4 8h3l2-3h6l2 3h3v11H4V8Z"/><circle cx="12" cy="13" r="3.2"/>'),
  globe: (s = 18, w = 1.6) => svg(s, w, '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.5 6 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-6-3.5-9s1-6.5 3.5-9Z"/>'),
  logout: (s = 18, w = 1.7) => svg(s, w, '<path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3"/><path d="M15 8l4 4-4 4"/><path d="M19 12H9"/>'),
  list: (s = 18, w = 1.6) => svg(s, w, '<path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/>'),
  euro: (s = 18, w = 1.6) => svg(s, w, '<path d="M19 6.5a7 7 0 1 0 0 11M4.5 10h9M4.5 14h7"/>'),
  user: (s = 18, w = 1.6) => svg(s, w, '<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>')
};
