import type { ReactElement } from 'react';

/**
 * Theme-aware inline-SVG figure library. Neutral strokes/text use
 * `currentColor` (inherited from the wrapping figure, so they flip in dark
 * mode); data uses fixed accent colours chosen to read on both themes.
 */

const BRAND = '#6366f1';
const EMER = '#10b981';
const ROSE = '#f43f5e';
const AMBER = '#f59e0b';
const VIOLET = '#8b5cf6';
const SKY = '#0ea5e9';

// ---- plot helpers ---------------------------------------------------------
const PW = 360;
const PH = 220;
const L = 44;
const Rt = 344;
const T = 18;
const B = 188;

function sx(x: number, xmin: number, xmax: number): number {
  return L + ((x - xmin) / (xmax - xmin)) * (Rt - L);
}
function sy(y: number, ymin: number, ymax: number): number {
  return B - ((y - ymin) / (ymax - ymin)) * (B - T);
}
function plotPath(
  fn: (x: number) => number,
  xmin: number,
  xmax: number,
  ymin: number,
  ymax: number,
  n = 80,
): string {
  let d = '';
  for (let i = 0; i <= n; i++) {
    const x = xmin + ((xmax - xmin) * i) / n;
    const px = sx(x, xmin, xmax);
    const py = sy(Math.max(ymin, Math.min(ymax, fn(x))), ymin, ymax);
    d += `${i === 0 ? 'M' : 'L'}${px.toFixed(1)} ${py.toFixed(1)} `;
  }
  return d.trim();
}

function Axes({
  xmin,
  xmax,
  ymin,
  ymax,
  xlabel,
  ylabel,
}: {
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
  xlabel?: string;
  ylabel?: string;
}) {
  const y0 = ymin <= 0 && ymax >= 0 ? sy(0, ymin, ymax) : B;
  const x0 = xmin <= 0 && xmax >= 0 ? sx(0, xmin, xmax) : L;
  return (
    <g stroke="currentColor" strokeOpacity={0.35} strokeWidth={1}>
      <line x1={L} y1={y0} x2={Rt} y2={y0} />
      <line x1={x0} y1={T} x2={x0} y2={B} />
      {xlabel && (
        <text x={Rt} y={y0 - 6} fontSize={11} textAnchor="end" fill="currentColor" stroke="none" fillOpacity={0.7}>
          {xlabel}
        </text>
      )}
      {ylabel && (
        <text x={x0 + 6} y={T + 10} fontSize={11} fill="currentColor" stroke="none" fillOpacity={0.7}>
          {ylabel}
        </text>
      )}
    </g>
  );
}

function Svg({ children, vb = `0 0 ${PW} ${PH}` }: { children: React.ReactNode; vb?: string }) {
  return (
    <svg viewBox={vb} className="mx-auto block h-auto w-full max-w-lg" role="img">
      <defs>
        <marker id="ah" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0 0 L6 3 L0 6 Z" fill="currentColor" fillOpacity={0.6} />
        </marker>
        <marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0 0 L6 3 L0 6 Z" fill="#f43f5e" />
        </marker>
      </defs>
      {children}
    </svg>
  );
}

// ---- the figures ----------------------------------------------------------
const FIGURES: Record<string, () => ReactElement> = {
  neuron: () => (
    <Svg vb="0 0 380 220">
      <g fontSize={12} fill="currentColor">
        {/* inputs */}
        {[
          { y: 50, l: 'x₁', w: 'w₁' },
          { y: 110, l: 'x₂', w: 'w₂' },
          { y: 170, l: 'x₃', w: 'w₃' },
        ].map((n, i) => (
          <g key={i}>
            <circle cx={40} cy={n.y} r={16} fill="none" stroke={SKY} strokeWidth={2} />
            <text x={40} y={n.y + 4} textAnchor="middle">{n.l}</text>
            <line x1={56} y1={n.y} x2={168} y2={110} stroke="currentColor" strokeOpacity={0.5} />
            <text x={104} y={(n.y + 110) / 2 - 4} textAnchor="middle" fill={BRAND} fontSize={11}>
              {n.w}
            </text>
          </g>
        ))}
        {/* sum node */}
        <circle cx={192} cy={110} r={24} fill={BRAND} fillOpacity={0.12} stroke={BRAND} strokeWidth={2} />
        <text x={192} y={106} textAnchor="middle" fontSize={16}>Σ</text>
        <text x={192} y={122} textAnchor="middle" fontSize={10} fillOpacity={0.75}>+ b</text>
        {/* z arrow */}
        <line x1={216} y1={110} x2={262} y2={110} stroke="currentColor" strokeOpacity={0.6} markerEnd="url(#ah)" />
        <text x={239} y={102} textAnchor="middle" fontSize={11} fill={VIOLET}>z</text>
        {/* activation node */}
        <circle cx={286} cy={110} r={24} fill={VIOLET} fillOpacity={0.12} stroke={VIOLET} strokeWidth={2} />
        <text x={286} y={115} textAnchor="middle" fontSize={16}>φ</text>
        {/* output */}
        <line x1={310} y1={110} x2={352} y2={110} stroke="currentColor" strokeOpacity={0.6} markerEnd="url(#ah)" />
        <text x={366} y={114} textAnchor="middle" fontSize={13} fill={EMER}>a</text>
        <text x={340} y={102} textAnchor="middle" fontSize={10} fillOpacity={0.7}>= φ(z)</text>
      </g>    </Svg>
  ),

  'mlp-2-2-1': () => (
    <Svg vb="0 0 360 220">
      <g>
        {(() => {
          const inp = [{ x: 50, y: 70, l: 'x₁' }, { x: 50, y: 150, l: 'x₂' }];
          const hid = [{ x: 180, y: 70, l: 'h₁' }, { x: 180, y: 150, l: 'h₂' }];
          const out = [{ x: 310, y: 110, l: 'o' }];
          const edges: ReactElement[] = [];
          inp.forEach((a, i) =>
            hid.forEach((b, j) =>
              edges.push(
                <line key={`ih${i}${j}`} x1={a.x + 18} y1={a.y} x2={b.x - 18} y2={b.y} stroke="currentColor" strokeOpacity={0.35} />,
              ),
            ),
          );
          hid.forEach((b, j) =>
            out.forEach((c, k) =>
              edges.push(
                <line key={`ho${j}${k}`} x1={b.x + 18} y1={b.y} x2={c.x - 18} y2={c.y} stroke={BRAND} strokeOpacity={0.6} />,
              ),
            ),
          );
          const node = (n: { x: number; y: number; l: string }, color: string, key: string) => (
            <g key={key} fontSize={12} fill="currentColor">
              <circle cx={n.x} cy={n.y} r={18} fill={color} fillOpacity={0.12} stroke={color} strokeWidth={2} />
              <text x={n.x} y={n.y + 4} textAnchor="middle">{n.l}</text>
            </g>
          );
          return (
            <>
              {edges}
              {inp.map((n, i) => node(n, SKY, `i${i}`))}
              {hid.map((n, i) => node(n, VIOLET, `h${i}`))}
              {out.map((n, i) => node(n, EMER, `o${i}`))}
              <text x={50} y={200} textAnchor="middle" fontSize={11} fill="currentColor" fillOpacity={0.7}>Input</text>
              <text x={180} y={200} textAnchor="middle" fontSize={11} fill="currentColor" fillOpacity={0.7}>Hidden</text>
              <text x={310} y={200} textAnchor="middle" fontSize={11} fill="currentColor" fillOpacity={0.7}>Output</text>
            </>
          );
        })()}
      </g>
    </Svg>
  ),

  sigmoid: () => {
    const f = (z: number) => 1 / (1 + Math.exp(-z));
    return (
      <Svg>
        <Axes xmin={-6} xmax={6} ymin={0} ymax={1} xlabel="z" ylabel="σ(z)" />
        <line x1={L} y1={sy(1, 0, 1)} x2={Rt} y2={sy(1, 0, 1)} stroke="currentColor" strokeOpacity={0.15} strokeDasharray="4 4" />
        <line x1={L} y1={sy(0.5, 0, 1)} x2={Rt} y2={sy(0.5, 0, 1)} stroke="currentColor" strokeOpacity={0.15} strokeDasharray="4 4" />
        <path d={plotPath(f, -6, 6, 0, 1)} fill="none" stroke={BRAND} strokeWidth={2.5} />
        <text x={Rt - 4} y={sy(1, 0, 1) - 4} fontSize={10} textAnchor="end" fill="currentColor" fillOpacity={0.6}>1</text>
      </Svg>
    );
  },

  tanh: () => (
    <Svg>
      <Axes xmin={-6} xmax={6} ymin={-1} ymax={1} xlabel="z" ylabel="tanh(z)" />
      <path d={plotPath((z) => Math.tanh(z), -6, 6, -1, 1)} fill="none" stroke={VIOLET} strokeWidth={2.5} />
    </Svg>
  ),

  relu: () => (
    <Svg>
      <Axes xmin={-4} xmax={4} ymin={-0.5} ymax={4} xlabel="z" ylabel="ReLU(z)" />
      <path d={plotPath((z) => Math.max(0, z), -4, 4, -0.5, 4)} fill="none" stroke={EMER} strokeWidth={2.5} />
    </Svg>
  ),

  'sigmoid-derivative': () => {
    const s = (z: number) => 1 / (1 + Math.exp(-z));
    return (
      <Svg>
        <Axes xmin={-6} xmax={6} ymin={0} ymax={1} xlabel="z" />
        <path d={plotPath(s, -6, 6, 0, 1)} fill="none" stroke={BRAND} strokeWidth={2.5} />
        <path d={plotPath((z) => s(z) * (1 - s(z)), -6, 6, 0, 1)} fill="none" stroke={ROSE} strokeWidth={2.5} />
        <g fontSize={11}>
          <text x={Rt - 6} y={sy(0.95, 0, 1)} textAnchor="end" fill={BRAND}>σ(z)</text>
          <text x={sx(0, -6, 6) + 8} y={sy(0.28, 0, 1)} fill={ROSE}>σ′(z)</text>
          <text x={sx(0, -6, 6) + 8} y={sy(0.25, 0, 1) + 12} fill="currentColor" fillOpacity={0.6}>max 0.25</text>
        </g>
      </Svg>
    );
  },

  'gradient-descent': () => {
    const f = (w: number) => 0.12 * (w - 3) * (w - 3) + 0.3;
    const steps = [-2.4, -0.9, 0.2, 1.05, 1.7, 2.2];
    return (
      <Svg>
        <Axes xmin={-3} xmax={9} ymin={0} ymax={4} xlabel="w" ylabel="E(w)" />
        <path d={plotPath(f, -3, 9, 0, 4)} fill="none" stroke={BRAND} strokeWidth={2.5} />
        {steps.map((w, i) => (
          <g key={i}>
            <circle cx={sx(w, -3, 9)} cy={sy(f(w), 0, 4)} r={4} fill={AMBER} />
            {i > 0 && (
              <line
                x1={sx(steps[i - 1]!, -3, 9)}
                y1={sy(f(steps[i - 1]!), 0, 4)}
                x2={sx(w, -3, 9)}
                y2={sy(f(w), 0, 4)}
                stroke={AMBER}
                strokeOpacity={0.6}
                strokeDasharray="3 3"
              />
            )}
          </g>
        ))}
        <circle cx={sx(3, -3, 9)} cy={sy(f(3), 0, 4)} r={5} fill="none" stroke={EMER} strokeWidth={2} />
        <text x={sx(3, -3, 9)} y={sy(f(3), 0, 4) + 20} textAnchor="middle" fontSize={11} fill={EMER}>minimum</text>
      </Svg>
    );
  },

  'backprop-flow': () => (
    <Svg vb="0 0 360 200">
      <g fontSize={12} fill="currentColor">
        {/* forward */}
        <text x={20} y={20} fontSize={11} fill={SKY}>forward →</text>
        <text x={340} y={190} fontSize={11} textAnchor="end" fill={ROSE}>← backward error</text>
        {[
          { x: 60, y: 100, l: 'x', c: SKY },
          { x: 160, y: 60, l: 'h₁', c: VIOLET },
          { x: 160, y: 140, l: 'h₂', c: VIOLET },
          { x: 280, y: 100, l: 'o', c: EMER },
        ].map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={18} fill={n.c} fillOpacity={0.12} stroke={n.c} strokeWidth={2} />
            <text x={n.x} y={n.y + 4} textAnchor="middle">{n.l}</text>
          </g>
        ))}
        {/* forward edges */}
        <line x1={78} y1={100} x2={142} y2={64} stroke={SKY} strokeOpacity={0.5} />
        <line x1={78} y1={100} x2={142} y2={136} stroke={SKY} strokeOpacity={0.5} />
        <line x1={178} y1={60} x2={262} y2={96} stroke={SKY} strokeOpacity={0.5} />
        <line x1={178} y1={140} x2={262} y2={104} stroke={SKY} strokeOpacity={0.5} />
        {/* backward dashed */}
        <line x1={262} y1={108} x2={178} y2={72} stroke={ROSE} strokeOpacity={0.7} strokeDasharray="4 3" markerEnd="url(#ar)" />
        <line x1={262} y1={112} x2={178} y2={148} stroke={ROSE} strokeOpacity={0.7} strokeDasharray="4 3" markerEnd="url(#ar)" />
        <text x={225} y={58} fontSize={11} fill={ROSE}>δₒ w₅</text>
        <text x={220} y={162} fontSize={11} fill={ROSE}>δₒ w₆</text>
      </g>    </Svg>
  ),

  'linear-fit': () => {
    const pts = [
      [1, 1],
      [2, 3],
      [3, 2],
      [4, 5],
      [5, 4],
    ];
    const line = (x: number) => 0.6 + 0.8 * x;
    return (
      <Svg>
        <Axes xmin={0} xmax={6} ymin={0} ymax={6} xlabel="x" ylabel="y" />
        <path d={`M${sx(0, 0, 6)} ${sy(line(0), 0, 6)} L${sx(6, 0, 6)} ${sy(line(6), 0, 6)}`} stroke={BRAND} strokeWidth={2.5} />
        {pts.map(([x, y], i) => (
          <g key={i}>
            <line x1={sx(x!, 0, 6)} y1={sy(y!, 0, 6)} x2={sx(x!, 0, 6)} y2={sy(line(x!), 0, 6)} stroke={ROSE} strokeOpacity={0.5} strokeDasharray="3 2" />
            <circle cx={sx(x!, 0, 6)} cy={sy(y!, 0, 6)} r={4.5} fill={EMER} />
          </g>
        ))}
        <text x={sx(4.5, 0, 6)} y={sy(line(4.5), 0, 6) - 8} fontSize={11} fill={BRAND}>ŷ = 0.6 + 0.8x</text>
        <text x={sx(4, 0, 6) + 6} y={sy(4.4, 0, 6)} fontSize={10} fill={ROSE} fillOpacity={0.8}>residual</text>
      </Svg>
    );
  },

  knn: () => (
    <Svg vb="0 0 300 240">
      <g>
        {[
          [60, 60],
          [90, 100],
          [70, 150],
          [120, 70],
        ].map(([x, y], i) => (
          <circle key={`a${i}`} cx={x} cy={y} r={7} fill={BRAND} />
        ))}
        {[
          [210, 80],
          [240, 130],
          [200, 170],
          [170, 200],
        ].map(([x, y], i) => (
          <rect key={`b${i}`} x={(x as number) - 6} y={(y as number) - 6} width={12} height={12} fill={AMBER} />
        ))}
        {/* query */}
        <g>
          <circle cx={150} cy={130} r={62} fill="none" stroke="currentColor" strokeOpacity={0.3} strokeDasharray="4 4" />
          <path d="M143 130 L157 130 M150 123 L150 137" stroke={ROSE} strokeWidth={2.5} />
          <text x={150} y={210} textAnchor="middle" fontSize={11} fill={ROSE}>query</text>
        </g>
        {/* nearest links */}
        {[
          [120, 70],
          [90, 100],
          [210, 80],
        ].map(([x, y], i) => (
          <line key={`l${i}`} x1={150} y1={130} x2={x} y2={y} stroke="currentColor" strokeOpacity={0.4} />
        ))}
        <text x={40} y={30} fontSize={11} fill={BRAND}>● class A</text>
        <text x={200} y={30} fontSize={11} fill={AMBER}>■ class B</text>
        <text x={150} y={30} textAnchor="middle" fontSize={11} fill="currentColor" fillOpacity={0.7}>k = 3</text>
      </g>
    </Svg>
  ),

  'bias-variance': () => {
    const bias = (c: number) => 3.2 * Math.exp(-0.5 * c) + 0.2;
    const varc = (c: number) => 0.15 * Math.exp(0.55 * c);
    const tot = (c: number) => bias(c) + varc(c);
    return (
      <Svg>
        <Axes xmin={0} xmax={6} ymin={0} ymax={4} xlabel="complexity" ylabel="error" />
        <path d={plotPath(bias, 0, 6, 0, 4)} fill="none" stroke={SKY} strokeWidth={2} strokeDasharray="5 3" />
        <path d={plotPath(varc, 0, 6, 0, 4)} fill="none" stroke={AMBER} strokeWidth={2} strokeDasharray="5 3" />
        <path d={plotPath(tot, 0, 6, 0, 4)} fill="none" stroke={ROSE} strokeWidth={2.5} />
        {(() => {
          let best = 0;
          for (let c = 0; c <= 6; c += 0.05) if (tot(c) < tot(best)) best = c;
          return <circle cx={sx(best, 0, 6)} cy={sy(tot(best), 0, 4)} r={5} fill="none" stroke={EMER} strokeWidth={2} />;
        })()}
        <g fontSize={11}>
          <text x={sx(4.4, 0, 6)} y={sy(bias(4.4), 0, 4) + 14} fill={SKY}>bias²</text>
          <text x={sx(5, 0, 6)} y={sy(varc(5), 0, 4) - 6} fill={AMBER}>variance</text>
          <text x={sx(1.4, 0, 6)} y={sy(tot(1.4), 0, 4) - 8} fill={ROSE}>total</text>
        </g>
      </Svg>
    );
  },

  'fit-trio': () => {
    const panels = [
      { title: 'Underfit', fn: (x: number) => 0.5 * x + 0.6, color: SKY },
      { title: 'Good fit', fn: (x: number) => 0.35 * x + 0.9 + 0.25 * Math.sin(x * 1.1), color: EMER },
      { title: 'Overfit', fn: (x: number) => 0.9 + 1.3 * Math.sin(x * 1.9) * Math.exp(-0.02 * x), color: ROSE },
    ];
    const pts = [
      [0.5, 1.2],
      [1.3, 1.1],
      [2.1, 2.1],
      [2.9, 1.9],
      [3.6, 2.6],
      [4.4, 2.3],
      [5.2, 3.1],
    ];
    return (
      <Svg vb="0 0 560 200">
        {panels.map((p, pi) => {
          const ox = pi * 190;
          const px = (x: number) => ox + 24 + (x / 6) * 150;
          const py = (y: number) => 160 - (y / 3.4) * 130;
          let d = '';
          for (let i = 0; i <= 60; i++) {
            const x = (6 * i) / 60;
            d += `${i === 0 ? 'M' : 'L'}${px(x).toFixed(1)} ${py(Math.max(0, Math.min(3.4, p.fn(x)))).toFixed(1)} `;
          }
          return (
            <g key={pi}>
              <text x={ox + 95} y={22} textAnchor="middle" fontSize={12} fill="currentColor">{p.title}</text>
              <line x1={ox + 24} y1={160} x2={ox + 174} y2={160} stroke="currentColor" strokeOpacity={0.3} />
              <line x1={ox + 24} y1={30} x2={ox + 24} y2={160} stroke="currentColor" strokeOpacity={0.3} />
              <path d={d} fill="none" stroke={p.color} strokeWidth={2.5} />
              {pts.map(([x, y], i) => (
                <circle key={i} cx={px(x!)} cy={py(y!)} r={3.5} fill="currentColor" fillOpacity={0.65} />
              ))}
            </g>
          );
        })}
      </Svg>
    );
  },

  kmeans: () => (
    <Svg vb="0 0 320 240">
      {(() => {
        const clusters = [
          { c: [70, 80], col: BRAND, pts: [[55, 65], [85, 70], [60, 95], [90, 95], [72, 82]] },
          { c: [230, 70], col: EMER, pts: [[215, 55], [245, 60], [220, 90], [248, 85]] },
          { c: [160, 180], col: AMBER, pts: [[145, 165], [175, 168], [150, 198], [180, 195], [162, 182]] },
        ];
        return clusters.map((cl, i) => (
          <g key={i}>
            {cl.pts.map(([x, y], j) => (
              <g key={j}>
                <line x1={x} y1={y} x2={cl.c[0]} y2={cl.c[1]} stroke={cl.col} strokeOpacity={0.3} />
                <circle cx={x} cy={y} r={5} fill={cl.col} fillOpacity={0.75} />
              </g>
            ))}
            <path
              d={`M${cl.c[0]! - 7} ${cl.c[1]} L${cl.c[0]} ${cl.c[1]! - 7} L${cl.c[0]! + 7} ${cl.c[1]} L${cl.c[0]} ${cl.c[1]! + 7} Z`}
              fill={cl.col}
              stroke="currentColor"
              strokeWidth={1}
            />
          </g>
        ));
      })()}
      <text x={160} y={228} textAnchor="middle" fontSize={11} fill="currentColor" fillOpacity={0.7}>◆ centroids · k = 3</text>
    </Svg>
  ),

  'confusion-matrix': () => (
    <Svg vb="0 0 320 240">
      <g fontSize={12} fill="currentColor">
        {[
          { x: 120, y: 70, l: 'TP', c: EMER, sub: 'true +' },
          { x: 220, y: 70, l: 'FN', c: ROSE, sub: 'false −' },
          { x: 120, y: 170, l: 'FP', c: ROSE, sub: 'false +' },
          { x: 220, y: 170, l: 'TN', c: EMER, sub: 'true −' },
        ].map((c, i) => (
          <g key={i}>
            <rect x={c.x - 45} y={c.y - 35} width={90} height={70} rx={8} fill={c.c} fillOpacity={0.14} stroke={c.c} strokeWidth={1.5} />
            <text x={c.x} y={c.y} textAnchor="middle" fontSize={18} fontWeight="bold">{c.l}</text>
            <text x={c.x} y={c.y + 20} textAnchor="middle" fontSize={10} fillOpacity={0.7}>{c.sub}</text>
          </g>
        ))}
        <text x={120} y={30} textAnchor="middle" fontSize={11} fillOpacity={0.7}>Pred +</text>
        <text x={220} y={30} textAnchor="middle" fontSize={11} fillOpacity={0.7}>Pred −</text>
        <text x={50} y={70} textAnchor="middle" fontSize={11} fillOpacity={0.7} transform="rotate(-90 50 70)">Actual +</text>
        <text x={50} y={170} textAnchor="middle" fontSize={11} fillOpacity={0.7} transform="rotate(-90 50 170)">Actual −</text>
      </g>
    </Svg>
  ),

  'linearly-separable': () => (
    <Svg vb="0 0 300 240">
      <line x1={40} y1={210} x2={260} y2={40} stroke={BRAND} strokeWidth={2.5} />
      {[
        [70, 70],
        [100, 60],
        [80, 110],
        [120, 90],
      ].map(([x, y], i) => (
        <circle key={`a${i}`} cx={x} cy={y} r={7} fill={SKY} />
      ))}
      {[
        [200, 190],
        [170, 170],
        [220, 150],
        [190, 210],
      ].map(([x, y], i) => (
        <rect key={`b${i}`} x={(x as number) - 6} y={(y as number) - 6} width={12} height={12} fill={AMBER} />
      ))}
      <text x={150} y={30} textAnchor="middle" fontSize={11} fill={BRAND}>wᵀx + b = 0</text>
    </Svg>
  ),

  xor: () => (
    <Svg vb="0 0 240 240">
      <Axes xmin={-0.3} xmax={1.3} ymin={-0.3} ymax={1.3} xlabel="x₁" ylabel="x₂" />
      {[
        { p: [0, 0], cls: 0 },
        { p: [1, 1], cls: 0 },
        { p: [0, 1], cls: 1 },
        { p: [1, 0], cls: 1 },
      ].map((n, i) => {
        const cx = sx(n.p[0]!, -0.3, 1.3);
        const cy = sy(n.p[1]!, -0.3, 1.3);
        return n.cls === 1 ? (
          <circle key={i} cx={cx} cy={cy} r={8} fill={EMER} />
        ) : (
          <rect key={i} x={cx - 7} y={cy - 7} width={14} height={14} fill={ROSE} />
        );
      })}
      <text x={PW / 2 - 60} y={210} textAnchor="middle" fontSize={11} fill="currentColor" fillOpacity={0.7}>
        no single line separates ● from ■
      </text>
    </Svg>
  ),

  'distance-measures': () => (
    <Svg vb="0 0 300 220">
      <Axes xmin={0} xmax={6} ymin={0} ymax={6} xlabel="x₁" ylabel="x₂" />
      {(() => {
        const a = [1, 2];
        const b = [4, 6];
        const ax = sx(a[0]!, 0, 6);
        const ay = sy(a[1]!, 0, 6);
        const bx = sx(b[0]!, 0, 6);
        const by = sy(b[1]!, 0, 6);
        return (
          <>
            <line x1={ax} y1={ay} x2={bx} y2={by} stroke={BRAND} strokeWidth={2.5} />
            <line x1={ax} y1={ay} x2={bx} y2={ay} stroke={AMBER} strokeWidth={2} strokeDasharray="4 3" />
            <line x1={bx} y1={ay} x2={bx} y2={by} stroke={AMBER} strokeWidth={2} strokeDasharray="4 3" />
            <circle cx={ax} cy={ay} r={5} fill={EMER} />
            <circle cx={bx} cy={by} r={5} fill={EMER} />
            <text x={(ax + bx) / 2 - 14} y={(ay + by) / 2} fontSize={11} fill={BRAND}>Euclidean</text>
            <text x={(ax + bx) / 2} y={ay - 6} fontSize={11} fill={AMBER} textAnchor="middle">Manhattan</text>
          </>
        );
      })()}
    </Svg>
  ),

  pca: () => (
    <Svg vb="0 0 300 240">
      {(() => {
        const cxc = 150;
        const cyc = 120;
        const pts: [number, number][] = [];
        for (let i = 0; i < 26; i++) {
          const t = (i / 25) * 2 - 1;
          const jitter = (Math.sin(i * 12.9) * 43758.5) % 1;
          const px = cxc + t * 90 + jitter * 18;
          const py = cyc + t * 50 - jitter * 16;
          pts.push([px, py]);
        }
        return (
          <>
            {pts.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={3.5} fill={BRAND} fillOpacity={0.6} />
            ))}
            <line x1={cxc - 95} y1={cyc - 53} x2={cxc + 95} y2={cyc + 53} stroke={ROSE} strokeWidth={2.5} markerEnd="url(#ar)" />
            <line x1={cxc + 34} y1={cyc - 61} x2={cxc - 34} y2={cyc + 61} stroke={EMER} strokeWidth={2} markerEnd="url(#ar)" />
            <text x={cxc + 100} y={cyc + 60} fontSize={11} fill={ROSE}>PC1</text>
            <text x={cxc - 52} y={cyc + 66} fontSize={11} fill={EMER}>PC2</text>
          </>
        );
      })()}
    </Svg>
  ),

  'ml-taxonomy': () => (
    <Svg vb="0 0 380 210">
      <g fontSize={12} fill="currentColor">
        <rect x={140} y={10} width={100} height={34} rx={8} fill={BRAND} fillOpacity={0.14} stroke={BRAND} strokeWidth={1.5} />
        <text x={190} y={32} textAnchor="middle">Machine Learning</text>
        {[
          { x: 60, l: 'Supervised', s: 'labelled (x, y)', c: EMER },
          { x: 190, l: 'Unsupervised', s: 'x only', c: AMBER },
          { x: 320, l: 'Reinforcement', s: 'rewards', c: VIOLET },
        ].map((n, i) => (
          <g key={i}>
            <line x1={190} y1={44} x2={n.x} y2={90} stroke="currentColor" strokeOpacity={0.35} />
            <rect x={n.x - 58} y={92} width={116} height={40} rx={8} fill={n.c} fillOpacity={0.12} stroke={n.c} strokeWidth={1.5} />
            <text x={n.x} y={112} textAnchor="middle" fontSize={12}>{n.l}</text>
            <text x={n.x} y={126} textAnchor="middle" fontSize={9} fillOpacity={0.7}>{n.s}</text>
          </g>
        ))}
        <text x={60} y={158} textAnchor="middle" fontSize={9} fillOpacity={0.7}>classification</text>
        <text x={60} y={170} textAnchor="middle" fontSize={9} fillOpacity={0.7}>· regression</text>
        <text x={190} y={158} textAnchor="middle" fontSize={9} fillOpacity={0.7}>clustering · PCA</text>
        <text x={190} y={170} textAnchor="middle" fontSize={9} fillOpacity={0.7}>· association</text>
        <text x={320} y={158} textAnchor="middle" fontSize={9} fillOpacity={0.7}>agent · policy</text>
      </g>
    </Svg>
  ),

  'ml-pipeline': () => (
    <Svg vb="0 0 560 120">
      <g fontSize={11} fill="currentColor">
        {['Frame', 'Collect', 'Prepare', 'Train', 'Evaluate', 'Tune', 'Deploy'].map((s, i) => {
          const x = 20 + i * 78;
          return (
            <g key={i}>
              <rect x={x} y={40} width={64} height={38} rx={8} fill={BRAND} fillOpacity={0.1 + (i % 2) * 0.06} stroke={BRAND} strokeWidth={1.4} />
              <text x={x + 32} y={63} textAnchor="middle">{s}</text>
              {i < 6 && <line x1={x + 64} y1={59} x2={x + 78} y2={59} stroke="currentColor" strokeOpacity={0.5} markerEnd="url(#ah)" />}
            </g>
          );
        })}
        <path d="M52 78 C 52 104, 476 104, 476 80" fill="none" stroke="currentColor" strokeOpacity={0.3} strokeDasharray="4 3" markerEnd="url(#ah)" />
        <text x={280} y={116} textAnchor="middle" fontSize={10} fillOpacity={0.6}>iterate</text>
      </g>    </Svg>
  ),

  'bayes-terms': () => {
    const box = (
      x: number,
      y: number,
      w: number,
      title: string,
      formula: string,
      color: string,
    ) => (
      <g>
        <rect x={x} y={y} width={w} height={46} rx={9} fill={color} fillOpacity={0.12} stroke={color} strokeWidth={1.8} />
        <text x={x + w / 2} y={y + 19} textAnchor="middle" fontSize={11} fontWeight={600} fill={color}>{title}</text>
        <text x={x + w / 2} y={y + 36} textAnchor="middle" fontSize={12} fill="currentColor">{formula}</text>
      </g>
    );
    const op = (cx: number, cy: number, s: string) => (
      <g>
        <circle cx={cx} cy={cy} r={17} fill="none" stroke={ROSE} strokeWidth={1.8} />
        <text x={cx} y={cy + 5} textAnchor="middle" fontSize={15} fill={ROSE}>{s}</text>
      </g>
    );
    return (
      <Svg vb="0 0 520 250">
        {/* feed-in nodes */}
        {box(16, 30, 116, 'Prior', 'P(A)', EMER)}
        {box(16, 150, 116, 'Likelihood', 'P(B|A)', BRAND)}
        {box(250, 186, 130, 'Evidence', 'P(B)', AMBER)}
        {box(388, 88, 118, 'Posterior', 'P(A|B)', VIOLET)}
        {/* operators */}
        {op(210, 111, '×')}
        {op(310, 111, '÷')}
        {/* arrows */}
        <g stroke="currentColor" strokeOpacity={0.5} fill="none">
          <path d="M132 53 C 170 60, 175 95, 193 106" markerEnd="url(#ah)" />
          <path d="M132 173 C 170 166, 175 128, 193 116" markerEnd="url(#ah)" />
          <path d="M227 111 L 293 111" markerEnd="url(#ah)" />
          <path d="M315 186 L 311 130" markerEnd="url(#ah)" />
          <path d="M327 111 L 384 106" markerEnd="url(#ah)" />
        </g>
        <text x={260} y={97} textAnchor="middle" fontSize={10} fillOpacity={0.6}>combine</text>
        <text x={355} y={150} textAnchor="middle" fontSize={10} fillOpacity={0.6}>normalise</text>
        <text x={447} y={150} textAnchor="middle" fontSize={10} fill={VIOLET} fillOpacity={0.85}>updated belief</text>
      </Svg>
    );
  },

  'design-matrix': () => (
    <Svg vb="0 0 340 200">
      <g fontSize={12} fill="currentColor">
        <text x={40} y={30} fontSize={13}>X =</text>
        <line x1={78} y1={40} x2={78} y2={170} stroke="currentColor" strokeWidth={1.5} />
        <line x1={78} y1={40} x2={86} y2={40} stroke="currentColor" strokeWidth={1.5} />
        <line x1={78} y1={170} x2={86} y2={170} stroke="currentColor" strokeWidth={1.5} />
        <line x1={262} y1={40} x2={262} y2={170} stroke="currentColor" strokeWidth={1.5} />
        <line x1={254} y1={40} x2={262} y2={40} stroke="currentColor" strokeWidth={1.5} />
        <line x1={254} y1={170} x2={262} y2={170} stroke="currentColor" strokeWidth={1.5} />
        {/* highlighted row */}
        <rect x={82} y={92} width={176} height={26} fill={BRAND} fillOpacity={0.15} />
        {/* highlighted col */}
        <rect x={150} y={44} width={40} height={122} fill={EMER} fillOpacity={0.13} />
        {[0, 1, 2, 3].map((rIdx) =>
          ['x₁', 'x₂', '⋯', 'xₙ'].map((c, cIdx) => (
            <text key={`${rIdx}-${cIdx}`} x={100 + cIdx * 46} y={62 + rIdx * 30} textAnchor="middle" fontSize={12} fillOpacity={0.85}>
              {c}
              <tspan fontSize={8} dy={3}>{c === '⋯' ? '' : `(${rIdx + 1})`}</tspan>
            </text>
          )),
        )}
        <text x={300} y={108} fontSize={11} fill={BRAND}>row = instance</text>
        <text x={170} y={188} textAnchor="middle" fontSize={11} fill={EMER}>column = feature</text>
      </g>
    </Svg>
  ),
};

export function Diagram({ kind }: { kind: string }) {
  const fig = FIGURES[kind];
  if (!fig) return null;
  return <div className="text-[rgb(var(--text))]">{fig()}</div>;
}

export function hasDiagram(kind: string): boolean {
  return kind in FIGURES;
}

