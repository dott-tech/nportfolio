import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import Navbar from './components/navbar'
import Hero from './components/hero'
import Projects from './components/projects'
import Contact from './components/contacts'

function App() {
  const [contact, setContact] = useState({ open: false, origin: null });

  // open the contact popup, growing out of whatever was clicked
  const openContact = (e) => {
    e?.preventDefault();
    const rect = e?.currentTarget?.getBoundingClientRect();
    const origin = rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : null;
    setContact({ open: true, origin });
  };

 return(
  <div className="bg-[#0b3a5f] min-h-screen">
  <Navbar onContact={openContact}/>
  <Hero onContact={openContact}/>
  <Projects/>
  <Contact
    open={contact.open}
    origin={contact.origin}
    onClose={() => setContact({ open: false, origin: null })}
  />

  </div>);
};

export default App
