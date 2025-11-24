const Shape = ({ shapeName, size, strokeWidth }: { shapeName: string; size: number; strokeWidth: number }) => {
  switch (shapeName) {
    case 'triangle':
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <polygon points="25,5 45,45 5,45" stroke="currentColor" strokeWidth={strokeWidth} fill="none" />
        </svg>
      );
      break;

    case 'square':
      return (
        <svg width={size} height={size} viewBox="0 0 60 60">
          <rect x="5" y="5" width="50" height="50" stroke="currentColor" strokeWidth={strokeWidth} fill="none" />
        </svg>
      );
      break;

    case 'circle':
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" stroke="currentColor" strokeWidth={strokeWidth} fill="none" />
        </svg>
      );
      break;

    case 'diamond':
      return (
        <svg width={size} height={150} viewBox="0 0 100 150">
          <polygon points="50,10 90,75 50,140 10,75" fill="none" stroke="currentColor" stroke-width={6} />
        </svg>
      );
      break;

    case 'rectangle':
      return (
        <svg width="110" height="60" viewBox="0 0 110 60">
          <rect x="10" y="10" width="90" height="40" fill="none" stroke="currentColor" stroke-width={5} />
        </svg>
      );
      break;

    case 'octogon':
      return (
        <svg width="110" height="110" viewBox="0 0 100 100">
          <polygon points="30,10 70,10 90,30 90,70 70,90 30,90 10,70 10,30" fill="none" stroke="currentColor" stroke-width={5} />
        </svg>
      );
      break;
  }
};

export default Shape;
