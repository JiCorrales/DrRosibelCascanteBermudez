// Renderers de canvas para los formatos de Redes. Cada plantilla recibe un
// HTMLCanvasElement y los datos del post (headline, body, brand, etc.) y dibuja
// usando la API 2D nativa. Sin dependencias externas.
//
// La paleta se lee EN TIEMPO DE EJECUCIÓN desde las CSS custom properties
// definidas en tokens.css. Cambiar la paleta del sitio (en tokens.css)
// actualiza también los assets descargables de redes — un solo punto de
// edición para toda la marca.

function readToken(name, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const v = getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
    return v || fallback;
  } catch {
    return fallback;
  }
}

function readPalette() {
  // Lee tokens vivos del DOM. Fallbacks por si se invoca antes del primer
  // render (defaults = paleta mauve sofisticado actual).
  const inkRgb = readToken('--ink-rgb', '61 40 50');
  const sageRgb = readToken('--sage-rgb', '139 90 107');
  return {
    bg:       readToken('--bg', '#FAF5F4'),
    bg2:      readToken('--bg-2', '#E8D8D4'),
    bg3:      readToken('--bg-3', '#F0E4E2'),
    sage100:  readToken('--sage-100', '#F0DEE0'),
    sage500:  readToken('--sage-500', '#8B5A6B'),
    sage700:  readToken('--sage-700', '#6B4350'),
    ink900:   readToken('--ink-900', '#3D2832'),
    ink500:   readToken('--ink-500', '#856876'),
    ink300:   readToken('--ink-300', '#A89099'),
    accent500: readToken('--accent-500', '#B07989'),
    // Overlays derivados (mismas reglas que tokens.css usa para --line)
    line:           `rgb(${inkRgb} / 0.10)`,
    inkOverlay007:  `rgb(${inkRgb} / 0.07)`,
    inkOverlay015:  `rgb(${inkRgb} / 0.15)`,
    sageOverlay010: `rgb(${sageRgb} / 0.10)`,
    sageOverlay025: `rgb(${sageRgb} / 0.25)`,
  };
}

// PALETTE como Proxy: la primera vez que se accede a una clave, lee del DOM.
// Esto permite mantener el patrón `PALETTE.bg` por todo el archivo sin
// preocuparnos por inicialización manual.
const _cache = { ready: false };
const PALETTE = new Proxy(_cache, {
  get(target, prop) {
    if (!target.ready) {
      Object.assign(target, readPalette());
      target.ready = true;
    }
    return target[prop];
  },
});
// Permite forzar refresh si alguien cambia la paleta en runtime (ej. tests).
export function refreshPalette() {
  Object.assign(_cache, readPalette());
  _cache.ready = true;
  return _cache;
}

const SERIF = "'Fraunces', 'Lora', Georgia, serif";
const SANS = "'DM Sans', 'Inter', system-ui, sans-serif";

// ─────── Helpers ───────

function clearCanvas(ctx, w, h, fill) {
  ctx.fillStyle = fill ?? PALETTE.bg;
  ctx.fillRect(0, 0, w, h);
}

// Word-wrap manual con métricas del canvas. Devuelve [{ text, y }].
function wrapText(ctx, text, maxWidth) {
  if (!text) return [];
  // Soportar \n explícitos primero
  const paragraphs = text.split('\n');
  const lines = [];

  for (const para of paragraphs) {
    if (!para.trim()) {
      lines.push(''); // línea en blanco
      continue;
    }
    const words = para.split(' ');
    let current = '';

    for (const word of words) {
      const probe = current ? `${current} ${word}` : word;
      const { width } = ctx.measureText(probe);
      if (width <= maxWidth || !current) {
        current = probe;
      } else {
        lines.push(current);
        current = word;
      }
    }
    if (current) lines.push(current);
  }

  return lines;
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, align = 'left') {
  const lines = wrapText(ctx, text, maxWidth);
  ctx.textAlign = align;
  ctx.textBaseline = 'top';
  lines.forEach((line, i) => {
    const drawX = align === 'center' ? x + maxWidth / 2 : align === 'right' ? x + maxWidth : x;
    ctx.fillText(line, drawX, y + i * lineHeight);
  });
  return lines.length * lineHeight;
}

function drawDot(ctx, x, y, r, color) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

// Cache de HTMLImageElement por DataURL para no recargar la foto en cada
// render del canvas (preview se redibuja en cada cambio de texto).
const _imageCache = new Map();

export function loadImageFromDataUrl(dataUrl) {
  if (!dataUrl) return Promise.resolve(null);
  if (_imageCache.has(dataUrl)) return Promise.resolve(_imageCache.get(dataUrl));
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      _imageCache.set(dataUrl, img);
      resolve(img);
    };
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
}

// Pre-carga la foto de marca (si existe) y devuelve un brand enriquecido con
// `photoImage: HTMLImageElement | null` listo para usar en plantillas con foto.
export async function withBrandImage(brand) {
  if (!brand?.photoDataUrl) return brand;
  const photoImage = await loadImageFromDataUrl(brand.photoDataUrl);
  return { ...brand, photoImage };
}

function drawHandleBar(ctx, w, h, brand, color = PALETTE.ink900) {
  if (!brand?.handle) return;
  ctx.fillStyle = color;
  ctx.font = `500 22px ${SANS}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  // dot
  drawDot(ctx, 80, h - 70, 9, PALETTE.sage500);
  ctx.fillText(brand.handle, 100, h - 70);
}

// ─────── POST CUADRADO 1080×1080 ───────

function postCitaDestacada(ctx, w, h, { headline, brand }) {
  clearCanvas(ctx, w, h, PALETTE.sage100);
  // marco interior
  ctx.strokeStyle = PALETTE.sageOverlay025;
  ctx.lineWidth = 2;
  ctx.strokeRect(60, 60, w - 120, h - 120);

  // comillas decorativas
  ctx.fillStyle = PALETTE.sage500;
  ctx.font = `400 220px ${SERIF}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('"', 100, 100);

  // frase
  ctx.fillStyle = PALETTE.ink900;
  ctx.font = `500 56px ${SERIF}`;
  drawWrappedText(ctx, headline, 130, 320, w - 260, 72, 'left');

  // firma
  ctx.fillStyle = PALETTE.ink500;
  ctx.font = `500 22px ${SANS}`;
  ctx.textAlign = 'right';
  ctx.fillText(brand?.signature ? `— ${brand.signature}` : '', w - 130, h - 170);

  drawHandleBar(ctx, w, h, brand, PALETTE.ink900);
}

function postTipEducativo(ctx, w, h, { headline, body, brand }) {
  clearCanvas(ctx, w, h, PALETTE.bg);

  // eyebrow superior
  ctx.fillStyle = PALETTE.sage700;
  ctx.font = `500 22px ${SANS}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('PARA SABER', 80, 80);
  // línea bajo eyebrow
  ctx.strokeStyle = PALETTE.sage500;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(80, 115);
  ctx.lineTo(160, 115);
  ctx.stroke();

  // titular
  ctx.fillStyle = PALETTE.ink900;
  ctx.font = `500 60px ${SERIF}`;
  const titleHeight = drawWrappedText(ctx, headline, 80, 160, w - 160, 70, 'left');

  // cuerpo
  ctx.fillStyle = PALETTE.ink900;
  ctx.font = `400 30px ${SANS}`;
  drawWrappedText(ctx, body, 80, 160 + titleHeight + 50, w - 160, 46, 'left');

  drawHandleBar(ctx, w, h, brand);
}

function postPreguntaAbierta(ctx, w, h, { headline, brand }) {
  clearCanvas(ctx, w, h, PALETTE.bg3);

  // signo de pregunta gigante de fondo
  ctx.fillStyle = PALETTE.sageOverlay010;
  ctx.font = `400 700px ${SERIF}`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillText('?', w - 50, -80);

  // pregunta centrada
  ctx.fillStyle = PALETTE.ink900;
  ctx.font = `500 54px ${SERIF}`;
  // calcular altura para centrar verticalmente
  const lines = wrapText(ctx, headline, w - 200);
  const totalH = lines.length * 70;
  const startY = (h - totalH) / 2 - 40;
  drawWrappedText(ctx, headline, 100, startY, w - 200, 70, 'left');

  // pie discreto
  ctx.fillStyle = PALETTE.ink500;
  ctx.font = `500 22px ${SANS}`;
  ctx.textAlign = 'left';
  ctx.fillText('Contame en comentarios.', 80, h - 130);

  drawHandleBar(ctx, w, h, brand);
}

function postPromoServicio(ctx, w, h, { headline, body, brand }) {
  clearCanvas(ctx, w, h, PALETTE.bg);

  // banda salvia inferior
  ctx.fillStyle = PALETTE.sage500;
  ctx.fillRect(0, h * 0.62, w, h * 0.38);

  // eyebrow
  ctx.fillStyle = PALETTE.sage700;
  ctx.font = `500 22px ${SANS}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('INVITACIÓN', 80, 90);

  // título sobre el bg
  ctx.fillStyle = PALETTE.ink900;
  ctx.font = `500 58px ${SERIF}`;
  drawWrappedText(ctx, headline, 80, 140, w - 160, 70, 'left');

  // cuerpo sobre la banda salvia
  ctx.fillStyle = PALETTE.bg;
  ctx.font = `400 28px ${SANS}`;
  drawWrappedText(ctx, body, 80, h * 0.62 + 60, w - 160, 42, 'left');

  // handle en blanco sobre banda
  if (brand?.handle) {
    ctx.fillStyle = PALETTE.bg;
    ctx.font = `500 22px ${SANS}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    drawDot(ctx, 80, h - 70, 9, PALETTE.bg);
    ctx.fillStyle = PALETTE.bg;
    ctx.fillText(brand.handle, 100, h - 70);
  }
}

function postListaNumerada(ctx, w, h, { headline, body, brand }) {
  clearCanvas(ctx, w, h, PALETTE.bg);

  // bloque vertical sage a la izquierda
  ctx.fillStyle = PALETTE.sage100;
  ctx.fillRect(0, 0, 240, h);

  // número gigante "01"
  ctx.fillStyle = PALETTE.sage500;
  ctx.font = `500 280px ${SERIF}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('01', 120, h / 2 - 40);

  // titular a la derecha
  ctx.fillStyle = PALETTE.ink900;
  ctx.font = `500 54px ${SERIF}`;
  const titleH = drawWrappedText(ctx, headline, 290, 140, w - 380, 66, 'left');

  // cuerpo a la derecha
  ctx.fillStyle = PALETTE.ink700;
  ctx.font = `400 26px ${SANS}`;
  drawWrappedText(ctx, body, 290, 140 + titleH + 50, w - 380, 42, 'left');

  drawHandleBar(ctx, w, h, brand);
}

function postMancha(ctx, w, h, { headline, body, brand }) {
  clearCanvas(ctx, w, h, PALETTE.bg);

  // mancha circular sage que sale del costado
  const grad = ctx.createRadialGradient(w * 0.85, h * 0.25, 50, w * 0.85, h * 0.25, w * 0.8);
  grad.addColorStop(0, PALETTE.sage300);
  grad.addColorStop(0.5, PALETTE.sage100);
  grad.addColorStop(1, PALETTE.bg);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // eyebrow
  ctx.fillStyle = PALETTE.sage700;
  ctx.font = `500 22px ${SANS}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('REFLEXIÓN', 80, 80);

  // titular grande centrado a la izquierda
  ctx.fillStyle = PALETTE.ink900;
  ctx.font = `500 64px ${SERIF}`;
  const lines = wrapText(ctx, headline, w * 0.6);
  const totalH = lines.length * 80;
  const startY = (h - totalH) / 2;
  drawWrappedText(ctx, headline, 80, startY, w * 0.6, 80, 'left');

  // body abajo
  if (body) {
    ctx.fillStyle = PALETTE.ink700;
    ctx.font = `400 28px ${SANS}`;
    drawWrappedText(ctx, body, 80, h - 280, w * 0.6, 42, 'left');
  }

  drawHandleBar(ctx, w, h, brand);
}

function postRetratoCita(ctx, w, h, { headline, brand }) {
  clearCanvas(ctx, w, h, PALETTE.bg);

  // Si hay foto, ocupa la mitad izquierda. Si no, fallback a banda sage.
  const photoSize = w * 0.5;
  if (brand?.photoImage) {
    // Calcular crop centrado para llenar el cuadrado izquierdo
    const img = brand.photoImage;
    const srcRatio = img.width / img.height;
    let sx = 0, sy = 0, sw = img.width, sh = img.height;
    if (srcRatio > 1) {
      sw = img.height;
      sx = (img.width - sw) / 2;
    } else {
      sh = img.width;
      sy = (img.height - sh) / 2;
    }
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, photoSize, h);
  } else {
    // Placeholder con diagonal hatch (mismo estilo que wf-photo)
    ctx.fillStyle = PALETTE.bg2;
    ctx.fillRect(0, 0, photoSize, h);
    ctx.fillStyle = PALETTE.ink300;
    ctx.font = `500 18px ${SANS}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Sin foto', photoSize / 2, h / 2);
    ctx.font = `400 13px ${SANS}`;
    ctx.fillText('Subila en Ajustes', photoSize / 2, h / 2 + 28);
  }

  // Lado derecho: cita y firma
  const rightX = photoSize + 60;
  const rightW = w - photoSize - 120;

  // Comilla decorativa
  ctx.fillStyle = PALETTE.sage500;
  ctx.font = `400 160px ${SERIF}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('"', rightX, 80);

  // Cita
  ctx.fillStyle = PALETTE.ink900;
  ctx.font = `500 40px ${SERIF}`;
  const lines = wrapText(ctx, headline, rightW);
  const totalH = lines.length * 54;
  const startY = (h - totalH) / 2;
  drawWrappedText(ctx, headline, rightX, startY, rightW, 54, 'left');

  // Firma
  if (brand?.signature) {
    ctx.fillStyle = PALETTE.ink500;
    ctx.font = `500 20px ${SANS}`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText(`— ${brand.signature}`, rightX + rightW, h - 180);
  }

  // Handle abajo derecha
  if (brand?.handle) {
    ctx.fillStyle = PALETTE.ink900;
    ctx.font = `500 18px ${SANS}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    drawDot(ctx, rightX, h - 70, 8, PALETTE.sage500);
    ctx.fillText(brand.handle, rightX + 18, h - 70);
  }
}

function postDobleColumna(ctx, w, h, { headline, body, brand }) {
  clearCanvas(ctx, w, h, PALETTE.bg);

  // división vertical en el medio
  ctx.strokeStyle = PALETTE.sage300;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(w / 2, 140);
  ctx.lineTo(w / 2, h - 140);
  ctx.stroke();

  // columna izquierda: titular grande
  ctx.fillStyle = PALETTE.ink900;
  ctx.font = `500 52px ${SERIF}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const leftLines = wrapText(ctx, headline, w / 2 - 160);
  const leftH = leftLines.length * 64;
  drawWrappedText(ctx, headline, 80, h / 2 - leftH / 2, w / 2 - 160, 64, 'left');

  // columna derecha: eyebrow + body
  ctx.fillStyle = PALETTE.sage700;
  ctx.font = `500 22px ${SANS}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('PARA RECORDAR', w / 2 + 80, 200);

  ctx.fillStyle = PALETTE.ink700;
  ctx.font = `400 28px ${SANS}`;
  drawWrappedText(ctx, body, w / 2 + 80, 270, w / 2 - 160, 44, 'left');

  drawHandleBar(ctx, w, h, brand);
}

// ─────── STORY 1080×1920 ───────

function storyTipRapido(ctx, w, h, { headline, body, brand }) {
  // gradient marfil → bg2
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, PALETTE.bg);
  grad.addColorStop(1, PALETTE.bg3);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // eyebrow
  ctx.fillStyle = PALETTE.sage700;
  ctx.font = `500 28px ${SANS}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('TIP RÁPIDO', 90, 220);
  ctx.strokeStyle = PALETTE.sage500;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(90, 270);
  ctx.lineTo(220, 270);
  ctx.stroke();

  // hook grande
  ctx.fillStyle = PALETTE.ink900;
  ctx.font = `500 84px ${SERIF}`;
  const titleH = drawWrappedText(ctx, headline, 90, 340, w - 180, 100, 'left');

  // body
  ctx.fillStyle = PALETTE.ink900;
  ctx.font = `400 38px ${SANS}`;
  drawWrappedText(ctx, body, 90, 340 + titleH + 80, w - 180, 58, 'left');

  // CTA inferior
  ctx.fillStyle = PALETTE.sage500;
  const ctaY = h - 280;
  ctx.fillRect(90, ctaY, w - 180, 130);
  ctx.fillStyle = PALETTE.bg;
  ctx.font = `500 36px ${SANS}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Agendá tu sesión', w / 2, ctaY + 65);

  // handle muy abajo
  if (brand?.handle) {
    ctx.fillStyle = PALETTE.ink500;
    ctx.font = `500 26px ${SANS}`;
    ctx.textAlign = 'center';
    ctx.fillText(brand.handle, w / 2, h - 100);
  }
}

function storyCita(ctx, w, h, { headline, brand }) {
  // gradient sage100 → bg
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, PALETTE.sage100);
  grad.addColorStop(1, PALETTE.bg);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // comilla decorativa
  ctx.fillStyle = PALETTE.sage500;
  ctx.font = `400 340px ${SERIF}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('"', 80, 240);

  // frase
  ctx.fillStyle = PALETTE.ink900;
  ctx.font = `500 72px ${SERIF}`;
  const lines = wrapText(ctx, headline, w - 200);
  const totalH = lines.length * 92;
  const startY = (h - totalH) / 2;
  drawWrappedText(ctx, headline, 100, startY, w - 200, 92, 'left');

  // firma
  if (brand?.signature) {
    ctx.fillStyle = PALETTE.ink500;
    ctx.font = `500 32px ${SANS}`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText(`— ${brand.signature}`, w - 100, h - 320);
  }

  // handle
  if (brand?.handle) {
    ctx.fillStyle = PALETTE.ink500;
    ctx.font = `500 26px ${SANS}`;
    ctx.textAlign = 'center';
    ctx.fillText(brand.handle, w / 2, h - 120);
  }
}

function storyStat(ctx, w, h, { headline, body, brand }) {
  clearCanvas(ctx, w, h, PALETTE.bg);

  // banda sage superior
  ctx.fillStyle = PALETTE.sage500;
  ctx.fillRect(0, 0, w, 240);

  // eyebrow blanco
  ctx.fillStyle = PALETTE.bg;
  ctx.font = `500 32px ${SANS}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('DATO PARA PENSAR', w / 2, 130);

  // número/stat gigante (usa headline si es corto, sino primera línea de body)
  const statText = headline.length <= 12 ? headline : (body.split('\n')[0] ?? headline).slice(0, 12);

  ctx.fillStyle = PALETTE.ink900;
  ctx.font = `500 320px ${SERIF}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(statText, w / 2, h / 2);

  // body debajo
  ctx.fillStyle = PALETTE.ink700;
  ctx.font = `400 38px ${SANS}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  const caption = headline.length > 12 ? headline : body;
  drawWrappedText(ctx, caption, 100, h - 520, w - 200, 56, 'center');

  // handle abajo
  if (brand?.handle) {
    ctx.fillStyle = PALETTE.ink500;
    ctx.font = `500 28px ${SANS}`;
    ctx.textAlign = 'center';
    ctx.fillText(brand.handle, w / 2, h - 120);
  }
}

function storyPregunta(ctx, w, h, { headline, brand }) {
  clearCanvas(ctx, w, h, PALETTE.bg3);

  // eyebrow superior
  ctx.fillStyle = PALETTE.sage700;
  ctx.font = `500 30px ${SANS}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('PREGUNTA DEL DÍA', 90, 240);

  // pregunta grande en el medio
  ctx.fillStyle = PALETTE.ink900;
  ctx.font = `500 76px ${SERIF}`;
  const lines = wrapText(ctx, headline, w - 180);
  const totalH = lines.length * 96;
  drawWrappedText(ctx, headline, 90, 380, w - 180, 96, 'left');

  // caja de respuesta visual (estilo input)
  const boxY = 380 + totalH + 100;
  ctx.fillStyle = PALETTE.bg;
  ctx.strokeStyle = PALETTE.sage300;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(90, boxY, w - 180, 200, 16) : ctx.rect(90, boxY, w - 180, 200);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = PALETTE.ink300;
  ctx.font = `400 28px ${SANS}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('Tocá para responder…', 120, boxY + 100);

  // CTA inferior
  ctx.fillStyle = PALETTE.sage500;
  const ctaY = h - 280;
  ctx.fillRect(90, ctaY, w - 180, 110);
  ctx.fillStyle = PALETTE.bg;
  ctx.font = `500 34px ${SANS}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Respondé en el sticker ✨', w / 2, ctaY + 55);

  // handle
  if (brand?.handle) {
    ctx.fillStyle = PALETTE.ink500;
    ctx.font = `500 26px ${SANS}`;
    ctx.textAlign = 'center';
    ctx.fillText(brand.handle, w / 2, h - 100);
  }
}

// ─────── CARRUSEL — cada slide 1080×1080 ───────

function carouselSlide(ctx, w, h, { title, body, brand, index, total, isFirst, isLast }) {
  const bg = isFirst ? PALETTE.sage100 : isLast ? PALETTE.bg2 : PALETTE.bg;
  clearCanvas(ctx, w, h, bg);

  // indicador de slide (chips arriba)
  const chipW = (w - 200) / total - 12;
  for (let i = 0; i < total; i++) {
    ctx.fillStyle = i === index ? PALETTE.sage500 : PALETTE.inkOverlay015;
    const x = 100 + i * (chipW + 12);
    ctx.fillRect(x, 80, chipW, 6);
  }

  if (isFirst) {
    // Slide portada: title grande centrado
    ctx.fillStyle = PALETTE.ink900;
    ctx.font = `500 72px ${SERIF}`;
    const lines = wrapText(ctx, title, w - 200);
    const totalH = lines.length * 90;
    const startY = (h - totalH) / 2 - 50;
    drawWrappedText(ctx, title, 100, startY, w - 200, 90, 'left');

    ctx.fillStyle = PALETTE.sage700;
    ctx.font = `500 28px ${SANS}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(body || 'Deslizá →', 100, h - 200);
  } else if (isLast) {
    // Slide CTA: title arriba, body con handle
    ctx.fillStyle = PALETTE.ink900;
    ctx.font = `500 64px ${SERIF}`;
    drawWrappedText(ctx, title, 100, 200, w - 200, 80, 'left');

    ctx.fillStyle = PALETTE.ink900;
    ctx.font = `400 36px ${SANS}`;
    drawWrappedText(ctx, body, 100, 360, w - 200, 54, 'left');
  } else {
    // Slide contenido: número grande + texto
    ctx.fillStyle = PALETTE.sage500;
    ctx.font = `500 220px ${SERIF}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(title, 100, 140);

    ctx.fillStyle = PALETTE.ink900;
    ctx.font = `500 44px ${SERIF}`;
    drawWrappedText(ctx, body, 100, 420, w - 200, 60, 'left');
  }

  drawHandleBar(ctx, w, h, brand);
}

// ─────── Registry ───────

export const TEMPLATES = {
  post: {
    cita:     { label: 'Cita destacada',   draw: postCitaDestacada },
    tip:      { label: 'Tip educativo',    draw: postTipEducativo },
    pregunta: { label: 'Pregunta abierta', draw: postPreguntaAbierta },
    promo:    { label: 'Invitación',       draw: postPromoServicio },
    lista:    { label: 'Lista numerada',   draw: postListaNumerada },
    mancha:   { label: 'Mancha de color',  draw: postMancha },
    doble:    { label: 'Doble columna',    draw: postDobleColumna },
    retrato:  { label: 'Retrato + cita',   draw: postRetratoCita,  needsPhoto: true },
  },
  story: {
    tip:      { label: 'Tip rápido',  draw: storyTipRapido },
    cita:     { label: 'Cita',        draw: storyCita },
    stat:     { label: 'Dato grande', draw: storyStat },
    pregunta: { label: 'Pregunta',    draw: storyPregunta },
  },
  carousel: {
    classic: { label: 'Clásico (5 slides)', draw: carouselSlide },
  },
};

export const FORMAT_DIMENSIONS = {
  post:     { w: 1080, h: 1080 },
  story:    { w: 1080, h: 1920 },
  carousel: { w: 1080, h: 1080 },
};

export function pickTemplate(format, templateKey) {
  const group = TEMPLATES[format];
  if (!group) return null;
  return group[templateKey] ?? Object.values(group)[0];
}

export function defaultTemplateForAngle(angle, format) {
  if (format === 'carousel') return 'classic';
  if (format === 'story') {
    if (angle === 'pregunta') return 'pregunta';
    if (angle === 'tip') return 'tip';
    return 'cita';
  }
  // post
  switch (angle) {
    case 'pregunta':         return 'pregunta';
    case 'mito-vs-realidad': return 'doble';
    case 'tip':              return 'lista';
    case 'invitacion':       return 'promo';
    default:                 return 'cita';
  }
}

// ─────── Render principal ───────

// Dibuja un post completo (no carrusel) en un canvas existente.
export function renderToCanvas(canvas, { format, templateKey, post, brand }) {
  const dims = FORMAT_DIMENSIONS[format];
  if (!dims) return;
  canvas.width = dims.w;
  canvas.height = dims.h;
  const ctx = canvas.getContext('2d');

  const tpl = pickTemplate(format, templateKey);
  if (!tpl) {
    clearCanvas(ctx, dims.w, dims.h);
    return;
  }

  tpl.draw(ctx, dims.w, dims.h, {
    headline: post.headline,
    body: post.body,
    brand,
  });
}

// Dibuja un slide específico del carrusel.
export function renderCarouselSlide(canvas, { post, brand, index }) {
  const dims = FORMAT_DIMENSIONS.carousel;
  canvas.width = dims.w;
  canvas.height = dims.h;
  const ctx = canvas.getContext('2d');

  const slides = post.slides ?? [];
  const total = slides.length;
  const slide = slides[index] ?? { title: '', body: '' };

  carouselSlide(ctx, dims.w, dims.h, {
    title: slide.title,
    body: slide.body,
    brand,
    index,
    total,
    isFirst: index === 0,
    isLast: index === total - 1,
  });
}

// ─────── Exports a PNG ───────

export function canvasToBlob(canvas) {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png', 0.95));
}

export async function downloadCanvasAsPNG(canvas, filename) {
  const blob = await canvasToBlob(canvas);
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Para carruseles: descarga cada slide como PNG separado (sin dependencia
// de JSZip). La doctora sube manualmente al carrusel en IG.
export async function downloadCarouselSlides({ post, brand, baseName }) {
  const dims = FORMAT_DIMENSIONS.carousel;
  const slides = post.slides ?? [];
  for (let i = 0; i < slides.length; i++) {
    const canvas = document.createElement('canvas');
    canvas.width = dims.w;
    canvas.height = dims.h;
    renderCarouselSlide(canvas, { post, brand, index: i });
    await downloadCanvasAsPNG(canvas, `${baseName}-${i + 1}.png`);
    // pequeño delay entre descargas para evitar que el browser bloquee
    await new Promise((r) => setTimeout(r, 250));
  }
}
