// SupplyGuard AI Global Toast Utility using React Bits <SwipeToast />

export const showToast = ({
  title,
  description = '',
  icon,
  actionLabel = '',
  onAction,
  background,
  color,
  fuseColor,
  duration = 4500,
  type = 'info'
}) => {
  if (typeof window === 'undefined') return;

  // Curated theme defaults matching Root Beer (#280B0B), Champagne (#F9E7C9), and Fire Engine Red (#C92924)
  let defaultBg = '#280B0B';
  let defaultColor = '#F9E7C9';
  let defaultFuse = '#C92924';

  if (type === 'critical' || type === 'error') {
    defaultBg = '#3D0D0D';
    defaultColor = '#F9E7C9';
    defaultFuse = '#C92924';
  } else if (type === 'warning') {
    defaultBg = '#331A0C';
    defaultColor = '#F9E7C9';
    defaultFuse = '#f59e0b';
  } else if (type === 'success') {
    defaultBg = '#1B2610';
    defaultColor = '#F9E7C9';
    defaultFuse = '#48BB78';
  }

  window.dispatchEvent(
    new CustomEvent('supplyguard-toast', {
      detail: {
        id: 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
        title,
        description,
        icon,
        actionLabel,
        onAction,
        background: background || defaultBg,
        color: color || defaultColor,
        fuseColor: fuseColor || defaultFuse,
        duration,
        type
      }
    })
  );
};
