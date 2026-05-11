import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminTopbar } from '../AdminShell.jsx';
import { Btn, Stack, Row, H3, Body, Meta, Eyebrow } from '../../components/primitives.jsx';
import { getSettings, saveSettings } from '../content/storage.js';
import { isApiKeyValid } from '../content/claude.js';

export default function AdminContentSettings() {
  const [settings, setSettings] = useState(() => getSettings());
  const [saved, setSaved] = useState(false);
  const [revealKey, setRevealKey] = useState(false);

  useEffect(() => {
    document.title = 'Ajustes · Redes · Admin · Rosibel';
  }, []);

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateBrand = (patch) => {
    setSettings({ ...settings, brand: { ...settings.brand, ...patch } });
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
