import Shape from './CardTypes/Shape';
import Family from './CardTypes/Family';

const Card = ({ type, name, cards, index, flipped, disabled, onClick }: { type: string; name: string; cards: React.MutableRefObject<(HTMLElement | null)[]>; index: number; flipped: boolean; disabled: boolean; onClick: () => void }) => {
  const size = 100;
  const strokeWidth = 3;

  const setRef = (elem: HTMLElement | null) => {
    cards.current[index] = elem;
  };

  return (
    <button type="button" className={`grid-item-initial ${flipped ? 'grid-item-turnover' : ''}`} ref={setRef} onClick={onClick} disabled={disabled}>
      {type === 'shape' ? <Shape shapeName={name} size={size} strokeWidth={strokeWidth} /> : type === 'family' ? <Family familyMemberName={name} /> : null}
    </button>
  );
};

export default Card;
