const OFFSET_X = 10;
const OFFSET_Y = -12;

export function EpistleIcon() {
  return (
    <g transform={`translate(${OFFSET_X}, ${OFFSET_Y})`} style={{ pointerEvents: "none" }}>
      <rect x="-6" y="-5" width="12" height="10" rx="1" fill="var(--color-parchment-light)" stroke="var(--color-rust)" strokeWidth="0.8" />
      <line x1="-6" y1="-2" x2="6" y2="-2" stroke="var(--color-rust)" strokeWidth="0.4" />
      <line x1="-6" y1="0" x2="6" y2="0" stroke="var(--color-rust)" strokeWidth="0.4" />
      <line x1="-6" y1="2" x2="6" y2="2" stroke="var(--color-rust)" strokeWidth="0.4" />
      <circle cx="-6" cy="0" r="1.5" fill="var(--color-parchment-light)" stroke="var(--color-rust)" strokeWidth="0.8" />
      <circle cx="6" cy="0" r="1.5" fill="var(--color-parchment-light)" stroke="var(--color-rust)" strokeWidth="0.8" />
    </g>
  );
}
