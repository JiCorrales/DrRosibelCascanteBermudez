import React from 'react';
import Icon from './Icon.jsx';
import { buildWaUrl, WHATSAPP_PREFILL } from '../data.js';

// Click-to-chat de WhatsApp. Abre wa.me con un mensaje pre-armado.
// No requiere API ni server — el paciente queda en su WhatsApp con el texto listo.
//
// Props:
//   message:  string opcional con el texto pre-armado (default: genérico)
//   variant:  'solid' | 'ghost' | 'link'  → estilo
//   size:     'md' | 'sm'                  → tamaño
//   children: texto del botón (default: "Escribirme por WhatsApp")
//   style:    overrides extras
export default function WhatsAppButton({
  message = WHATSAPP_PREFILL.generic,
  variant = 'solid',
  size = 'md',
  children = 'Escribirme por WhatsApp',
  style,
  ...rest
}) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    fontFamily: 'var(--sans)',
    fontWeight: 600,
    textDecoration: 'none',
    borderRadius: 'var(--r-md)',
    cursor: 'pointer',
    transition: 'background 0.15s ease, color 0.15s ease',
    lineHeight: 1,
  };

  const sizes = {
    md: { fontSize: 15, padding: '13px 22px', minHeight: 44 },
    sm: { fontSize: 13, padding: '8px 14px', minHeight: 36 },
  };

  // Verde WhatsApp oficial #25D366; usamos #1FA851 para mejor contraste con texto blanco.
  const variants = {
    solid: { background: '#1FA851', color: '#fff', border: 0 },
    ghost: { background: 'transparent', color: '#1FA851', border: '1px solid #1FA851' },
    link: { background: 'transparent', color: '#1FA851', padding: 0, minHeight: 'auto', textDecoration: 'underline' },
  };

  return (
    <a
      href={buildWaUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
      {...rest}
    >
      <Icon name="whatsapp" size={size === 'sm' ? 14 : 16} />
      <span>{children}</span>
    </a>
  );
}
