import type { BacachitoMood } from '@/types/bacachito';

interface BacachitoLabelProps {
  mood: BacachitoMood;
}

const LABEL_TINT: Partial<Record<BacachitoMood, string>> = {
  fire: '#7A2020',
  love: '#5A1A3A',
  angry: '#5A1515',
};

const BacachitoLabel: React.FC<BacachitoLabelProps> = ({ mood }) => {
  const tint = LABEL_TINT[mood];

  return (
    <g id="bk-label">
      <path
        d="
          M -65,25
          Q 0,85 65,25
          L 65,115
          L -65,115
          Z
        "
        fill={tint ?? '#212121'}
      />
    </g>
  );
};

export default BacachitoLabel;
