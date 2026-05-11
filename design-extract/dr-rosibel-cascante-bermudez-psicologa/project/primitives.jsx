// Shared wireframe primitives.
// Components are pushed to window for cross-script use.

const Frame = ({ kind = 'phone', children, style }) => {
  const cls = kind === 'desktop' ? 'wf-desktop' : 'wf-phone';
  return <div className={cls} style={style}>{children}</div>;
};

// Mobile status bar + nav header
const PhoneChrome = ({ brand = 'rc.', menu = true, back = false, title }) => (
  <>
    <div className="wf-status">
      <span>9:41</span>
      <div className="right">
        <svg viewBox="0 0 16 16" fill="currentColor"><path d="M1 11h2v3H1zM5 8h2v6H5zM9 5h2v9H9zM13 2h2v12h-2z"/></svg>
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="5" width="11" height="6" rx="1.4"/><rect x="13" y="7" width="1.5" height="2"/></svg>
      </div>
    </div>
    <div className="wf-nav">
      {back ? (
        <div style={{display:'flex',alignItems:'center',gap:8,fontSize:13,color:'var(--ink-700)'}}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M10 3l-5 5 5 5"/></svg>
          {title || 'Atrás'}
        </div>
      ) : (
        <div className="brand"><span className="dot"></span><span>{brand}</span></div>
      )}
      {menu && (
        <div className="menu"><span></span><span></span><span></span></div>
      )}
    </div>
  </>
);

// Image placeholder
const Photo = ({ w, h, label = 'Foto', rounded = 0, style = {} }) => (
  <div className="wf-photo" style={{ width: w, height: h, borderRadius: rounded, ...style }}>
    <span>{label}</span>
  </div>
);

// Block of text lines that hint at body copy
const Lines = ({ n = 3, w = '100%', last = '60%', gap = 7 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap, width: w }}>
    {Array.from({ length: n }).map((_, i) => (
      <div key={i} className="wf-line" style={{ width: i === n - 1 ? last : '100%' }} />
    ))}
  </div>
);

const Stack = ({ gap = 16, children, style = {}, ...rest }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap, ...style }} {...rest}>{children}</div>
);
const Row = ({ gap = 8, align = 'center', justify = 'flex-start', children, style = {}, ...rest }) => (
  <div style={{ display: 'flex', flexDirection: 'row', gap, alignItems: align, justifyContent: justify, ...style }} {...rest}>{children}</div>
);
const Pad = ({ x = 24, y = 24, children, style = {} }) => (
  <div style={{ padding: `${y}px ${x}px`, ...style }}>{children}</div>
);

const Btn = ({ children, primary = true, ghost, small, block, icon, style = {} }) => {
  const cls = ['wf-btn'];
  if (ghost) cls.push('ghost');
  if (small) cls.push('small');
  if (block) cls.push('block');
  return (
    <button className={cls.join(' ')} style={style}>
      {children}
      {icon !== false && !ghost && (
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
      )}
    </button>
  );
};

const Pill = ({ children, warm, outline, dot }) => {
  const cls = ['wf-pill'];
  if (warm) cls.push('warm');
  if (outline) cls.push('outline');
  return (
    <span className={cls.join(' ')}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--sage-500)', display: 'inline-block' }} />}
      {children}
    </span>
  );
};

const Eyebrow = ({ children, style = {} }) => <div className="wf-eyebrow" style={style}>{children}</div>;
const H1 = ({ children, size = 32, style = {} }) => <h1 className="wf-h1" style={{ fontSize: size, ...style }}>{children}</h1>;
const H2 = ({ children, size = 24, style = {} }) => <h2 className="wf-h2" style={{ fontSize: size, ...style }}>{children}</h2>;
const H3 = ({ children, size = 17, style = {} }) => <h3 className="wf-h3" style={{ fontSize: size, ...style }}>{children}</h3>;
const Body = ({ children, size = 13, color = 'var(--ink-700)', style = {} }) => (
  <p style={{ fontFamily: 'var(--sans)', fontSize: size, lineHeight: 1.65, color, margin: 0, ...style }}>{children}</p>
);
const Meta = ({ children, style = {} }) => <span className="wf-meta" style={style}>{children}</span>;

const Section = ({ bg, children, pad = 24, padY, style = {} }) => (
  <div style={{
    background: bg || 'transparent',
    padding: padY !== undefined ? `${padY}px ${pad}px` : `${pad}px`,
    ...style
  }}>{children}</div>
);

// Section header label for the canvas (label inside artboard top)
const ArtboardLabel = ({ kind = 'A', title, note }) => (
  <div style={{
    position: 'absolute', top: 8, left: 8, zIndex: 5,
    display: 'flex', flexDirection: 'column', gap: 2,
    pointerEvents: 'none'
  }}>
    <div style={{ fontFamily: 'var(--sans)', fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', color: 'var(--ink-300)', textTransform: 'uppercase' }}>{kind}</div>
    {title && <div style={{ fontFamily: 'var(--serif)', fontSize: 11, color: 'var(--ink-700)' }}>{title}</div>}
    {note && <div style={{ fontFamily: 'var(--sans)', fontSize: 9, color: 'var(--ink-300)', maxWidth: 200 }}>{note}</div>}
  </div>
);

// Small icon set used through the wires
const Icon = ({ name, size = 14, color = 'currentColor' }) => {
  const paths = {
    arrow:    <path d="M3 8h10M9 4l4 4-4 4" />,
    back:     <path d="M10 3l-5 5 5 5" />,
    plus:     <path d="M8 3v10M3 8h10" />,
    check:    <path d="M3 8.5L6.5 12 13 4.5" />,
    cal:      <><rect x="2.5" y="3.5" width="11" height="10" rx="1.2"/><path d="M2.5 6.5h11M5.5 2v3M10.5 2v3"/></>,
    clock:    <><circle cx="8" cy="8" r="5.5"/><path d="M8 5v3l2 1.5"/></>,
    user:     <><circle cx="8" cy="6" r="2.5"/><path d="M3 13.5c.8-2.5 3-4 5-4s4.2 1.5 5 4"/></>,
    users:    <><circle cx="6" cy="6" r="2"/><circle cx="11" cy="7" r="1.6"/><path d="M2 13c.6-2 2.2-3 4-3s3.4 1 4 3M10 13c0-1.4.8-2.4 2.4-2.4S15 11.6 15 13"/></>,
    chat:     <path d="M3 4h10v6H7l-3 3v-3H3z" />,
    doc:      <><path d="M4 2h5l3 3v9H4z"/><path d="M9 2v3h3"/><path d="M6 9h4M6 11h3"/></>,
    bell:     <><path d="M4 11h8l-1-2V7a3 3 0 10-6 0v2L4 11z"/><path d="M6.5 13a1.5 1.5 0 003 0"/></>,
    home:     <path d="M3 8l5-4 5 4v5H3z"/>,
    cog:      <><circle cx="8" cy="8" r="2"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5L13 13M3 13l1.5-1.5M11.5 4.5L13 3"/></>,
    pin:      <><path d="M8 1.5L4 6h2v6.5L8 14.5l2-2V6h2z"/></>,
    search:   <><circle cx="7" cy="7" r="4"/><path d="M10 10l3 3"/></>,
    leaf:     <path d="M3 13c0-5 4-9 10-10-1 6-5 10-10 10z M6 10l4-4" />,
    heart:    <path d="M8 13s-5-3-5-7a2.5 2.5 0 015-1 2.5 2.5 0 015 1c0 4-5 7-5 7z" />,
    bookmark: <path d="M4 2h8v12l-4-3-4 3z" />,
    star:     <path d="M8 2l1.8 3.7 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6z" />,
    play:     <path d="M5 3l8 5-8 5z" />,
    pencil:   <><path d="M11 2.5l2.5 2.5L5 13.5H2.5V11z"/></>,
    trash:    <><path d="M3.5 4.5h9M6 4.5V3h4v1.5M5 4.5l.5 9h5l.5-9"/></>,
    eye:      <><path d="M1.5 8s2.5-4.5 6.5-4.5S14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8z"/><circle cx="8" cy="8" r="1.8"/></>,
    money:    <><rect x="2" y="4" width="12" height="8" rx="1"/><circle cx="8" cy="8" r="1.8"/></>,
    location: <><path d="M8 14s5-4.5 5-8.5a5 5 0 10-10 0c0 4 5 8.5 5 8.5z"/><circle cx="8" cy="5.5" r="1.8"/></>,
    mail:     <><rect x="2" y="3.5" width="12" height="9" rx="1"/><path d="M2.5 4.5L8 9l5.5-4.5"/></>,
    phone:    <path d="M3 4c0 5 4 9 9 9l1.5-2.5-3-1.5-1 1c-1.5-.5-3-2-3.5-3.5l1-1L5.5 2.5z"/>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
};

// Mini calendar component used in booking + admin
const MiniCal = ({ month = 'Mayo 2026', sel = 14, avail = [12, 13, 14, 15, 19, 20, 21, 26, 27, 28], small }) => {
  const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  // 31-day month starting on a Friday for example
  const start = 4; // offset
  const total = 31;
  const cells = [];
  for (let i = 0; i < start; i++) cells.push(<div className="cell muted" key={'p' + i}></div>);
  for (let d = 1; d <= total; d++) {
    let cls = 'cell';
    if (!avail.includes(d) && d > 10) cls += ' muted';
    if (avail.includes(d)) cls += ' avail';
    if (d === sel) cls = 'cell sel';
    cells.push(<div className={cls} key={d}>{d}</div>);
  }
  return (
    <div>
      <Row justify="space-between" style={{ marginBottom: 10 }}>
        <button style={{ background: 'transparent', border: 0, padding: 4, cursor: 'pointer', color: 'var(--ink-500)' }}><Icon name="back"/></button>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 14, color: 'var(--ink-900)' }}>{month}</div>
        <button style={{ background: 'transparent', border: 0, padding: 4, cursor: 'pointer', color: 'var(--ink-500)', transform: 'rotate(180deg)' }}><Icon name="back"/></button>
      </Row>
      <div className="wf-cal-head">{days.map((d, i) => <span key={i}>{d}</span>)}</div>
      <div className="wf-cal-grid" style={{ fontSize: small ? 10 : 11 }}>{cells}</div>
    </div>
  );
};

Object.assign(window, {
  Frame, PhoneChrome, Photo, Lines, Stack, Row, Pad, Btn, Pill,
  Eyebrow, H1, H2, H3, Body, Meta, Section, ArtboardLabel, Icon, MiniCal,
});
