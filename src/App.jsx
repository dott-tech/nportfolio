import { useEffect, useState } from 'react'

import './App.css'
import Navbar from './components/navbar'
import Hero from './components/hero'
import Projects from './components/projects'
import Contact from './components/contacts'
import About from './components/about'

function App() {
  const [contact, setContact] = useState({ open: false, origin: null });

  // open the contact popup, growing out of whatever was clicked
  const openContact = (e) => {
    e?.preventDefault();
    const rect = e?.currentTarget?.getBoundingClientRect();
    const origin = rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : null;
    setContact({ open: true, origin });
  };

  // the About page lives at #about so the browser back button and shared links work
  const [aboutOpen, setAboutOpen] = useState(() => window.location.hash === '#about');

  useEffect(() => {
    const onPop = () => setAboutOpen(window.location.hash === '#about');
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const openAbout = (e) => {
    e?.preventDefault();
    if (window.location.hash !== '#about') history.pushState(null, '', '#about');
    setAboutOpen(true);
  };

  const closeAbout = () => {
    setAboutOpen(false);
    if (window.location.hash === '#about') history.replaceState(null, '', window.location.pathname);
  };

 return(
  <div className="bg-[#0b3a5f] min-h-screen">
  <Navbar onContact={openContact} onAbout={openAbout}/>
  <Hero onContact={openContact}/>
  <Projects/>
  <About open={aboutOpen} onClose={closeAbout} onContact={openContact}/>
  <Contact
    open={contact.open}
    origin={contact.origin}
    onClose={() => setContact({ open: false, origin: null })}
  />

  </div>);
};

export default App
