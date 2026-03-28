/* Carte Google Maps - Musée Guimet */

const Map = () => {
  return (
    <div className="map-container" style={{ width: '100%', height: '450px' }}>
      {/* Intégration Google Maps embarquée */}
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.638587791063!2d2.2911854764648205!3d48.86510177133308!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66fe5cd3929c3%3A0xb5ec0412a7bc9c89!2sMus%C3%A9e%20national%20des%20arts%20asiatiques%20-%20Guimet!5e0!3m2!1sfr!2sfr!4v1774733975514!5m2!1sfr!2sfr" 
        width="100%" 
        height="100%" 
        style={{ border: '0' }} 
        allowFullScreen="" 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
        title="Localisation du Musée Guimet - Musée national des arts asiatiques"
        aria-label="Carte Google Maps du Musée Guimet à Paris"
      ></iframe>
    </div>
  );
};

export default Map;
