import '../styles/footer.css';

const Footer = () => (
  <footer>
    <div className="footer-logo">AzerT Agency</div>
    <p>Immersive exhibitions | Akira & Ghost in the Shell</p>
    <div className="socials">
      {/* R131 : réseaux sociaux en anglais → hrefLang="en" */}
      <a href="https://instagram.com" target="_blank" rel="noreferrer" hrefLang="en">
        Instagram <i className="fab fa-instagram"></i>
      </a>
      <a href="https://twitter.com" target="_blank" rel="noreferrer" hrefLang="en">
        Twitter <i className="fab fa-twitter"></i>
      </a>
      <a href="https://youtube.com" target="_blank" rel="noreferrer" hrefLang="en">
        YouTube <i className="fab fa-youtube"></i>
      </a>
    </div>
    <small>© 2026 AzerT Agency. Tous droits réservés.</small>
  </footer>
);

export default Footer;