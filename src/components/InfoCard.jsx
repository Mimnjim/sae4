const InfoCard = ({ icon, title, children }) => {
  return (
    <div className="info-section">
      <h2>{icon} {title}</h2>
      {children}
    </div>
  );
};

export default InfoCard;
