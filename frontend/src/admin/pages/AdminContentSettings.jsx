import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminTopbar } from '../AdminShell.jsx';
import { Btn, Stack, Row, H3, Body, Meta, Eyebrow } from '../../components/primitives.jsx';
import { getSettings, saveSettings } from '../content/storage.js';
import { isApiKeyValid } from '../content/claude.js';
import RedesNav from '../content/RedesNav.jsx';

const MAX_PHOTO_BYTES = 1024 * 1024; // 1 MB en localStorage es razonable
const PHOTO_MAX_DIMENSION = 800;     // redimensionar a 800px lado largo

// Lee un File, lo dibuja en canvas para resize/compresión, devuelve DataURL JPEG.
async function fileToCompressedDataUrl(file) {
  const img = await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onerror = reject;
    r.onload = () => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = r.result;
    };
    r.readAsDataURL(file);
  });

  const ratio = Math.min(1, PHOTO_MAX_DIMENSION / Math.max(img.width, img.height));
  const w = Math.round(img.width * ratio);
  const h = Math.round(img.height * ratio);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL('image/jpeg', 0.82);
}

export default function AdminContentSettings() {
  const [settings, setSettings] = useState(() => getSettings());
  const [saved, setSaved] = useState(false);
  const [revealKey, setRevealKey] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [photoBusy, setPhotoBusy] = useState(false);

  useEffect(() => {
    document.title = 'Ajustes · Redes · Admin · Rosibel';
  }, []);

  const updateBrand = (patch) => {
    setSettings({ ...settings, brand: { ...settings.brand, ...patch } });
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError('');
    setPhotoBusy(true);
    try {
      if (file.size > 5 * MAX_PHOTO_BYTES) {
        throw new Error('La foto es muy grande. Probá una de menos de 5 MB.');
      }
      const dataUrl = await fileToCompressedDataUrl(file);
      if (dataUrl.length > MAX_PHOTO_BYTES * 1.4) {
        throw new Error('La foto sigue siendo muy grande aún comprimida. Probá una más chica.');
      }
      updateBrand({ photoDataUrl: dataUrl });
    } catch (err) {
      setPhotoError(err.message ?? 'No pudimos procesar la imagen.');
    } finally {
      setPhotoBusy(false);
      e.target.value = ''; // permite re-subir misma foto si cambia algo
    }
  };

  const handleRemovePhoto = () => {
    updateBrand({ photoDataUrl: null });
  };

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const keyValid = isApiKeyValid(settings.apiKey);

  return (
    <>
      <AdminTopbar
        title="Ajustes · Redes"
        sub="Marca, firma e integración con IA"
        action={
          <Btn small as={Link} to="/admin/redes" icon={false}>
            ← Volver
          </Btn>
        }
      />
      <RedesNav />

      <div className="admin-content">
        <Stack gap={20} style={{ maxWidth: 720 }}>
          {/* Marca */}
          <article className="wf-card" style={{ padding: 22 }}>
            <Stack gap={14}>
              <Eyebrow>Marca</Eyebrow>
              <Stack gap={6}>
                <label className="content-label">Nombre que aparece en captions</label>
                <input
                  className="content-input"
                  value={settings.brand.name}
                  onChange={(e) => updateBrand({ name: e.target.value })}
                />
              </Stack>
              <Stack gap={6}>
                <label className="content-label">Handle (Instagram/Facebook)</label>
                <input
                  className="content-input"
                  value={settings.brand.handle}
                  onChange={(e) => updateBrand({ handle: e.target.value })}
                  placeholder="@rosibel.psicologa"
                />
                <Meta>Aparece en la esquina inferior de cada imagen.</Meta>
              </Stack>
              <Stack gap={6}>
                <label className="content-label">Firma para captions</label>
                <input
                  className="content-input"
                  value={settings.brand.signature}
                  onChange={(e) => updateBrand({ signature: e.target.value })}
                  placeholder="Rosibel"
                />
                <Meta>Se agrega al final del caption: "— Rosibel".</Meta>
              </Stack>
            </Stack>
          </article>

          {/* Foto de marca */}
          <article className="wf-card" style={{ padding: 22 }}>
            <Stack gap={14}>
              <Eyebrow>Foto de marca</Eyebrow>
              <Body size={14}>
                Una foto tuya (retrato, idealmente cuadrada) que las plantillas
                con foto pueden usar. Se redimensiona a 800px y comprime
                automáticamente. Se guarda solo en este navegador.
              </Body>

              <Row gap={16} wrap align="flex-start">
                <div className="brand-photo-preview">
                  {settings.brand.photoDataUrl ? (
                    <img
                      src={settings.brand.photoDataUrl}
                      alt="Foto de marca"
                    />
                  ) : (
                    <span>Sin foto</span>
                  )}
                </div>

                <Stack gap={10} style={{ flex: 1, minWidth: 200 }}>
                  <label className="wf-btn small ghost" style={{ cursor: 'pointer', textAlign: 'center' }}>
                    {photoBusy ? 'Procesando…' : settings.brand.photoDataUrl ? 'Reemplazar foto' : 'Subir foto'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      disabled={photoBusy}
                      style={{ display: 'none' }}
                    />
                  </label>
                  {settings.brand.photoDataUrl && (
                    <button
                      type="button"
                      className="content-link-btn content-link-btn--danger"
                      onClick={handleRemovePhoto}
                    >
                      Quitar foto
                    </button>
                  )}
                  {photoError && (
                    <Body
                      role="alert"
                      style={{
                        background: 'var(--danger-100)',
                        color: 'var(--danger-500)',
                        padding: '8px 12px',
                        borderRadius: 'var(--r-md)',
                        fontSize: 12,
                      }}
                    >
                      {photoError}
                    </Body>
                  )}
                  <Meta>JPG/PNG · max 5 MB · se comprime a ~150 KB.</Meta>
                </Stack>
              </Row>
            </Stack>
          </article>

          {/* IA */}
          <article className="wf-card" style={{ padding: 22 }}>
            <Stack gap={14}>
              <Eyebrow>Variar copy con IA (opcional)</Eyebrow>
              <Body size={14}>
                El generador con plantilla siempre funciona. Si querés además
                tener un botón "Variar con IA" en el editor para reescribir el
                caption en variaciones, pegá una API key de Anthropic.
              </Body>
              <Stack gap={6}>
                <label className="content-label">API key de Anthropic</label>
                <Row gap={8}>
                  <input
                    className="content-input"
                    type={revealKey ? 'text' : 'password'}
                    value={settings.apiKey ?? ''}
                    onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                    placeholder="sk-ant-…"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    className="content-link-btn"
                    onClick={() => setRevealKey((v) => !v)}
                  >
                    {revealKey ? 'Ocultar' : 'Mostrar'}
                  </button>
                </Row>
                <Meta>
                  {settings.apiKey
                    ? keyValid
                      ? '✓ Formato válido. La key vive solo en este navegador.'
                      : '⚠ El formato no parece válido (debería empezar con sk-ant-).'
                    : 'Conseguí una key en console.anthropic.com.'}
                </Meta>
              </Stack>
              <Stack gap={6}>
                <label className="content-label">Modelo</label>
                <select
                  className="content-select"
                  value={settings.model}
                  onChange={(e) => setSettings({ ...settings, model: e.target.value })}
                >
                  <option value="claude-haiku-4-5-20251001">Haiku 4.5 (más económico, recomendado)</option>
                  <option value="claude-sonnet-4-6">Sonnet 4.6 (más creativo, más caro)</option>
                </select>
              </Stack>
              <div className="content-alert content-alert--info">
                <strong>Seguridad:</strong> la key se guarda solo en localStorage de
                este navegador. Si compartís la computadora, no la pegues acá.
                Costo estimado por generación: menos de US$ 0.01 con Haiku.
              </div>
            </Stack>
          </article>

          {/* Guardar */}
          <Row gap={10}>
            <Btn onClick={handleSave} icon={false}>
              {saved ? '✓ Guardado' : 'Guardar cambios'}
            </Btn>
          </Row>
        </Stack>
      </div>
    </>
  );
}
