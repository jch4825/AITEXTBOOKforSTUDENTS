interface Props {
  icon: string;
  size?: number;
  className?: string;
}

export default function ActivityIcon({ icon, size = 40, className }: Props) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}lessons/pecs/${icon}.webp`}
      alt=""
      aria-hidden
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size, objectFit: 'contain' }}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).style.visibility = 'hidden';
      }}
    />
  );
}
