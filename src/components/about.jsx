import { useEffect, useRef, useState } from 'react';

// ── About content ─────────────────────────────────────────────────────────────
// Placeholder text: swap in your own story, dates and details.
const STORY = [
  "I'm Ali, a web developer from Najaf. I got into coding by taking websites apart to see how they worked, and I never really stopped.",
  'These days I build full websites and web apps, from the layout people see to the server and database behind it. I care about pages that load fast, work on every screen, and feel good to use.',
  "When I'm not coding I'm usually learning something new, sketching ideas for the next project, or out with friends around the city.",
];

const PROCESS = [
  { step: '01', title: 'Plan', text: 'We talk through what you need, who it is for, and what success looks like.' },
  { step: '02', title: 'Design', text: 'I sketch the layout and flow so you can see it before any code is written.' },
  { step: '03', title: 'Build', text: 'Clean, responsive code with regular check-ins so nothing is a surprise.' },
  { step: '04', title: 'Ship', text: 'Launch, test on real devices, and stick around for fixes after.' },
];

const SKILLS = [
  { group: 'Frontend', items: ['React', 'JavaScript', 'Tailwind CSS', 'HTML', 'CSS'] },
  { group: 'Backend', items: ['Node.js', 'PostgreSQL', 'REST APIs', 'JWT auth'] },
  { group: 'Tools', items: ['Git', 'Vite', 'AWS S3', 'Netlify', 'Cloudflare'] },
];

const TIMELINE = [
  { when: '2024', what: 'Started out building mockups and small projects like Rock Paper Scissors game and half-way UIs' },
  { when: 'Late 2025', what: 'Built my first full project: Coffee Shop' },
  { when: '2026', what: 'Built Structural Hub, a full-stack app for engineering teams' },
  { when: 'Now', what: 'Open to freelance projects and full-time roles', now: true },
];

const WHOAMI = '$ whoami';
const CLOSE_MS = 520;

// ── Full-screen About page ────────────────────────────────────────────────────
const About = ({ open, onClose, onContact }) => {
  const [closing, setClosing] = useState(false);
  const pageRef = useRef(null);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const requestClose = () => {
    if (closing) return;
    setClosing(true);
    timer.current = setTimeout(() => {
      setClosing(false);
      onClose();
    }, CLOSE_MS);
  };

  // Esc to close, lock the page behind, start at the top each time
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      // let the contact popup handle Esc when it's on top
      if (e.key === 'Escape' && !document.querySelector('.cm-overlay')) requestClose();
    };
    const opener = document.activeElement;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.addEventListener('keydown', onKey);
    document.documentElement.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbar}px`;
    pageRef.current?.scrollTo(0, 0);
    pageRef.current?.focus({ preventScroll: true });
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
      document.body.style.paddingRight = '';
      opener?.focus?.({ preventScroll: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  // staggered entrance for each block
  const rise = (i) => ({ style: { '--i': i } });

  return (
    <div className={`ab-root fixed inset-0 z-[90] ${closing ? 'is-closing' : ''}`}>
      <style>{`
        /* a light-blue curtain sweeps up first, then the page follows it */
        @keyframes abUp   { from { transform: translateY(100%); } to { transform: none; } }
        @keyframes abDown { from { transform: none; } to { transform: translateY(100%); } }
        .ab-curtain { animation: abUp 0.5s cubic-bezier(0.76, 0, 0.24, 1) both; }
        .ab-page    { animation: abUp 0.6s cubic-bezier(0.76, 0, 0.24, 1) 0.12s both; }
        .is-closing .ab-page    { animation: abDown ${CLOSE_MS - 100}ms cubic-bezier(0.76, 0, 0.24, 1) both; }
        .is-closing .ab-curtain { animation: abDown ${CLOSE_MS - 100}ms cubic-bezier(0.76, 0, 0.24, 1) 0.1s both; }

        .ab-grid {
          background-image:
            linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        /* "$ whoami" types itself out */
        @keyframes abType { from { width: 0; } to { width: ${WHOAMI.length}ch; } }
        @keyframes abBlink { 50% { opacity: 0; } }
        .ab-type {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          vertical-align: bottom;
          animation: abType 0.6s steps(${WHOAMI.length}) 0.75s both;
        }
        .ab-cursor { animation: abBlink 1s step-end infinite; }

        /* blocks rise in on a stagger once the page has landed */
        @keyframes abRise {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: none; }
        }
        .ab-rise { animation: abRise 0.55s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: calc(0.9s + var(--i) * 0.08s); }

        /* timeline line draws downward */
        @keyframes abLine { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        .ab-line { transform-origin: top; animation: abLine 0.9s cubic-bezier(0.16, 1, 0.3, 1) 1.2s both; }

        @media (prefers-reduced-motion: reduce) {
          .ab-curtain, .ab-page, .ab-type, .ab-rise, .ab-line {
            animation-duration: 1ms !important;
            animation-delay: 0s !important;
          }
        }
      `}</style>

      <div aria-hidden="true" className="ab-curtain absolute inset-0 bg-blue-300" />

      <div
        ref={pageRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-title"
        className="ab-page ab-grid absolute inset-0 overflow-y-auto bg-[#0b3a5f] text-white outline-none"
      >
        {/* top bar */}
        <div className="sticky top-0 z-10 border-b-2 border-white bg-[#0b3a5f]/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <button
              type="button"
              onClick={requestClose}
              className="group flex items-center gap-2 rounded-lg border-2 border-blue-300 px-3 py-1.5 font-mono text-sm text-blue-300 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-white hover:text-white hover:shadow-[4px_4px_0_0_#93c5fd] active:translate-x-0 active:translate-y-0 active:shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
            >
              <svg className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              back
            </button>
            <span className="flex items-center gap-3 font-mono text-xs text-blue-300 sm:text-sm">
              <span className="hidden gap-1.5 sm:flex">
                <span className="h-3 w-3 rounded-full border border-white" />
                <span className="h-3 w-3 rounded-full border border-white" />
                <span className="h-3 w-3 rounded-full bg-blue-300" />
              </span>
              ~/ali-mustafa/about.md
            </span>
          </div>
        </div>

        <main className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
          {/* heading */}
          <p className="font-mono text-sm text-blue-300 sm:text-base">
            <span className="ab-type">{WHOAMI}</span>
            <span className="ab-cursor">_</span>
          </p>
          <h1 id="about-title" {...rise(0)} className="ab-rise mt-3 text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
            The person behind <span className="text-blue-300">the code.</span>
          </h1>

          <div className="mt-12 grid gap-10 lg:grid-cols-12">
            {/* story */}
            <article
              {...rise(1)}
              className="ab-rise overflow-hidden rounded-2xl border-2 border-white bg-[#0b3a5f] shadow-[8px_8px_0_0_#93c5fd] lg:col-span-7"
            >
              <div className="flex items-center justify-between border-b-2 border-white px-5 py-3">
                <span className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full border border-white" />
                  <span className="h-3 w-3 rounded-full border border-white" />
                  <span className="h-3 w-3 rounded-full bg-blue-300" />
                </span>
                <span className="font-mono text-xs text-blue-300">story.md</span>
              </div>
              <div className="space-y-4 p-6 text-base leading-relaxed text-white/85 sm:p-8 sm:text-lg">
                {STORY.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </article>

            {/* timeline */}
            <section {...rise(2)} className="ab-rise lg:col-span-5">
              <h2 className="font-mono text-sm text-blue-300">// timeline</h2>
              <ol className="relative mt-5 space-y-6 pl-8">
                <span aria-hidden="true" className="ab-line absolute bottom-2 left-[7px] top-2 w-0.5 bg-white/30" />
                {TIMELINE.map((item, i) => (
                  <li key={i} {...rise(3 + i)} className="ab-rise relative">
                    <span
                      aria-hidden="true"
                      className={`absolute -left-8 top-1 h-4 w-4 rounded-full border-2 ${
                        item.now ? 'border-emerald-400 bg-emerald-400' : 'border-white bg-[#0b3a5f]'
                      }`}
                    >
                      {item.now && <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-60" />}
                    </span>
                    <p className={`font-mono text-xs ${item.now ? 'text-emerald-300' : 'text-blue-300'}`}>{item.when}</p>
                    <p className="mt-1 font-semibold">{item.what}</p>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          {/* how I work */}
          <section className="mt-16">
            <h2 {...rise(7)} className="ab-rise font-mono text-sm text-blue-300">// how I work</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {PROCESS.map((p, i) => (
                <div
                  key={p.step}
                  {...rise(8 + i)}
                  className="ab-rise rounded-xl border-2 border-white bg-[#0b3a5f] p-5 shadow-[4px_4px_0_0_#93c5fd] transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#93c5fd]"
                >
                  <p className="font-mono text-xs text-blue-300">{p.step}</p>
                  <h3 className="mt-2 text-xl font-black">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/75">{p.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* skills */}
          <section className="mt-16">
            <h2 {...rise(12)} className="ab-rise font-mono text-sm text-blue-300">// skills</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-3">
              {SKILLS.map((s, i) => (
                <div key={s.group} {...rise(13 + i)} className="ab-rise rounded-xl border-2 border-white/40 p-5">
                  <h3 className="font-bold">{s.group}</h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {s.items.map((item) => (
                      <li
                        key={item}
                        className="cursor-default rounded-md border-2 border-blue-300 px-2.5 py-1 font-mono text-xs font-semibold text-blue-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-[#0b3a5f]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* call to action */}
          <section
            {...rise(16)}
            className="ab-rise mt-16 flex flex-col items-start justify-between gap-6 rounded-2xl border-2 border-white bg-white p-8 text-[#0b3a5f] shadow-[8px_8px_0_0_#93c5fd] sm:flex-row sm:items-center"
          >
            <div>
              <h2 className="text-2xl font-black sm:text-3xl">Have a project in mind?</h2>
              <p className="mt-1 text-[#0b3a5f]/75">I'm currently taking on new work. Let's build something.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onContact}
                className="rounded-xl border-2 border-[#0b3a5f] bg-[#0b3a5f] px-6 py-3 font-bold text-white shadow-[4px_4px_0_0_#93c5fd] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#93c5fd] active:translate-x-0 active:translate-y-0 active:shadow-none"
              >
                Contact me
              </button>
              <button
                type="button"
                onClick={requestClose}
                className="rounded-xl border-2 border-[#0b3a5f] px-6 py-3 font-bold transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#0b3a5f] active:translate-x-0 active:translate-y-0 active:shadow-none"
              >
                Back to site
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default About;
