import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TargetCursor from './animations/TargetCursor';
import Grainient from './animations/Grainient';

// Composants principaux
import GatewayScreen from './components/global_components/GatewayScreen';
import Navbar from './components/global_components/Navbar.jsx';
import Hero from './components/homepage_components/herosections_components/Hero.jsx';
import Footer from './components/global_components/Footer.jsx';
import MangaArchive from './components/homepage_components/MangaArchive.jsx';
import ExperiencesSection from './components/homepage_components/ExperiencesSection.jsx';
import TransitionSection from './components/homepage_components/TransitionSection.jsx';
import SectionSeparator from './components/global_components/SectionSeparator.jsx';
import Podcast from './components/homepage_components/Podcast.jsx';
import Teaser from './components/homepage_components/Teaser.jsx';

// Pages
import Experiences from './pages/Experiences.jsx';
import FormReservationPage from './pages/Form_reservation.jsx';
import ReservationDetails from './pages/ReservationDetails.jsx';
import ConfirmationPage from './pages/Confirmation.jsx';
import InfoPratique from './pages/InfosPratiques.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import RegisterSent from './pages/RegisterSent.jsx';
import ResetPassword from './pages/Reset-password.jsx';
import UserProfile from './pages/UserProfile.jsx';
import Backoffice from './pages/backoffice/Backoffice.jsx';
import Activate from './pages/Activate.jsx';

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
const Home = () => {
  const { t } = useTranslation();
  return (
    <div className="home-container">
      {/* Les sections vont flotter au-dessus du Grainient */}

      <Hero
        title1={t('hero.title1')}
        title2={t('hero.title2')}
        subtitle={t('hero.subtitle')}
      />

      {/* ── Image de fond de transition de fin de section*/}
      <div className="hero-to-archive-transition">

        {/* MangaArchive est un frère, APRÈS l'overlay */}
        <MangaArchive />

      
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

// Composant principal de l'application
const App = () => {
  const [entered, setEntered] = useState(false);
  const [user, setUser] = useState(null);


  return (
    <>
      {!entered && <GatewayScreen onEnter={() => setEntered(true)} />}


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
        {/* LE CONTENU : On le force au-dessus du Grainient */}
        <div className="App-wrapper" style={{ position: 'relative', zIndex: 10 }}>
          
          {/* Old version - before Tom's merge */}
          
          {/* <Navbar /> */}
          {/* <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/experiences" element={<Experiences />} />
              <Route path="/form-reservation" element={<FormReservationPage />} />
              <Route path="/confirmation" element={<ConfirmationPage />} />
              <Route path="/infos-pratiques" element={<InfoPratique />} />
            </Routes>
          </main> */}


          <Navbar user={user} setUser={setUser} />

          <main className="main-content">
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/form-reservation" element={<FormReservationPage />} />
            <Route path="/form-reservation/coordonnees" element={<ReservationDetails />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register/sent" element={<RegisterSent />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/backoffice" element={<Backoffice />} />
            <Route path="/activate" element={<Activate />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
            <Route path="/infos-pratiques" element={<InfoPratique />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </>
  );
};

export default App;