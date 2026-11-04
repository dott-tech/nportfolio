import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import Navbar from './components/navbar'
import Hero from './components/hero'
import Projects from './components/projects'

function App() {
 return(
  <div className="bg-[#0b3a5f] min-h-screen">
  <Navbar/>
  <Hero/>
  <Projects/>

  </div>);
};

export default App
