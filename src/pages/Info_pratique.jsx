import Map from '../components/Map';
import InfoCard from '../components/InfoCard';
import ContactSection from '../components/ContactSection';
import '../styles/info-pratique.css';

const InfoPratique = () => {
  return (
    <div className="info-pratique-container">
      <h1>INFORMATIONS PRATIQUES</h1>
      
      <div className="info-content">
        <InfoCard icon="📍" title="Adresse">
          <p>
            Au delà de l'Humain<br />
            avenue de je sais pas quoi<br />
            75000 Paris, France
          </p>
        </InfoCard>

        <InfoCard icon="🕒" title="Horaires">
          <p>
            <strong>Lundi - Vendredi :</strong> 10h00 - 18h00<br />
            <strong>Samedi - Dimanche :</strong> 10h00 - 20h00<br />
            <strong>Fermé :</strong> Jours fériés
          </p>
        </InfoCard>

        <InfoCard icon="💰" title="Tarifs">
          <p>
            <strong>Adulte :</strong> 15€<br />
            <strong>Étudiant :</strong> 10€<br />
            <strong>Enfant (-12 ans) :</strong> 5€<br />
            <strong>Gratuit :</strong> -3 ans
          </p>
        </InfoCard>

        <InfoCard icon="🚇" title="Accès">
          <p>
            <strong>Métro :</strong> Ligne 1, 6<br />
            <strong>Bus :</strong> Lignes 22, 30, 82<br />
            <strong>Parking :</strong> Disponible à proximité
          </p>
        </InfoCard>
      </div>

      <div className="map-section">
        <h2>📍 Localisation</h2>
        <Map />
      </div>

      <ContactSection 
        phone="+33 1 23 45 67 89"
        email="contact@azert.fr"
        website="www.azert.fr"
      />
    </div>
  );
};

export default InfoPratique;
