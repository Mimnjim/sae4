// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar.jsx';
// import Hero from './components/Hero.jsx';
// import Section from './components/Section.jsx';
// import Footer from './components/Footer.jsx';
// import Experiences from './pages/Experiences.jsx'; // Import de la page
// import GamePage from './pages/GamePage.jsx';       // Import du jeu
// import './styles/global.css';
// import './styles/navbar.css';
// import './styles/app.css';

// export default function App() {
//   return (
//     <div className="App">
//         {/* <Background3D /> */}
//         <Navbar />
//         {/* HERO SECTION */}
//         <Hero
//             title1="AKIRA"
//             title2="GHOST IN THE SHELL"
//             subtitle="Au-delà de l'humain"
//         />

//         {/* TEASER ANIMÉ */}
//         <div className="teaser">
//             <h2>Quand la technologie dépasse l'humain… osez franchir la frontière.</h2>
//         </div>

//         {/* LES DIFFERENTES SECTIONS */}
//         <Section
//             id="akira"
//             title="Akira"
//             content="Découvrez Neo-Tokyo et les mutations physiques et mentales de ses héros dans un univers cyberpunk lumineux et glitché."
//             imgSrc="img/Akira1.jpg"
//             reverse={false}
//         />

//         <Section
//             id="ghost"
//             title="Ghost in the Shell"
//             content="Plongez dans la conscience augmentée et la réflexion philosophique sur l'identité à l'ère de l'IA et des cyber-corps."
//             imgSrc="img/GIS1.jpg"
//             reverse={true}
//         />

//         <Section
//             id="themes"
//             title="Thématiques immersives"
//             content="Corps augmenté, IA, identité et transhumanisme. Des installations interactives et des projections visuelles immersives vous attendent."
//             imgSrc="img/cyberpunk.webp"
//             reverse={false}
//         />

//         <Section
//             id="experience"
//             title="Expérience interactive"
//             content="Un avant-goût du futur jeu immersif, avec manipulation virtuelle et environnement sonore immersif."
//             imgSrc="assets/images/experience-immersive.jpg"
//             reverse={true}
//         />

//         {/* FOOTER */}
//         <Footer />
//         </div>
//   );
// }

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import des composants
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Section from './components/Section.jsx';
import Footer from './components/Footer.jsx';

// Import des nouvelles pages
import Experiences from './pages/Experiences.jsx';
import CalendrierPage from './pages/Calendrier.jsx';
// import GamePage from './pages/GamePage.jsx';
// import Game from './components/Game/Game.jsx';


// Import des styles
import './styles/global.css';
import './styles/navbar.css';
import './styles/app.css';

// --- COMPOSANT ACCUEIL (HOME) ---
const Home = () => (
  <>
    <Hero
      title1="AKIRA"
      title2="GHOST IN THE SHELL"
      subtitle="Au-delà de l'humain"
    />

    <div className="teaser">
      <h2>Quand la technologie dépasse l'humain… osez franchir la frontière.</h2>
    </div>

    <Section
      id="akira"
      title="Akira"
      content="Découvrez Neo-Tokyo et les mutations physiques et mentales de ses héros dans un univers cyberpunk lumineux et glitché."
      imgSrc="img/Akira1.jpg"
      reverse={false}
    />

    <Section
      id="ghost"
      title="Ghost in the Shell"
      content="Plongez dans la conscience augmentée et la réflexion philosophique sur l'identité à l'ère de l'IA et des cyber-corps."
      imgSrc="img/GIS1.jpg"
      reverse={true}
    />

    <Section
      id="themes"
      title="Thématiques immersives"
      content="Corps augmenté, IA, identité et transhumanisme. Des installations interactives et des projections visuelles immersives vous attendent."
      imgSrc="img/cyberpunk.webp"
      reverse={false}
    />

    <Section
      id="experience"
      title="Expérience interactive"
      content="Un avant-goût du futur jeu immersif, avec manipulation virtuelle et environnement sonore immersif."
      imgSrc="assets/images/experience-immersive.jpg"
      reverse={true}
    />
  </>
);

// --- COMPOSANT PRINCIPAL ---
export default function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        
        <Routes>
          {/* Route pour l'accueil */}
          <Route path="/" element={<Home />} />
          
          {/* Route pour le menu des expériences */}
          {/* <Route path="/experiences" element={<Experiences />} /> */}
          <Route path="/experiences" element={<Experiences />} />
          
          {/* Route pour le calendrier */}
          <Route path="/calendrier" element={<CalendrierPage />} />
          
          {/* Route pour le jeu lui-même */}
          {/* <Route path="/game/:levelId" element={<GamePage />} /> */}
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}