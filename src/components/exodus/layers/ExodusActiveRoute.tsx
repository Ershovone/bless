type ExodusActiveRouteProps = {
  d: string;
  color?: string;
};

export function ExodusActiveRoute({ d, color = "var(--color-rust)" }: ExodusActiveRouteProps) {
  return (
    <>
      <path
        d={d}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.25"
      />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeDasharray="6 3"
      />
    </>
  );
}
