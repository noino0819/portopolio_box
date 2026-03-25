import cdImg from './cd.png';

export default function ItemCD({ className = '' }: { className?: string }) {
  return (
    <img
      src={cdImg}
      alt="CD"
      className={className}
      draggable={false}
    />
  );
}
