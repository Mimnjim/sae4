import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TargetCursor from './animations/TargetCursor';
import Grainient from './animations/Grainient';
import { SoundProvider } from './sound/SoundContext';
import useSoundInteractions from './sound/useSoundInteractions';

// Composants principaux
import GatewayScreen from './components/global_components/GatewayScreen';
import Navbar from './components/global_components/Navbar.jsx';
import SoundToggle from './components/global_components/SoundToggle.jsx';
import ScrollToTop from './components/global_components/ScrollToTop.jsx';
import Hero from './components/homepage_components/herosections_components/Hero.jsx';
import Footer from './components/global_components/Footer.jsx';
import Expositions from './components/homepage_components/Expositions.jsx';
import ExperiencesSection from './components/homepage_components/ExperiencesSection.jsx';
import TransitionSection from './components/homepage_components/TransitionSection.jsx';
import Podcast from './components/homepage_components/Podcast.jsx';
import Teaser from './components/homepage_components/Teaser.jsx';

// Pages
import Experiences from './pages/experiences_pages/Experiences.jsx';
import FormReservationPage from './pages/book_pages/Form_reservation.jsx';
import ReservationDetails from './pages/book_pages/ReservationDetails.jsx';
import ConfirmationPage from './pages/book_pages/Confirmation.jsx';
import InfoPratique from './pages/practical_info_pages/InfosPratiques.jsx';
import Login from './pages/connexion_pages/Login.jsx';
import Register from './pages/inscriptions_pages/Register.jsx';
import RegisterSent from './pages/inscriptions_pages/RegisterSent.jsx';
import ResetPassword from './pages/connexion_pages/Reset-password.jsx';
import UserProfile from './pages/connexion_pages/UserProfile.jsx';
import Backoffice from './pages/backoffice_pages/backoffice/Backoffice.jsx';
import Activate from './pages/inscriptions_pages/Activate.jsx';
import NotFound from './pages/NotFound.jsx';
import Sources from './pages/practical_info_pages/Sources.jsx';
import MentionsLegales from './pages/legal_pages/MentionsLegales.jsx';
import PolitiqueConfidentialite from './pages/legal_pages/PolitiqueConfidentialite.jsx';

// Styles
import './styles/components/global_components/global.css';
import './styles/app.css';
import './styles/animations/TargetCursor.css';
import './styles/animations/Grainient.css';
import './styles/components/homepage_components/herosections_components/hero.css';
import './styles/components/homepage_components/herosections_components/immersion-overlay.css';
import './styles/components/homepage_components/experiences-section.css';
import './styles/components/homepage_components/manga-archive.css';
import './styles/components/homepage_components/transition-section.css';
import './styles/components/homepage_components/teaser.css';
import './styles/components/homepage_components/podcast.css';
import './styles/components/global_components/navbar.css';
import './styles/components/global_components/footer.css';
import './styles/components/global_components/gateway-screen.css';

// Page d'accueil
const Home = ({ entered, setEntered }) => {
  const { t } = useTranslation();
  return (
    <div className="home-container">
      {!entered && <GatewayScreen onEnter={() => setEntered(true)} />}
      {/* Les sections vont flotter au-dessus du Grainient */}

      <Hero
        title1={t('hero.title1')}
        title2={t('hero.title2')}
        subtitle={t('hero.subtitle')}
      />

      {/* ── Image de fond de transition de fin de section*/}
      <div className="hero-to-archive-transition">

        {/* Expositions est un frère, APRÈS l'overlay */}
        <Expositions />

      
        {/* <SectionSeparator /> */}
        <ExperiencesSection />


        {/* <SectionSeparator /> */}
        <Teaser />

        {/* <SectionSeparator /> */}
        <Podcast />

        <TransitionSection />
      </div>

    </div>
  );
};

// Composant contenu de l'application (à l'intérieur de SoundProvider)
const AppContent = ({ entered, setEntered, user, setUser }) => {
  // Ajouter les sons aux interactions - bon endroit maintenant (dans le SoundProvider)
  useSoundInteractions();
  const [showGrainient, setShowGrainient] = useState(false);

  // Charger le Grainient après le GatewayScreen ou après 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGrainient(true);
    }, entered ? 100 : 500);
    return () => clearTimeout(timer);
  }, [entered]);

  return (
    <>
      {/* LE FOND : Positionné en fixed via CSS ou style inline pour être sûr */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
        {showGrainient && (
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
        )}

        {/* Background canvas (Grainient) mounted above */}
      </div>

      {/* LE CURSEUR : Toujours au sommet */}
      <TargetCursor 
        spinDuration={2}
        hideDefaultCursor
        parallaxOn
        hoverDuration={0.2} 
      />

      <Router>
        <ScrollToTop />
        {/* BOUTON SON FIXE - Dans le Router pour accès à useLocation */}
        <SoundToggle entered={entered} />
        
        {/* LE CONTENU : On le force au-dessus du Grainient */}
        <div className="App-wrapper" style={{ position: 'relative', zIndex: 10 }}>
          <Navbar user={user} setUser={setUser} />

          <main className="main-content">
            <Routes>
            <Route path="/" element={<Home entered={entered} setEntered={setEntered} />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/form-reservation" element={<FormReservationPage />} />
            <Route path="/form-reservation/coordonnees" element={<ReservationDetails />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register/sent" element={<RegisterSent />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={<UserProfile user={user} setUser={setUser} />} />
            <Route path="/backoffice" element={<Backoffice />} />
            <Route path="/activate" element={<Activate />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
            <Route path="/infos-pratiques" element={<InfoPratique />} />
            <Route path="/sources" element={<Sources />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
            {/* R225 : Route de page d'erreur 404 avec menu de navigation */}
            <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </>
  );
};

// Composant principal de l'application
const App = () => {
  const [entered, setEntered] = useState(false);
  const [user, setUser] = useState(null);

  // Récupérer l'utilisateur depuis localStorage au montage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Erreur au parsing du user stocké:', e);
      }
    }
  }, []);

  return (
    <SoundProvider>
      <AppContent entered={entered} setEntered={setEntered} user={user} setUser={setUser} />
    </SoundProvider>
  );
};

export default App;