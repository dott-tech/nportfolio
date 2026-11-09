// Eased scroll to an in-page section, offset so the fixed navbar doesn't cover it.
const NAV_OFFSET = 90;
const DURATION = 550;

const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

let frame = null;

export function scrollToSection(hash) {
  const target = hash === '#home' ? document.body : document.querySelector(hash);
  if (!target) return false;

  const startY = window.scrollY;
  const endY =
    hash === '#home'
      ? 0
      : Math.max(0, target.getBoundingClientRect().top + startY - NAV_OFFSET);

  history.replaceState(null, '', hash);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.scrollTo(0, endY);
    return true;
  }

  if (frame) cancelAnimationFrame(frame);
  const distance = endY - startY;
  const start = performance.now();

  const step = (now) => {
    const progress = Math.min((now - start) / DURATION, 1);
    window.scrollTo(0, startY + distance * easeInOutCubic(progress));
    frame = progress < 1 ? requestAnimationFrame(step) : null;
  };
  frame = requestAnimationFrame(step);
  return true;
}

// onClick handler for <a href="#section"> links.
export function handleAnchorClick(e) {
  const hash = e.currentTarget.getAttribute('href');
  if (hash?.startsWith('#') && scrollToSection(hash)) e.preventDefault();
}
