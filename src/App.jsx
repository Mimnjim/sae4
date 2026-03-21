// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import TargetCursor from './components/TargetCursor';
// import Grainient from './components/Grainient';

// // Composants principaux
// import Navbar from './components/Navbar.jsx';
// import Hero from './components/Hero.jsx';
// import Section from './components/Section.jsx';
// import Footer from './components/Footer.jsx';
// import MangaArchive from './components/MangaArchive.jsx';

// // Pages
// import Experiences from './pages/Experiences.jsx';
// import CalendrierPage from './pages/Calendrier.jsx';
// import FormReservationPage from './pages/Form_reservation.jsx';
// import ConfirmationPage from './pages/Confirmation.jsx';
// import InfoPratique from './pages/Info_pratique.jsx';

// // Styles
// import './styles/global.css';
// import './styles/navbar.css';
// import './styles/app.css';
// import './styles/hero.css';
// import './styles/section.css';
// import './styles/TargetCursor.css';
// import './styles/Grainient.css';

// // Page d'accueil
// const Home = () => {
//   return (
//     <div className="app-container">
//       <Hero
//         title1="AKIRA"
//         title2="GHOST IN THE SHELL"
//         subtitle="Au-delà de l'humain"
//       />

//       <MangaArchive />

//       {/* <div className="teaser">
//         <h2>Quand la technologie dépasse l'humain… osez franchir la frontière.</h2>
//       </div> */}

//       <Section
//         id="akira"
//         title="Akira"
//         content="Découvrez Neo-Tokyo et les mutations physiques et mentales de ses héros dans un univers cyberpunk lumineux et glitché."
//         imgSrc="img/Akira1.jpg"
//         reverse={true}
//       />

//       <Section
//         id="ghost"
//         title="Ghost in the Shell"
//         content="Plongez dans la conscience augmentée et la réflexion philosophique sur l'identité à l'ère de l'IA et des cyber-corps."
//         imgSrc="img/GIS1.jpg"
//         reverse={false}
//       />

//       {/* <Section
//         id="themes"
//         title="Thématiques immersives"
//         content="Corps augmenté, IA, identité et transhumanisme. Des installations interactives et des projections visuelles immersives vous attendent."
//         imgSrc="img/cyberpunk.webp"
//         reverse={false}
//       />

//       <Section
//         id="experience"
//         title="Expérience interactive"
//         content="Un avant-goût du futur jeu immersif, avec manipulation virtuelle et environnement sonore immersif."
//         imgSrc="assets/images/experience-immersive.jpg"
//         reverse={true}
//       /> */}
//     </div>
//   );
// };

// // Composant principal de l'application
// const App = () => {
//   return <>
//       <Grainient
//         color1="#ba121b"
//         color2="#521414"
//         color3="#075a50"
//         timeSpeed={0.25}
//         colorBalance={0.27}
//         warpStrength={1}
//         warpFrequency={5}
//         warpSpeed={2}
//         warpAmplitude={56}
//         blendAngle={0}
//         blendSoftness={0.05}
//         rotationAmount={500}
//         noiseScale={2}
//         grainAmount={0.1}
//         grainScale={2}
//         grainAnimated={false}
//         contrast={1.5}
//         gamma={1}
//         saturation={1}
//         centerX={-0.08}
//         centerY={0.03}
//         zoom={0.65}
//         className="page-gradient"
//       />

//     <TargetCursor 
//       spinDuration={2}
//       hideDefaultCursor
//       parallaxOn
//       hoverDuration={0.2} 
//     />

//     <Router>
//         <div className="App">
//           <Navbar />
          
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/experiences" element={<Experiences />} />
//             <Route path="/calendrier" element={<CalendrierPage />} />
//             <Route path="/form-reservation" element={<FormReservationPage />} />
//             <Route path="/confirmation" element={<ConfirmationPage />} />
//             <Route path="/info-pratique" element={<InfoPratique />} />
//           </Routes>

//           <Footer />
//         </div>
//       </Router>
//   </>;  
// };

// export default App;


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TargetCursor from './components/TargetCursor';
import Grainient from './components/Grainient';

// Composants principaux
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Section from './components/Section.jsx';
import Footer from './components/Footer.jsx';
import MangaArchive from './components/MangaArchive.jsx';

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
import './styles/section.css';
import './styles/TargetCursor.css';
import './styles/Grainient.css';
import './styles/mangaarchive.css';

// Page d'accueil
const Home = () => {
  return (
    <div className="home-container">
      <Hero
        title1="AKIRA"
        title2="GHOST IN THE SHELL"
        subtitle="Au-delà de l'humain"
      />

      {/* Cette section va maintenant flotter au-dessus du Grainient */}
      <MangaArchive />

      {/* <img src="/img/Akira1.jpg" alt="" /> */}

      {/* <Section
        id="akira"
        title="Akira"
        content="Découvrez Neo-Tokyo et les mutations physiques et mentales de ses héros dans un univers cyberpunk lumineux et glitché."
        imgSrc="img/Akira1.jpg"
        reverse={true}
      />

      <Section
        id="ghost"
        title="Ghost in the Shell"
        content="Plongez dans la conscience augmentée et la réflexion philosophique sur l'identité à l'ère de l'IA et des cyber-corps."
        imgSrc="img/GIS1.jpg"
        reverse={false}
      /> */}
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
              <Route path="/calendrier" element={<CalendrierPage />} />
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