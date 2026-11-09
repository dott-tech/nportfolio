import { useEffect, useRef, useState } from 'react';

// ── Contact details ───────────────────────────────────────────────────────────
const CONTACT = {
  email: 'dott15690@gmail.com',
  github: 'https://github.com/dott-tech',
  telegram: 'G_fc1',
  location: 'najaf, iraq',
};

const TITLE = "let's talk";
const CLOSE_MS = 380;

// ── Contact popup ─────────────────────────────────────────────────────────────
// `origin` is the {x, y} viewport point the popup grows out of (the clicked button).
const Contact = ({ open, origin, onClose }) => {
  const [closing, setClosing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'sent'
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const firstInput = useRef(null);
  const timers = useRef([]);

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const requestClose = () => {
    if (closing) return;
    setClosing(true);
    later(() => {
      setClosing(false);
      setStatus('idle');
      onClose();
    }, CLOSE_MS);
  };

  // Esc to close, lock page scroll, focus the first field once the popup lands
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && requestClose();
    const opener = document.activeElement;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.addEventListener('keydown', onKey);
    document.documentElement.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbar}px`;
    const focusTimer = setTimeout(() => firstInput.current?.focus({ preventScroll: true }), 550);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
      document.body.style.paddingRight = '';
      clearTimeout(focusTimer);
      opener?.focus?.({ preventScroll: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const ox = origin ? origin.x - window.innerWidth / 2 : 0;
  const oy = origin ? origin.y - window.innerHeight / 2 : 0;

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
    } catch {
      return;
    }
    setCopied(true);
    later(() => setCopied(false), 1600);
  };

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  // Sends to Netlify Forms (form registered in index.html). Only works on the deployed site.
  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending' || status === 'sent') return;
    setStatus('sending');
    const honeypot = e.currentTarget.elements['bot-field']?.value ?? '';
    const body = new URLSearchParams({ 'form-name': 'contact', 'bot-field': honeypot, ...form });

    // let the paper plane finish its flight even if the request is quick
    const flight = new Promise((r) => setTimeout(r, 650));
    let ok = false;
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      ok = res.ok;
    } catch {
      // network error: ok stays false
    }
    await flight;

    if (ok) {
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
      later(() => setStatus('idle'), 4000);
    } else {
      setStatus('error'); // keep what they typed so they can retry
    }
  };

  // staggered entrance for each block inside the popup
  const rise = (i) => ({ style: { '--i': i } });

  return (
    <div
      className={`cm-overlay fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-4 ${closing ? 'is-closing' : ''}`}
      onMouseDown={(e) => e.target === e.currentTarget && requestClose()}
    >
      <style>{`
        /* backdrop: fade + blur, with the site grid drifting in */
        @keyframes cmFade { from { opacity: 0; } to { opacity: 1; } }
        .cm-overlay {
          background-color: rgba(4, 24, 40, 0.72);
          background-image:
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 48px 48px;
          backdrop-filter: blur(6px);
          animation: cmFade 0.3s ease-out both;
        }
        .cm-overlay.is-closing { animation: cmFade ${CLOSE_MS}ms ease-in reverse both; }

        /* popup grows out of the clicked button, overshoots, then its shadow drops in */
        @keyframes cmIn {
          0%   { opacity: 0; transform: translate(var(--ox), var(--oy)) scale(0.06) rotate(-10deg); border-radius: 999px; }
          55%  { opacity: 1; transform: translate(0, 0) scale(1.03) rotate(1deg); border-radius: 1rem; }
          78%  { transform: scale(0.99) rotate(-0.3deg); }
          100% { opacity: 1; transform: none; border-radius: 1rem; }
        }
        @keyframes cmShadow {
          from { box-shadow: 0 0 0 0 #93c5fd; }
          to   { box-shadow: 10px 10px 0 0 #93c5fd; }
        }
        @keyframes cmOut {
          from { opacity: 1; transform: none; }
          to   { opacity: 0; transform: translate(var(--ox), var(--oy)) scale(0.06) rotate(10deg); border-radius: 999px; }
        }
        .cm-window {
          animation:
            cmIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) both,
            cmShadow 0.25s ease-out 0.5s both;
        }
        .is-closing .cm-window { animation: cmOut ${CLOSE_MS}ms cubic-bezier(0.55, 0, 0.75, 0.2) both; }

        /* title letters drop in one by one */
        @keyframes cmDrop {
          0%   { opacity: 0; transform: translateY(-0.9em) rotate(-14deg); }
          60%  { opacity: 1; transform: translateY(0.08em) rotate(3deg); }
          100% { opacity: 1; transform: none; }
        }
        .cm-letter {
          display: inline-block;
          animation: cmDrop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
          animation-delay: calc(0.3s + var(--i) * 0.045s);
        }

        /* everything else rises in on a stagger */
        @keyframes cmRise {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: none; }
        }
        .cm-rise { animation: cmRise 0.45s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: calc(0.4s + var(--i) * 0.07s); }

        /* inputs: offset shadow slides out on focus */
        .cm-field {
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
        }
        .cm-field:focus {
          outline: none;
          border-color: #93c5fd;
          box-shadow: 4px 4px 0 0 #93c5fd;
          transform: translate(-2px, -2px);
        }

        /* "copied!" tag pops up */
        @keyframes cmPop {
          0%   { opacity: 0; transform: translate(-50%, 6px) scale(0.6); }
          60%  { opacity: 1; transform: translate(-50%, -4px) scale(1.08); }
          100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
        }
        .cm-pop { animation: cmPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both; }

        /* send: the paper plane takes off */
        @keyframes cmFly {
          0%   { transform: none; opacity: 1; }
          30%  { transform: translate(-6px, 4px) rotate(8deg); }
          100% { transform: translate(140px, -90px) rotate(-25deg) scale(0.6); opacity: 0; }
        }
        .cm-plane-fly { animation: cmFly 0.65s cubic-bezier(0.5, 0, 0.75, 0) forwards; }

        @keyframes cmCheck { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
        .cm-check { stroke-dasharray: 24; animation: cmCheck 0.4s ease-out 0.1s both; }

        @media (prefers-reduced-motion: reduce) {
          .cm-overlay, .cm-window, .cm-letter, .cm-rise, .cm-pop, .cm-plane-fly, .cm-check {
            animation-duration: 1ms !important;
            animation-delay: 0s !important;
          }
        }
      `}</style>

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-title"
        className="cm-window relative my-auto w-full max-w-lg overflow-hidden rounded-2xl border-2 border-white bg-[#0b3a5f] text-white"
        style={{ '--ox': `${ox}px`, '--oy': `${oy}px` }}
      >
        {/* window bar */}
        <div className="flex items-center justify-between border-b-2 border-white px-5 py-3">
          <span className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full border border-white" />
            <span className="h-3 w-3 rounded-full border border-white" />
            <span className="h-3 w-3 rounded-full bg-blue-300" />
          </span>
          <span className="font-mono text-xs text-blue-300">contact.exe</span>
          <button
            type="button"
            onClick={requestClose}
            aria-label="Close contact form"
            className="group -m-1 rounded-md p-1 text-white/60 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
          >
            <svg className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {/* status */}
          <p {...rise(0)} className="cm-rise mb-3 flex items-center gap-2 font-mono text-xs text-blue-300">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-300 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-300" />
            </span>
            available for work · {CONTACT.location}
          </p>

          {/* title */}
          <h2 id="contact-title" className="text-4xl font-black tracking-tight sm:text-5xl" aria-label={TITLE}>
            {[...TITLE].map((ch, i) => (
              <span key={i} aria-hidden="true" className="cm-letter" style={{ '--i': i }}>
                {ch === ' ' ? ' ' : ch}
              </span>
            ))}
            <span aria-hidden="true" className="cm-letter text-blue-300" style={{ '--i': TITLE.length }}>.</span>
          </h2>
          <p {...rise(1)} className="cm-rise mt-3 text-white/75">
            Got a project, a role, or just a question? Drop me a message.
          </p>

          {/* quick links */}
          <div {...rise(2)} className="cm-rise mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={copyEmail}
              className="relative flex items-center gap-2 rounded-xl border-2 border-blue-300 px-4 py-2 font-mono text-sm text-blue-300 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-white hover:text-white hover:shadow-[4px_4px_0_0_#93c5fd] active:translate-x-0 active:translate-y-0 active:shadow-none"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="9" y="9" width="11" height="11" rx="2" strokeWidth={2} />
                <path strokeWidth={2} strokeLinecap="round" d="M5 15V6a2 2 0 012-2h9" />
              </svg>
              {CONTACT.email}
              {copied && (
                <span className="cm-pop absolute -top-9 left-1/2 rounded-md border-2 border-white bg-white px-2 py-0.5 text-xs font-bold text-[#0b3a5f]">
                  copied!
                </span>
              )}
            </button>
            <a
              href={CONTACT.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border-2 border-blue-300 px-4 py-2 font-mono text-sm text-blue-300 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-white hover:text-white hover:shadow-[4px_4px_0_0_#93c5fd] active:translate-x-0 active:translate-y-0 active:shadow-none"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              github
            </a>
            <a
              href={`https://t.me/${CONTACT.telegram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border-2 border-blue-300 px-4 py-2 font-mono text-sm text-blue-300 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-white hover:text-white hover:shadow-[4px_4px_0_0_#93c5fd] active:translate-x-0 active:translate-y-0 active:shadow-none"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
              @{CONTACT.telegram}
            </a>
          </div>

          {/* divider */}
          <div {...rise(3)} className="cm-rise my-6 flex items-center gap-3 font-mono text-xs text-white/40">
            <span className="h-px flex-1 bg-white/20" />
            or send a message
            <span className="h-px flex-1 bg-white/20" />
          </div>

          {/* form */}
          <form name="contact" onSubmit={onSubmit} className="space-y-4">
            {/* spam trap: hidden from people, bots fill it in and Netlify drops the message */}
            <input type="text" name="bot-field" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
            <div {...rise(4)} className="cm-rise grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block font-mono text-xs text-blue-300">// name</span>
                <input
                  ref={firstInput}
                  required
                  value={form.name}
                  onChange={update('name')}
                  placeholder="Your name"
                  className="cm-field w-full rounded-lg border-2 border-white/30 bg-transparent px-3.5 py-2.5 text-white placeholder:text-white/30"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block font-mono text-xs text-blue-300">// email</span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={update('email')}
                  placeholder="you@email.com"
                  className="cm-field w-full rounded-lg border-2 border-white/30 bg-transparent px-3.5 py-2.5 text-white placeholder:text-white/30"
                />
              </label>
            </div>
            <label {...rise(5)} className="cm-rise block">
              <span className="mb-1.5 block font-mono text-xs text-blue-300">// message</span>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={update('message')}
                placeholder="Tell me about your project…"
                className="cm-field w-full resize-none rounded-lg border-2 border-white/30 bg-transparent px-3.5 py-2.5 text-white placeholder:text-white/30"
              />
            </label>

            <div {...rise(6)} className="cm-rise">
              <button
                type="submit"
                disabled={status === 'sending' || status === 'sent'}
                className="flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl border-2 border-white bg-white px-6 py-3.5 font-bold text-[#0b3a5f] shadow-[4px_4px_0_0_#93c5fd] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-[#A5D7E8] hover:bg-[#A5D7E8] hover:shadow-[6px_6px_0_0_#93c5fd] active:translate-x-0 active:translate-y-0 active:shadow-none disabled:cursor-default disabled:hover:translate-x-0 disabled:hover:translate-y-0"
              >
                {status === 'sent' ? (
                  <>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path className="cm-check" strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    Message sent!
                  </>
                ) : status === 'error' ? (
                  <>Couldn't send. Try again</>
                ) : (
                  <>
                    {status === 'sending' ? 'Sending…' : 'Send message'}
                    <svg
                      className={`h-5 w-5 ${status === 'sending' ? 'cm-plane-fly' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                  </>
                )}
              </button>
              {status === 'error' && (
                <p role="alert" className="mt-3 text-center font-mono text-xs text-white/70">
                  or email me directly at{' '}
                  <a href={`mailto:${CONTACT.email}`} className="text-blue-300 underline underline-offset-2 hover:text-white">
                    {CONTACT.email}
                  </a>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
