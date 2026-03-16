import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Composants principaux
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Section from './components/Section.jsx';
import Footer from './components/Footer.jsx';

// Pages
import Experiences from './pages/Experiences.jsx';
import CalendrierPage from './pages/Calendrier.jsx';
import FormReservationPage from './pages/Form_reservation.jsx';
import ConfirmationPage from './pages/Confirmation.jsx';
import InfoPratique from './pages/Info_pratique.jsx';

// Styles
import './styles/global.css';
import './styles/navbar.css';
import './styles/app.css';
import './styles/hero.css';

// Page d'accueil
const Home = () => {
  return (
    <div>
      <Hero
        title1="AKIRA"
        title2="GHOST IN THE SHELL"
        subtitle="Au-delà de l'humain"
      />

      {/* <div className="teaser">
        <h2>Quand la technologie dépasse l'humain… osez franchir la frontière.</h2>
      </div> */}

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
    </div>
  );
};

// Composant principal de l'application
const App = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/calendrier" element={<CalendrierPage />} />
          <Route path="/form-reservation" element={<FormReservationPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="/info-pratique" element={<InfoPratique />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
};

export default App;