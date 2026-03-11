const Section = ({ id, title, content, imgSrc, reverse }) => {
  // Créer le nom de la classe en fonction de reverse
  let sectionClass = 'section';
  if (reverse === true) {
    sectionClass = 'section reverse';
  }

  return (
    <section id={id} className={sectionClass}>
      <div className="content">
        <h2>{title}</h2>
        <p>{content}</p>
      </div>
      <img src={imgSrc} alt={title} />
    </section>
  );
};

export default Section;