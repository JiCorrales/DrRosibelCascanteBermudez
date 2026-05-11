import React from 'react';
import Icon from './Icon.jsx';

export const Photo = ({
  w,
  h,
  label = 'Foto',
  rounded = 14,
  style = {},
  aspectRatio,
  src,
  alt,
  objectPosition = 'center top',
}) => {
  const baseStyle = {
    width: w ?? '100%',
    height: aspectRatio ? undefined : h,
    aspectRatio,
    borderRadius: rounded,
    ...style,
  };

  if (src) {
    return (
      <div
        style={{
          ...baseStyle,
          overflow: 'hidden',
          background: 'var(--bg-2)',
          border: '1px solid var(--line)',
        }}
      >
        <img
          src={src}
          alt={alt ?? label}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition,
            display: 'block',
          }}
        />
      </div>
    );
  }

  return (
    <div className="wf-photo" style={baseStyle}>
      <span>{label}</span>
    </div>
  );
};

export const Stack = ({ gap = 16, children, style = {}, as: Tag = 'div', ...rest }) => (
  <Tag style={{ display: 'flex', flexDirection: 'column', gap, ...style }} {...rest}>
    {children}
  </Tag>
);

export const Row = ({
  gap = 8,
  align = 'center',
  justify = 'flex-start',
  wrap = false,
  children,
  style = {},
  as: Tag = 'div',
  ...rest
}) => (
  <Tag
    style={{
      display: 'flex',
      flexDirection: 'row',
      flexWrap: wrap ? 'wrap' : 'nowrap',
      gap,
      alignItems: align,
      justifyContent: justify,
      ...style,
    }}
    {...rest}
  >
    {children}
  </Tag>
);

export const Btn = ({
  children,
  ghost,
  small,
  block,
  icon,
  style = {},
  onClick,
  type = 'button',
  disabled,
  as: Tag = 'button',
  ...rest
}) => {
  const cls = ['wf-btn'];
  if (ghost) cls.push('ghost');
  if (small) cls.push('small');
  if (block) cls.push('block');
  const props = Tag === 'button' ? { type, disabled } : {};
  return (
    <Tag className={cls.join(' ')} style={style} onClick={onClick} {...props} {...rest}>
      {children}
      {icon !== false && !ghost && (
        <svg
          width="12"
          height="12"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      )}
    </Tag>
  );
};

export const Pill = ({ children, warm, outline, dot }) => {
  const cls = ['wf-pill'];
  if (warm) cls.push('warm');
  if (outline) cls.push('outline');
  return (
    <span className={cls.join(' ')}>
      {dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: 999,
            background: 'var(--sage-500)',
            display: 'inline-block',
          }}
        />
      )}
      {children}
    </span>
  );
};

export const Eyebrow = ({ children, style = {} }) => (
  <div className="wf-eyebrow" style={style}>
    {children}
  </div>
);

export const H1 = ({ children, size, style = {} }) => (
  <h1 className="wf-h1" style={size ? { fontSize: size, ...style } : style}>
    {children}
  </h1>
);
export const H2 = ({ children, size, style = {} }) => (
  <h2 className="wf-h2" style={size ? { fontSize: size, ...style } : style}>
    {children}
  </h2>
);
export const H3 = ({ children, size, style = {} }) => (
  <h3 className="wf-h3" style={size ? { fontSize: size, ...style } : style}>
    {children}
  </h3>
);

export const Body = ({ children, size = 15, color = 'var(--ink-700)', style = {} }) => (
  <p
    style={{
      fontFamily: 'var(--sans)',
      fontSize: size,
      lineHeight: 1.65,
      color,
      margin: 0,
      ...style,
    }}
  >
    {children}
  </p>
);

export const Meta = ({ children, style = {} }) => (
  <span className="wf-meta" style={style}>
    {children}
  </span>
);

export { Icon };
