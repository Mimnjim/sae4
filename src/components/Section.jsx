export default function Section({ id, title, content, imgSrc, reverse }) {
  const sectionClass = reverse ? 'section reverse' : 'section';

  return (
    <section id={id} className={sectionClass}>
      <div className="content">
        <h2>{title}</h2>
        <p>{content}</p>
      </div>
      <img src={imgSrc} alt={title} />
    </section>
  );
}