type ActiveRouteProps = {
  d: string;
  playing: boolean;
  playT: number;
};

export function ActiveRoute({ d, playing, playT }: ActiveRouteProps) {
  const dashArray = playing ? `${playT} ${1.001 - playT}` : "6 3";

  return (
    <>
      <path d={d} fill="none" stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" opacity="0.25" />
      <path
        d={d}
        fill="none"
        stroke="var(--color-rust)"
        strokeWidth="1.8"
        strokeLinecap="round"
        pathLength="1"
        style={{ strokeDasharray: dashArray }}
      />
    </>
  );
}
