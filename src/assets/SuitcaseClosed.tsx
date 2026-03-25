import suitcaseImg from './suitcase-closed.png';

export default function SuitcaseClosed({ className = '' }: { className?: string }) {
  return (
    <img
      src={suitcaseImg}
      alt="닫힌 여행가방"
      className={className}
      draggable={false}
    />
  );
}
