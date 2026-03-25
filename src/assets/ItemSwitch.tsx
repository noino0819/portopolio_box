import switchImg from './switch.png';

export default function ItemSwitch({ className = '' }: { className?: string }) {
  return (
    <img
      src={switchImg}
      alt="닌텐도 스위치"
      className={className}
      draggable={false}
    />
  );
}
