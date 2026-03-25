import nametagImg from './nametag.png';

export default function ItemNametag({ className = '' }: { className?: string }) {
  return (
    <img
      src={nametagImg}
      alt="이름표 목걸이"
      className={className}
      draggable={false}
    />
  );
}
