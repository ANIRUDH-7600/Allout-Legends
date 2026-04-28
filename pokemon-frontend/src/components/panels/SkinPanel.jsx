import './style.css';

export default function SkinPanel({ title = 'ALLOUT LEGENDS', quantity = 8 }) {
  const images = Array.from({ length: quantity }, (_, i) => {
    const index = i + 1;
    return new URL(`./images/dragon_${index}.png`, import.meta.url).href;
  });

  return (
    <div>
      <div className="banner">
        <div className="slider" style={{ ['--quantity']: String(quantity) }}>
          {images.map((src, idx) => (
            <div className="item" key={idx} style={{ ['--position']: String(idx + 1) }}>
              <img src={src} alt={`dragon ${idx + 1}`} />
            </div>
          ))}
        </div>

        <div className="content">
          <h1 data-content={title}>{title}</h1>
          <div className="model" />
        </div>
      </div>
    </div>
  );
}
