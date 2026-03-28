import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Composants principaux
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Section from './components/Section.jsx';
import Footer from './components/Footer.jsx';

// Pages
import Experiences from './pages/Experiences.jsx';
import FormReservationPage from './pages/Form_reservation.jsx';
import ReservationDetails from './pages/ReservationDetails.jsx';
import ConfirmationPage from './pages/Confirmation.jsx';
import InfoPratique from './pages/Info_pratique.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import RegisterSent from './pages/RegisterSent.jsx';
import UserProfile from './pages/UserProfile.jsx';
import Backoffice from './pages/backoffice/Backoffice.jsx';
import NotFound from './pages/NotFound';

// Styles
import './styles/global.css';
import './styles/navbar.css';
import './styles/app.css';

// Background
import Grainient from './components/Grainient.jsx';

// Page d'accueil
const Home = () => {
  const { t } = useTranslation();
  return (
    <div>
      <Hero
        title1={t('hero.title1')}
        title2={t('hero.title2')}
        subtitle={t('hero.subtitle')}
      />
      <div className="teaser">
        <h2>{t('teaser.text') || 'Quand la technologie dépasse l\'humain… osez franchir la frontière.'}</h2>
      </div>
      <Section
        id="akira"
        title={t('sections.akira.title')}
        content={t('sections.akira.content')}
        imgSrc="img/Akira1.jpg"
        reverse={false}
      />
      <Section
        id="ghost"
        title={t('sections.ghost.title')}
        content={t('sections.ghost.content')}
        imgSrc="img/GIS1.jpg"
        reverse={true}
      />
      <Section
        id="themes"
        title={t('sections.themes.title')}
        content={t('sections.themes.content')}
        imgSrc="img/cyberpunk.webp"
        reverse={false}
      />
      <Section
        id="experience"
        title={t('sections.experience.title')}
        content={t('sections.experience.content')}
        imgSrc="assets/images/experience-immersive.jpg"
        reverse={true}
      />
    </div>
  );
};

// Composant principal
const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('jwt') || localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser && savedUser !== 'undefined') {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <Router>
      <div className="App">

        {/* Background animé — derrière tout le contenu */}
        <Grainient
          color1="#ba121b"
          color2="#521414"
          color3="#075a50"
          colorBalance={0.27}
          warpAmplitude={56}
          centerY={0.03}
          zoom={0.65}
          centerX={-0.08}
        />

        {/* Background canvas (Grainient) mounted above */}

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
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/backoffice" element={<Backoffice />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="/info-pratique" element={<InfoPratique />} />
          <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;