import { useEffect, useRef, useState } from 'react';

// ── Project data ──────────────────────────────────────────────────────────────
// Swap liveUrl / githubUrl / image for each project when ready.
// image: null → shows the built-in placeholder.
const PROJECTS = [
  {
    id: '01',
    name: 'Coffee Shop',
    category: 'Frontend · Static Site',
    description:
      'A multi-page coffee shop storefront with a shopping cart, product listings, and a clean responsive layout. Built as a pure HTML/CSS/JS project with static hosting.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    githubUrl: 'https://github.com/dott-tech/coffee-shop',
    liveUrl: 'shop3.netlify.app',
    image: null,
    accent: '#A5D7E8',
  },
  {
    id: '02',
    name: 'Structural Hub',
    category: 'Full-Stack · Web App',
    description:
      'A project workspace built for engineering teams. Supports nested projects, phase tracking, role-based access, file storage with signed URLs, JWT auth, and a full activity log per project.',
    stack: ['React', 'Node.js', 'PostgreSQL', 'Vite', 'AWS S3'],
    githubUrl: 'https://github.com/dott-tech/project-delta',
    liveUrl: 'ructural-hub.netlify.app',
    image: null,
    accent: '#93c5fd',
  },
  {
    id: '03',
    name: 'Coming Soon',
    category: 'Next Project',
    description:
      'Something new is in the works. Check back soon — or reach out if you want to collaborate on the next one.',
    stack: [],
    githubUrl: null,
    liveUrl: null,
    image: null,
    accent: '#A5D7E8',
    placeholder: true,
  },
];

// ── Placeholder visual ────────────────────────────────────────────────────────
const ProjectPlaceholder = ({ project }) => (
  <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8">
    {project.placeholder ? (
      <>
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-dashed border-blue-300/50">
          <svg className="h-10 w-10 text-blue-300/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <p className="text-sm text-blue-300/50 font-mono">project_{project.id}.exe</p>
      </>
    ) : (
      <>
        {/* stylised window mock */}
        <div className="projects-mock w-full max-w-[260px] overflow-hidden rounded-xl border border-white/20 bg-white/5">
          <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full border border-white/30" />
            <span className="h-2.5 w-2.5 rounded-full border border-white/30" />
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: project.accent }} />
            <span className="ml-auto font-mono text-[10px] text-white/30">{project.name.toLowerCase().replace(' ', '-')}.dev</span>
          </div>
          <div className="space-y-2 p-3">
            <div className="h-2 w-3/4 rounded-full bg-white/10" />
            <div className="h-2 w-full rounded-full bg-white/10" />
            <div className="h-2 w-5/6 rounded-full bg-white/10" />
            <div className="mt-3 grid grid-cols-3 gap-1.5">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-10 rounded-lg border border-white/10 bg-white/5" />
              ))}
            </div>
            <div className="h-2 w-2/3 rounded-full bg-white/10" />
          </div>
        </div>
        <p className="projects-mock-text font-mono text-xs" style={{ color: project.accent + '99' }}>
          screenshot coming soon
        </p>
      </>
    )}
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────
const Projects = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(null); // 'next' | 'prev'
  const [phase, setPhase] = useState('idle'); // 'idle' | 'exit' | 'enter'
  const timers = useRef([]);

  // clear pending timers if the section unmounts mid-animation
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const goTo = (index, dir) => {
    if (phase !== 'idle' || index === current) return;
    setDirection(dir);
    setPhase('exit');
    // old card slides out, then swap content and slide the new card in
    timers.current = [
      setTimeout(() => {
        setCurrent(index);
        setPhase('enter');
      }, 280),
      setTimeout(() => {
        setPhase('idle');
        setDirection(null);
      }, 560),
    ];
  };

  const next = () => current < PROJECTS.length - 1 && goTo(current + 1, 'next');
  const prev = () => current > 0 && goTo(current - 1, 'prev');

  const project = PROJECTS[current];

  return (
    <section id="projects" className="projects-section relative overflow-hidden bg-[#0b3a5f] py-24 text-white">
      {/* same faint grid as hero */}
      <div
        aria-hidden="true"
        className="projects-grid-bg pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <style>{`
        @keyframes pageIn-next {
          0%  { opacity: 0; transform: translateX(32px) scale(0.97); }
          100%{ opacity: 1; transform: translateX(0)    scale(1);    }
        }
        @keyframes pageIn-prev {
          0%  { opacity: 0; transform: translateX(-32px) scale(0.97); }
          100%{ opacity: 1; transform: translateX(0)     scale(1);    }
        }
        @keyframes pageOut-next {
          0%  { opacity: 1; transform: translateX(0)     scale(1);    }
          100%{ opacity: 0; transform: translateX(-32px) scale(0.97); }
        }
        @keyframes pageOut-prev {
          0%  { opacity: 1; transform: translateX(0)    scale(1);    }
          100%{ opacity: 0; transform: translateX(32px) scale(0.97); }
        }
        .page-enter-next { animation: pageIn-next  0.28s cubic-bezier(0.16,1,0.3,1) forwards; }
        .page-enter-prev { animation: pageIn-prev  0.28s cubic-bezier(0.16,1,0.3,1) forwards; }
        .page-exit-next  { animation: pageOut-next 0.28s cubic-bezier(0.16,1,0.3,1) forwards; }
        .page-exit-prev  { animation: pageOut-prev 0.28s cubic-bezier(0.16,1,0.3,1) forwards; }

        /* 4K / Ultra-wide Displays — matches hero breakpoint and container width */
        @media (min-width: 2000px) {
          .projects-section {
            padding-top: 9rem !important;
            padding-bottom: 9rem !important;
          }
          .projects-grid-bg {
            background-size: 64px 64px !important;
            background-image:
              linear-gradient(to right, #fff 2px, transparent 2px),
              linear-gradient(to bottom, #fff 2px, transparent 2px) !important;
          }
          .projects-container {
            max-width: 1800px !important;
          }
          .projects-header {
            margin-bottom: 5rem !important;
          }
          .projects-eyebrow {
            font-size: 1.5rem !important;
            margin-bottom: 0.75rem !important;
          }
          .projects-title {
            font-size: 5.5rem !important;
          }
          .projects-counter {
            font-size: 2rem !important;
          }
          .projects-card {
            border-radius: 1.5rem !important;
            box-shadow: 14px 14px 0 0 #93c5fd !important;
          }
          .projects-bar {
            padding: 1.25rem 2rem !important;
          }
          .projects-bar-dot {
            height: 1.1rem !important;
            width: 1.1rem !important;
          }
          .projects-bar-text {
            font-size: 1.25rem !important;
          }
          .projects-body {
            min-height: 680px !important;
          }
          .projects-visual {
            padding: 3rem !important;
          }
          .projects-mock {
            max-width: 440px !important;
          }
          .projects-mock-text {
            font-size: 1.15rem !important;
          }
          .projects-info {
            padding: 4rem !important;
          }
          .projects-name {
            font-size: 4.5rem !important;
            line-height: 1.05 !important;
          }
          .projects-desc {
            font-size: 1.75rem !important;
            margin-top: 2rem !important;
            max-width: 50rem !important;
          }
          .projects-tags {
            margin-top: 2.5rem !important;
            gap: 0.85rem !important;
          }
          .projects-tag {
            padding: 0.6rem 1.25rem !important;
            font-size: 1.15rem !important;
          }
          .projects-tag:hover {
            box-shadow: 5px 5px 0 0 #93c5fd !important;
          }
          .projects-btn {
            padding: 1.5rem 2.75rem !important;
            font-size: 1.5rem !important;
            border-radius: 1rem !important;
            box-shadow: 6px 6px 0 0 #93c5fd !important;
          }
          .projects-btn svg {
            height: 1.5rem !important;
            width: 1.5rem !important;
          }
          .projects-nav {
            margin-top: 3.5rem !important;
          }
          .projects-nav-btn {
            padding: 1.25rem 2.25rem !important;
            font-size: 1.5rem !important;
            border-radius: 1rem !important;
          }
          .projects-nav-btn svg {
            height: 1.5rem !important;
            width: 1.5rem !important;
          }
          .projects-dots {
            gap: 1rem !important;
          }
          .projects-dot {
            height: 1.1rem !important;
            width: 1.1rem !important;
          }
          .projects-dot.is-active {
            width: 3rem !important;
          }
        }
      `}</style>

      <div className="projects-container relative mx-auto max-w-6xl px-6">

        {/* Section heading */}
        <div className="projects-header mb-14 flex items-end justify-between">
          <div>
            <p className="projects-eyebrow mb-1 font-mono text-sm text-blue-300">selected work</p>
            <h2 className="projects-title text-4xl font-black tracking-tight sm:text-5xl">Projects</h2>
          </div>
          {/* page counter */}
          <span className="projects-counter font-mono text-lg font-bold text-blue-300">
            {String(current + 1).padStart(2, '0')}
            <span className="text-white/30"> / </span>
            {String(PROJECTS.length).padStart(2, '0')}
          </span>
        </div>

        {/* Card */}
        <div
          className={`
            projects-card overflow-hidden rounded-2xl border-2 border-white bg-[#0b3a5f]
            shadow-[8px_8px_0_0_#93c5fd]
            ${phase === 'exit' ? `page-exit-${direction}` : ''}
            ${phase === 'enter' ? `page-enter-${direction}` : ''}
          `}
        >
          {/* card top bar */}
          <div className="projects-bar flex items-center justify-between border-b-2 border-white px-5 py-3">
            <span className="flex gap-1.5">
              <span className="projects-bar-dot h-3 w-3 rounded-full border border-white" />
              <span className="projects-bar-dot h-3 w-3 rounded-full border border-white" />
              <span className="projects-bar-dot h-3 w-3 rounded-full bg-blue-300" />
            </span>
            <span className="projects-bar-text font-mono text-xs text-blue-300 sm:text-sm">{project.category}</span>
            <span className="projects-bar-text font-mono text-xs text-white/40">project_{project.id}</span>
          </div>

          {/* card body */}
          <div className="projects-body grid min-h-[420px] grid-cols-1 lg:grid-cols-2">

            {/* left — visual */}
            <div className="projects-visual flex items-center justify-center border-b-2 border-white lg:border-b-0 lg:border-r-2 p-6 min-h-[260px]">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.name}
                  className="h-full w-full rounded-lg border-2 object-cover"
                  style={{ borderColor: project.accent }}
                />
              ) : (
                <ProjectPlaceholder project={project} />
              )}
            </div>

            {/* right — info */}
            <div className="projects-info flex flex-col justify-between p-8">
              <div>
                <h3 className="projects-name text-3xl font-black tracking-tight sm:text-4xl">{project.name}</h3>
                <p className="projects-desc mt-4 text-base leading-relaxed text-white/80">{project.description}</p>

                {project.stack.length > 0 && (
                  <ul className="projects-tags mt-6 flex flex-wrap gap-2">
                    {project.stack.map(tech => (
                      <li
                        key={tech}
                        className="projects-tag cursor-default rounded-md border border-blue-300 px-3 py-1 font-mono text-xs text-blue-300 transition-all duration-200 hover:-translate-y-1 hover:border-white hover:bg-white hover:text-[#0b3a5f] hover:shadow-[4px_4px_0_0_#93c5fd] active:translate-y-0 active:shadow-none"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* buttons */}
              {!project.placeholder && (
                <div className="mt-8 flex flex-wrap gap-4">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="projects-btn rounded-xl border-2 border-white bg-white px-6 py-3 font-bold text-[#0b3a5f] shadow-[4px_4px_0_0_#93c5fd] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#A5D7E8] hover:border-[#A5D7E8] hover:shadow-[6px_6px_0_0_#93c5fd] active:translate-x-0 active:translate-y-0 active:shadow-none"
                    >
                      Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="projects-btn flex items-center gap-2 rounded-xl border-2 border-blue-300 px-6 py-3 font-bold text-white shadow-[4px_4px_0_0_#93c5fd] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-[#0b3a5f] hover:shadow-[6px_6px_0_0_#93c5fd] active:translate-x-0 active:translate-y-0 active:shadow-none"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                      GitHub
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="projects-nav mt-8 flex items-center justify-between">

          {/* prev */}
          <button
            onClick={prev}
            disabled={current === 0}
            className="projects-nav-btn group flex items-center gap-3 rounded-xl border-2 border-white px-5 py-3 font-bold transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-[#A5D7E8] hover:text-[#A5D7E8] hover:shadow-[4px_4px_0_0_#93c5fd] disabled:cursor-not-allowed disabled:border-white/20 disabled:text-white/20 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            <svg className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          {/* dot indicators */}
          <div className="projects-dots flex items-center gap-2.5">
            {PROJECTS.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > current ? 'next' : 'prev')}
                className="transition-all duration-200"
                aria-label={`Go to project ${i + 1}`}
              >
                <span
                  className={`projects-dot block rounded-full border-2 border-white transition-all duration-200 ${
                    i === current
                      ? 'is-active h-3 w-8 bg-blue-300 border-blue-300'
                      : 'h-3 w-3 bg-transparent hover:bg-white/30'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* next */}
          <button
            onClick={next}
            disabled={current === PROJECTS.length - 1}
            className="projects-nav-btn group flex items-center gap-3 rounded-xl border-2 border-white px-5 py-3 font-bold transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-[#A5D7E8] hover:text-[#A5D7E8] hover:shadow-[4px_4px_0_0_#93c5fd] disabled:cursor-not-allowed disabled:border-white/20 disabled:text-white/20 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            Next
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Projects;