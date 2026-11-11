import React, { useState, useEffect } from 'react';
import { handleAnchorClick } from '../utils/smoothScroll';

const Navbar = ({ onContact, onAbout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'home', href: '#home' },
    { name: 'projects', href: '#projects' },
    { name: 'about', href: '#about' },
    { name: 'contact', href: '#contact' },
  ];

  const onLinkClick = (e, link) => {
    if (link.name === 'contact') return onContact?.(e);
    if (link.name === 'about') return onAbout?.(e);
    handleAnchorClick(e);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      {/* Animation & Smooth Scaling for Desktop (1440px) & 4K */}
      <style>{`
      @keyframes mobileItemSlide {
    0% {
      opacity: 0;
      transform: translateY(12px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-mobile-item {
    animation: mobileItemSlide 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;}

       @keyframes navDropIn {
          0% { opacity: 0; transform: translateY(-40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-nav-drop {
          animation: navDropIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Smooth, non-breaking 1440px - 1920px Desktop scaling */
        @media (min-width: 1440px) and (max-width: 1999px) {
          .nav-container-top {
            width: 100%;
            max-width: 100%;
            padding: 1.7rem 4rem;
          }
          .nav-container-scrolled {
            width: 85% ;
            max-width: 1440px;
            transform: translateY(1.25rem);
          }
        }

        /* Smooth scaling on 2K / 4K / Ultra-wide Displays */
        @media (min-width: 2000px) {
          .nav-container-top {
            width: 100% ;
            max-width: 100%;
            padding: 2.5rem 6rem;
          }
          .nav-container-scrolled {
            width: 75% ;
            max-width: 1700px;
            padding: 1.25rem 3rem ;
            transform: translateY(2rem) ;
          }
          .nav-logo {
            font-size: 2.25rem !important;
          }
          .nav-link-text {
            font-size: 1.35rem !important;
          }
        }
      `}</style>

      <nav
        className={`pointer-events-auto animate-nav-drop flex items-center justify-between transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${
          isScrolled
            ? 'nav-container-scrolled w-[92%] sm:w-[85%] md:w-[80%] max-w-6xl translate-y-5 rounded-full border border-sky-400/60 bg-[#0b3a5f]/85 backdrop-blur-md py-3.5 px-6 shadow-[0_8px_30px_rgb(0,0,0,0.3)] shadow-sky-500/10'
            : 'nav-container-top w-full translate-y-0 bg-transparent py-6 px-8 md:px-16 border-b border-transparent'
        }`}
      >
        {/* Brand Logo */}
        <h1 className="nav-logo text-white text-xl font-black tracking-tight flex items-center">
          <a href="#home" onClick={handleAnchorClick} className="transition-opacity hover:opacity-90">
            Ali Mustafa
          </a>
        </h1>

        {/* Desktop Navigation Links (>= 768px) */}
        <ol className="hidden md:flex gap-10 font-medium">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                onClick={(e) => onLinkClick(e, link)}
                className="group relative inline-block py-1 text-blue-300 transition-colors hover:text-white"
              >
                <span className="nav-link-text capitalize text-base sm:text-lg">{link.name}</span>
                <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-white transition-all duration-300 ease-in-out group-hover:w-full rounded-full pointer-events-none" />
              </a>
            </li>
          ))}
        </ol>

        {/* Mobile Hamburger Button (< 768px) */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden relative z-50 p-2 text-blue-300 hover:text-white focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          <svg
            className="h-7 w-7 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

       {/* Mobile Menu Dropdown Panel */}
{mobileMenuOpen && (
  <div className="md:hidden absolute top-full left-0 right-0 mt-3 mx-auto w-[92%] rounded-2xl border-2 border-white bg-[#0b3a5f] p-6 shadow-[8px_8px_0_0_#93c5fd] animate-in fade-in slide-in-from-top-4 duration-200">
    <ol className="flex flex-col gap-4 text-center font-bold">
      {navLinks.map((link, index) => (
        <li
          key={link.name}
          className="animate-mobile-item"
          style={{ animationDelay: `${0.18 + index * 0.08}s` }}
        >
          <a
            href={link.href}
            onClick={(e) => {
              onLinkClick(e, link);
              setMobileMenuOpen(false);
            }}
            className="block py-2 text-lg capitalize text-blue-300 hover:text-white border-b border-white/10 last:border-0 transition-colors"
          >
            {link.name}
          </a>
        </li>
      ))}
    </ol>
  </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;