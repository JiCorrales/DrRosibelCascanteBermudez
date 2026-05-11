import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eyebrow, H3, Body, Stack, Meta } from '../components/primitives.jsx';

export default function TerminosPage() {
  useEffect(() => {
    document.title = 'Términos del servicio · Dra. Rosibel Cascante Bermúdez';
  }, []);

  return (
    <section className="section" style={{ paddingTop: 48 }}>
      <div className="container" style={{ maxWidth: 760 }}>
        <Stack gap={32}>
          <Stack gap={12}>
            <Eyebrow>Términos del servicio</Eyebrow>
            <h1 className="display" style={{ fontSize: 'clamp(32px, 4.5vw, 48px)' }}>
              Las reglas <em>del juego</em>.
            </h1>
            <Meta>Última actualización: 10 de mayo de 2026.</Meta>
          </Stack>

          <Body size={16}>
            Estos términos rigen la relación entre vos (paciente) y la Dra. Rosibel Cascante
            Bermúdez (psicóloga clínica, CPCR&nbsp;XXXX) cuando reservás una sesión a través de
            este sitio.
          </Body>

          <Stack gap={14}>
            <H3 size={18}>Naturaleza del servicio</H3>
            <Body size={15}>
              Las sesiones son de psicoterapia clínica con enfoque integrador (cognitivo-conductual,
              EMDR, humanista). No constituyen una emergencia psiquiátrica. Si estás en crisis,
              llamá al <strong>9-1-1</strong> o acudí al servicio de emergencias más cercano.
            </Body>
          </Stack>

          <Stack gap={14}>
            <H3 size={18}>Consentimiento informado</H3>
            <Body size={15}>
              Al confirmar una reserva aceptás haber leído este documento y el{' '}
              <Link to="/privacidad" style={{ color: 'var(--sage-700)' }}>
                aviso de privacidad
              </Link>
              . Antes de iniciar la primera sesión revisaremos juntos los alcances, expectativas
              y límites del proceso, y firmaremos un consentimiento informado más detallado.
            </Body>
          </Stack>

          <Stack gap={14}>
            <H3 size={18}>Reservas, reagendas y cancelaciones</H3>
            <ul style={{ paddingLeft: 24, color: 'var(--ink-700)', lineHeight: 1.7, margin: 0 }}>
              <li>
                Podés <strong>reagendar o cancelar sin costo hasta 24 horas antes</strong> de la
                sesión, desde el portal o por correo.
              </li>
              <li>
                Cancelaciones con menos de 24 horas se cobran al 100% (salvo emergencia justificada).
              </li>
              <li>
                Si no te presentás (<em>no-show</em>), la sesión se cobra completa.
              </li>
              <li>
                Tolerancia: si llegás más de 15 minutos tarde sin avisar, la sesión se considera
                no asistida.
              </li>
            </ul>
          </Stack>

          <Stack gap={14}>
            <H3 size={18}>Pagos</H3>
            <Body size={15}>
              Las sesiones se cobran al momento de reservar. Aceptamos SINPE Móvil, transferencia
              bancaria y tarjeta. Te enviamos un recibo por correo después de cada pago. En caso
              de devolución (por error de doble pago, por ejemplo), el reembolso se procesa en
              hasta 7 días hábiles por el mismo medio.
            </Body>
          </Stack>

          <Stack gap={14}>
            <H3 size={18}>Modalidad online</H3>
            <Body size={15}>
              Las sesiones online se realizan por una plataforma de videollamada segura. Te
              comparto el enlace 1 hora antes de la sesión. Es responsabilidad tuya tener una
              conexión estable y un espacio privado durante la sesión.
            </Body>
          </Stack>

          <Stack gap={14}>
            <H3 size={18}>Confidencialidad</H3>
            <Body size={15}>
              Todo lo que conversamos es estrictamente confidencial, con las únicas excepciones
              detalladas en el{' '}
              <Link to="/privacidad" style={{ color: 'var(--sage-700)' }}>
                aviso de privacidad
              </Link>
              . Las notas clínicas no se comparten ni con familiares ni con aseguradoras sin tu
              autorización expresa por escrito.
            </Body>
          </Stack>

          <Stack gap={14}>
            <H3 size={18}>Ética profesional</H3>
            <Body size={15}>
              Esta práctica se rige por el Código de Ética del Colegio Profesional de Psicólogos
              de Costa Rica. Si tenés alguna queja, podés escribirme directamente o presentarla
              al CPCR (psicologiacr.com).
            </Body>
          </Stack>

          <Stack gap={14}>
            <H3 size={18}>Cambios a estos términos</H3>
            <Body size={15}>
              Cualquier cambio significativo te lo comunico por correo antes de tu siguiente
              sesión. Si seguís reservando, se entiende que aceptás los nuevos términos.
            </Body>
          </Stack>

          <div className="wf-divider" />
          <Meta>
            ¿Algo no queda claro? Escribime a{' '}
            <a href="mailto:cascantebermudezrosibel@gmail.com" style={{ color: 'var(--sage-700)' }}>
              cascantebermudezrosibel@gmail.com
            </a>{' '}
            o volvé a{' '}
            <Link to="/" style={{ color: 'var(--sage-700)' }}>
              la página principal
            </Link>
            .
          </Meta>
        </Stack>
      </div>
    </section>
  );
}
