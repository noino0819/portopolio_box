import bookImg from './book.png';

export default function ItemBook({ className = '' }: { className?: string }) {
  return (
    <img
      src={bookImg}
      alt="책"
      className={className}
      draggable={false}
    />
  );
}
