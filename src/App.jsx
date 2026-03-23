import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Composants principaux
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Section from './components/Section.jsx';
import Footer from './components/Footer.jsx';

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

// Background
import Grainient from './components/Grainient.jsx';

// Page d'accueil
const Home = () => (
  <div>
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
  </div>
);

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
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/sent" element={<RegisterSent />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/backoffice" element={<Backoffice />} />
          <Route path="/activate" element={<Activate />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="/info-pratique" element={<InfoPratique />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;