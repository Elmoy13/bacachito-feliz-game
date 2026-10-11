interface BacachitoLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animate?: boolean;
}

const SIZES = { sm: 48, md: 80, lg: 120 } as const;

const BacachitoLogo: React.FC<BacachitoLogoProps> = ({
  size = 'md',
  className = '',
  animate = false,
}) => {
  const px = SIZES[size];

  return (
    <img
      src="/logosinletras.png"
      alt="Bacachito Feliz"
      width={px}
      height={px}
      className={`object-contain select-none ${animate ? 'bacachito-float' : ''} ${className}`}
      draggable={false}
    />
  );
};

export default BacachitoLogo;
