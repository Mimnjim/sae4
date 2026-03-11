const ContactSection = ({ phone, email, website }) => {
  return (
    <div className="contact-section">
      <h2>📞 Contact</h2>
      <p>
        <strong>Téléphone :</strong> {phone}<br />
        <strong>Email :</strong> {email}<br />
        <strong>Site web :</strong> {website}
      </p>
    </div>
  );
};

export default ContactSection;
