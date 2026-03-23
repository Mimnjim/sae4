import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TargetCursor from './components/TargetCursor';
import Grainient from './components/Grainient';

// Composants principaux
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Section from './components/Section.jsx';
import Footer from './components/Footer.jsx';
import MangaArchive from './components/MangaArchive.jsx';
import ExperiencesSection from './components/ExperiencesSection.jsx';
import TransitionSection from './components/TransitionSection.jsx';
import SectionSeparator from './components/SectionSeparator.jsx';
import Podcast from './components/Podcast.jsx';
import Teaser from './components/Teaser.jsx';

// Pages
import Experiences from './pages/Experiences.jsx';
import FormReservationPage from './pages/Form_reservation.jsx';
import ConfirmationPage from './pages/Confirmation.jsx';
import InfoPratique from './pages/Info_pratique.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import RegisterSent from './pages/RegisterSent.jsx';
import UserProfile from './pages/UserProfile.jsx';
import Backoffice from './pages/backoffice/Backoffice.jsx';
import Activate from './pages/Activate.jsx';

// Styles
import './styles/global.css';
import './styles/navbar.css';
import './styles/app.css';
import './styles/hero.css';
import './styles/section.css';
import './styles/TargetCursor.css';
import './styles/Grainient.css';
import './styles/manga-archive.css';
import './styles/immersion-overlay.css';
import './styles/transition-section.css';
import './styles/teaser.css';
import './styles/podcast.css';

// Page d'accueil
const Home = () => {
  return (
    <div className="home-container">
      {/* Les sections vont flotter au-dessus du Grainient */}

      <Hero
        title1="AKIRA"
        title2="GHOST IN THE SHELL"
        subtitle="Au-delà de l'humain"
      />

      {/* ── Image de fond de transition de fin de section*/}
      <div className="hero-to-archive-transition">

        {/* MangaArchive est un frère, APRÈS l'overlay */}
        <MangaArchive />

      
        <SectionSeparator />
        <ExperiencesSection />


        <SectionSeparator />
        <Teaser />

        <SectionSeparator />
        <Podcast />

        <TransitionSection />
      </div>

    </div>
  );
};

// Composant principal de l'application
const App = () => {
  return (
    <>
      {/* LE FOND : Positionné en fixed via CSS ou style inline pour être sûr */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
        <Grainient
          color1="#ba121b"
          color2="#521414"
          color3="#075a50"
          timeSpeed={0.25}
          colorBalance={0.27}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={2}
          warpAmplitude={56}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={-0.08}
          centerY={0.03}
          zoom={0.65}
          className="page-gradient"
        />
      </div>

      {/* LE CURSEUR : Toujours au sommet */}
      <TargetCursor 
        spinDuration={2}
        hideDefaultCursor
        parallaxOn
        hoverDuration={0.2} 
      />

      <Router>
        {/* LE CONTENU : On le force au-dessus du Grainient */}
        <div className="App-wrapper" style={{ position: 'relative', zIndex: 10 }}>
          <Navbar />
          
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/experiences" element={<Experiences />} />
              {/* <Route path="/calendrier" element={<CalendrierPage />} /> */}
              <Route path="/form-reservation" element={<FormReservationPage />} />
              <Route path="/confirmation" element={<ConfirmationPage />} />
              <Route path="/info-pratique" element={<InfoPratique />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </>
  );
};

export default App;