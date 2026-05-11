import React from 'react';

const PATHS = {
  arrow: <path d="M3 8h10M9 4l4 4-4 4" />,
  back: <path d="M10 3l-5 5 5 5" />,
  plus: <path d="M8 3v10M3 8h10" />,
  check: <path d="M3 8.5L6.5 12 13 4.5" />,
  cal: (
    <>
      <rect x="2.5" y="3.5" width="11" height="10" rx="1.2" />
      <path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" />
    </>
  ),
  clock: (
    <>
      <circle cx="8" cy="8" r="5.5" />
      <path d="M8 5v3l2 1.5" />
    </>
  ),
  user: (
    <>
      <circle cx="8" cy="6" r="2.5" />
      <path d="M3 13.5c.8-2.5 3-4 5-4s4.2 1.5 5 4" />
    </>
  ),
  users: (
    <>
      <circle cx="6" cy="6" r="2" />
      <circle cx="11" cy="7" r="1.6" />
      <path d="M2 13c.6-2 2.2-3 4-3s3.4 1 4 3M10 13c0-1.4.8-2.4 2.4-2.4S15 11.6 15 13" />
    </>
  ),
  chat: <path d="M3 4h10v6H7l-3 3v-3H3z" />,
  doc: (
    <>
      <path d="M4 2h5l3 3v9H4z" />
      <path d="M9 2v3h3" />
      <path d="M6 9h4M6 11h3" />
    </>
  ),
  bell: (
    <>
      <path d="M4 11h8l-1-2V7a3 3 0 10-6 0v2L4 11z" />
      <path d="M6.5 13a1.5 1.5 0 003 0" />
    </>
  ),
  home: <path d="M3 8l5-4 5 4v5H3z" />,
  cog: (
    <>
      <circle cx="8" cy="8" r="2" />
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5L13 13M3 13l1.5-1.5M11.5 4.5L13 3" />
    </>
  ),
  pin: <path d="M8 1.5L4 6h2v6.5L8 14.5l2-2V6h2z" />,
  search: (
    <>
      <circle cx="7" cy="7" r="4" />
      <path d="M10 10l3 3" />
    </>
  ),
  leaf: <path d="M3 13c0-5 4-9 10-10-1 6-5 10-10 10z M6 10l4-4" />,
  heart: <path d="M8 13s-5-3-5-7a2.5 2.5 0 015-1 2.5 2.5 0 015 1c0 4-5 7-5 7z" />,
  bookmark: <path d="M4 2h8v12l-4-3-4 3z" />,
  star: <path d="M8 2l1.8 3.7 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6z" />,
  play: <path d="M5 3l8 5-8 5z" />,
  pencil: <path d="M11 2.5l2.5 2.5L5 13.5H2.5V11z" />,
  trash: <path d="M3.5 4.5h9M6 4.5V3h4v1.5M5 4.5l.5 9h5l.5-9" />,
  eye: (
    <>
      <path d="M1.5 8s2.5-4.5 6.5-4.5S14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8z" />
      <circle cx="8" cy="8" r="1.8" />
    </>
  ),
  money: (
    <>
      <rect x="2" y="4" width="12" height="8" rx="1" />
      <circle cx="8" cy="8" r="1.8" />
    </>
  ),
  location: (
    <>
      <path d="M8 14s5-4.5 5-8.5a5 5 0 10-10 0c0 4 5 8.5 5 8.5z" />
      <circle cx="8" cy="5.5" r="1.8" />
    </>
  ),
  mail: (
    <>
      <rect x="2" y="3.5" width="12" height="9" rx="1" />
      <path d="M2.5 4.5L8 9l5.5-4.5" />
    </>
  ),
  phone: <path d="M3 4c0 5 4 9 9 9l1.5-2.5-3-1.5-1 1c-1.5-.5-3-2-3.5-3.5l1-1L5.5 2.5z" />,
};

const Icon = ({ name, size = 14, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {PATHS[name]}
  </svg>
);

export default Icon;
