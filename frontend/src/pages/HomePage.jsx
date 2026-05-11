import React, { useEffect } from 'react';
import Hero from '../sections/Hero.jsx';
import Sobre from '../sections/Sobre.jsx';
import Enfoque from '../sections/Enfoque.jsx';
import Servicios from '../sections/Servicios.jsx';
import Situaciones from '../sections/Situaciones.jsx';
import Testimonios from '../sections/Testimonios.jsx';
import FAQ from '../sections/FAQ.jsx';
import CTA from '../sections/CTA.jsx';

export default function HomePage() {
  useEffect(() => {
    document.title = 'Dra. Rosibel Cascante Bermúdez · Psicología clínica · San José';
  }, []);

  return (
    <>
      <Hero />
      <Sobre />
      <Enfoque />
      <Servicios />
      <Situaciones />
      <Testimonios />
      <FAQ />
      <CTA />
    </>
  );
}
