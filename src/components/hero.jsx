import { useEffect, useRef } from 'react';
import logo from '../assets/logo.jpg';
import { handleAnchorClick } from '../utils/smoothScroll';

const NAME = 'ali mustafa';
const ROLE = 'full-stack web developer';
const LOCATION = 'najaf, iraq';
const INTRO =
  'I build fast, accessible websites and web apps with React. Currently open to freelance projects and full-time roles.';
const STACK = ['React', 'Tailwind CSS', 'JavaScript', 'Node.js'];
const FACTS = [
  { value: '2+', label: 'Years of experience' },
  { value: '3+', label: 'Projects shipped' },
  { value: '100%', label: 'Responsive builds' },
];

const Hero = ({ onContact }) => {
  const heroRef = useRef(null);

  useEffect(() => {
    const container = heroRef.current;
    if (!container) return;

    const elementsToObserve = container.querySelectorAll('.reveal-item');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.15,
      }
    );

    elementsToObserve.forEach((el) => observer.observe(el));

    return () => {
      elementsToObserve.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen w-full overflow-hidden bg-[#0b3a5f] text-white flex items-center justify-center"
    >
      {/* Inline styles for custom entrance animations & 4K overrides */}
      <style>{`
        @keyframes slideFromLeft {
          0% { opacity: 0; transform: translateX(-40px) rotate(-6deg); }
          100% { opacity: 1; transform: translateX(0) rotate(-2deg); }
        }
        @keyframes fadeUpLinear {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes pillPop {
          0% { opacity: 0; transform: translateY(12px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Initial Hidden State */
        .reveal-item {
          opacity: 0;
          will-change: transform, opacity;
        }

        /* Slower, smoother entrance animations with a slight initial delay */
        .reveal-item.anim-1-card.in-view {
          animation: slideFromLeft 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
        }
        .reveal-item.anim-2-title.in-view {
          animation: fadeUpLinear 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
        }
        .reveal-item.anim-3-intro.in-view {
          animation: fadeUpLinear 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
        }
        .reveal-item.anim-4-btns.in-view {
          animation: fadeUpLinear 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
        }
        .reveal-item.anim-5-facts.in-view {
          animation: fadeUpLinear 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
        }
        .reveal-item.anim-pill.in-view {
          animation: pillPop 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.15s forwards;
        }

        /* High-definition grid background */
        .hero-grid-bg {
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.12) 1.5px, transparent 1.5px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.12) 1.5px, transparent 1.5px);
          background-size: 48px 48px;
        }

        /* 4K / Ultra-wide Displays */
        @media (min-width: 2000px) {
          .hero-grid-bg {
            background-size: 64px 64px;
            background-image: 
              linear-gradient(to right, rgba(255, 255, 255, 0.15) 2px, transparent 2px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 2px, transparent 2px);
          }
          .hero-container {
            max-width: 1800px !important;
            gap: 6rem !important;
          }
          .hero-card {
            max-width: 600px !important;
          }
          .hero-card figure {
            box-shadow: 14px 14px 0 0 #93c5fd !important;
          }
          .hero-title {
            font-size: 7rem !important;
            line-height: 1.05 !important;
          }
          .hero-intro {
            font-size: 1.75rem !important;
            max-width: 50rem !important;
            margin-top: 2rem !important;
          }
          .hero-btn {
            padding: 1.5rem 2.75rem !important;
            font-size: 1.5rem !important;
            border-radius: 1rem !important;
            box-shadow: 6px 6px 0 0 #93c5fd !important;
          }
          .hero-facts {
            max-width: 50rem !important;
            margin-top: 3.5rem !important;
            box-shadow: 6px 6px 0 0 #93c5fd !important;
          }
          .hero-facts div {
            padding: 1.5rem 2rem !important;
          }
          .hero-facts dd {
            font-size: 3.25rem !important;
          }
          .hero-facts dt {
            font-size: 1.15rem !important;
          }
          .hero-pill {
            padding: 0.75rem 1.5rem !important;
            font-size: 1.25rem !important;
            box-shadow: 5px 5px 0 0 #93c5fd !important;
          }
        }
      `}</style>

      {/* Grid Texture Background */}
      <div
        aria-hidden="true"
        className="hero-grid-bg pointer-events-none absolute inset-0 h-full w-full"
      />

      {/* Hero Content Container */}
      <div className="hero-container relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 py-24 md:py-28 lg:grid-cols-12 lg:gap-12 lg:py-0">
        
        {/* Step 1: Image Card */}
        <div className="flex justify-center lg:col-span-5 lg:justify-start">
          <div className="hero-card reveal-item anim-1-card w-full max-w-sm">
            <figure className="overflow-hidden rounded-2xl border-2 border-white bg-[#0b3a5f] shadow-[8px_8px_0_0_#93c5fd] transition-transform duration-300 hover:scale-[1.02]">
              <div className="flex items-center justify-between border-b-2 border-white px-4 py-2.5">
                <span className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full border border-white" />
                  <span className="h-3 w-3 rounded-full border border-white" />
                  <span className="h-3 w-3 rounded-full bg-blue-300" />
                </span>
                <span className="text-xs font-mono text-blue-300 sm:text-sm">{LOCATION}</span>
              </div>

              <div className="p-4">
                <img
                  src={logo}
                  alt={`${NAME} portrait`}
                  className="aspect-square w-full rounded-lg border-2 border-blue-300 object-cover shadow-inner"
                />
              </div>

              <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t-2 border-white px-4 py-3">
                <div>
                  <p className="font-bold leading-tight capitalize">{NAME}</p>
                  <p className="text-xs text-blue-300 capitalize sm:text-sm">{ROLE}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400 px-2.5 py-1 text-xs text-emerald-300">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  Open to work
                </span>
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Right Column */}
        <div className="text-center md:text-center lg:col-span-7 lg:pl-4 lg:text-left">
          {/* Step 2: Title */}
          <h1 className="hero-title reveal-item anim-2-title text-4xl font-black leading-[1.08] tracking-tight sm:text-6xl xl:text-7xl">
            I design and build{' '}
            <span className="inline-block text-blue-300">websites people</span>{' '}
            enjoy using.
          </h1>

          {/* Step 3: Intro */}
          <p className="hero-intro reveal-item anim-3-intro mx-auto mt-6 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg lg:mx-0">
            {INTRO}
          </p>

          {/* Step 4: Buttons */}
          <div className="reveal-item anim-4-btns mt-8 flex flex-wrap justify-center gap-5 lg:justify-start">
            <a
              href="#projects"
              onClick={handleAnchorClick}
              className="hero-btn group relative rounded-xl border-2 border-white bg-white px-7 py-3.5 font-bold text-[#0b3a5f] shadow-[4px_4px_0_0_#93c5fd] transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-transparent hover:text-white hover:border-[#A5D7E8] hover:shadow-[6px_6px_0_0_#93c5fd] active:translate-x-0 active:translate-y-0 active:shadow-none focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300"
            >
              View my work
            </a>

            <a
              href="#contact"
              onClick={onContact}
              className="hero-btn group relative rounded-xl border-2 border-[#93c5fd] bg-transparent px-7 py-3.5 font-bold text-white shadow-[4px_4px_0_0_#93c5fd] transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-[#0b3a5f] hover:shadow-[6px_6px_0_0_#93c5fd] active:translate-x-0 active:translate-y-0 active:shadow-none focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300"
            >
              Contact me
            </a>
          </div>

          {/* Step 5: Facts Strip */}
          <dl className="hero-facts reveal-item anim-5-facts mx-auto mt-10 grid max-w-xl grid-cols-3 overflow-hidden rounded-xl border-2 border-white bg-[#0b3a5f] shadow-[4px_4px_0_0_#93c5fd] lg:mx-0">
            {FACTS.map((fact, i) => (
              <div
                key={fact.label}
                className={`flex flex-col justify-center px-2 py-3 sm:px-4 sm:py-4 ${
                  i > 0 ? 'border-l-2 border-white' : ''
                }`}
              >
                <dd className="text-xl font-black text-blue-300 sm:text-3xl">
                  {fact.value}
                </dd>
                <dt className="mt-1 text-[10px] font-medium text-white/80 sm:text-xs">
                  {fact.label}
                </dt>
              </div>
            ))}
          </dl>

          {/* Step 6+: Tech Stack Pills */}
          <ul className="mt-6 flex flex-wrap justify-center gap-2.5 lg:justify-start">
            {STACK.map((tech, index) => (
              <li
                key={tech}
                style={{ animationDelay: `${0.15 + index * 0.1}s` }}
                className="hero-pill reveal-item anim-pill cursor-default rounded-md border-2 border-blue-300 px-3.5 py-1.5 text-xs font-mono font-semibold text-blue-300 transition-all duration-200 hover:-translate-y-1 hover:border-white hover:bg-white hover:text-[#0b3a5f] hover:shadow-[4px_4px_0_0_#93c5fd] active:translate-y-0 active:shadow-none sm:text-sm"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Hero;