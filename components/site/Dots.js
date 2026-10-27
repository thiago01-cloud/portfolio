// Niveau en points, comme sur le CV (ex. ●●●●○)
export default function Dots({ value, max = 5 }) {
  return (
    <span className="dots" role="img" aria-label={`Niveau ${value} sur ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < value ? 'on' : ''} />
      ))}
    </span>
  );
}
