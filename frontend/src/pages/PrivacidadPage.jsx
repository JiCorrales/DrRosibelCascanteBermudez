import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eyebrow, H3, Body, Stack, Meta } from '../components/primitives.jsx';

export default function PrivacidadPage() {
  useEffect(() => {
    document.title = 'Aviso de privacidad · Dra. Rosibel Cascante Bermúdez';
  }, []);

  return (
    <section className="section" style={{ paddingTop: 48 }}>
      <div className="container" style={{ maxWidth: 760 }}>
        <Stack gap={32}>
          <Stack gap={12}>
            <Eyebrow>Aviso de privacidad</Eyebrow>
            <h1 className="display" style={{ fontSize: 'clamp(32px, 4.5vw, 48px)' }}>
              Cómo cuido <em>tus datos</em>.
            </h1>
            <Meta>Última actualización: 10 de mayo de 2026.</Meta>
          </Stack>

          <Stack gap={20}>
            <Body size={16}>
              Este aviso explica qué datos tuyos guardo cuando reservás una cita o usás el portal
              del paciente, para qué los uso y qué derechos tenés sobre ellos. Sigue lo establecido
              por la <strong>Ley 8968</strong> de Protección de la Persona frente al Tratamiento
              de sus Datos Personales (Costa Rica).
            </Body>
          </Stack>

          <Stack gap={14}>
            <H3 size={18}>Responsable del tratamiento</H3>
            <Body size={15}>
              <strong>Dra. Rosibel Cascante Bermúdez</strong>, psicóloga clínica, colegiada al
              Colegio Profesional de Psicólogos de Costa Rica (CPCR&nbsp;XXXX).
              <br />
              Contacto:{' '}
              <a href="mailto:cascantebermudezrosibel@gmail.com" style={{ color: 'var(--sage-700)' }}>
                cascantebermudezrosibel@gmail.com
              </a>
              .
            </Body>
          </Stack>

          <Stack gap={14}>
            <H3 size={18}>Qué datos recolecto</H3>
            <Body size={15}>
              Cuando reservás una cita guardo: tu nombre, correo electrónico, número de teléfono,
              el servicio elegido, la fecha y hora, y (si lo escribís) el mensaje libre de "¿Qué
              te trae a terapia?".
            </Body>
            <Body size={15}>
              Durante el proceso terapéutico genero <strong>notas clínicas</strong> que viven
              cifradas y a las que sólo yo tengo acceso. Esas notas no se comparten nunca con
              terceros, salvo las excepciones legales descritas más abajo.
            </Body>
          </Stack>

          <Stack gap={14}>
            <H3 size={18}>Para qué uso tus datos</H3>
            <Body size={15}>
              Únicamente para gestionar tu atención clínica: confirmar tu reserva, recordarte la
              cita, llevar el historial de sesiones, compartirte material complementario en el
              portal y procesar el pago.
            </Body>
            <Body size={15}>
              No vendo tus datos. No los uso para publicidad ni para perfilamiento. No los
              comparto con plataformas de marketing.
            </Body>
          </Stack>

          <Stack gap={14}>
            <H3 size={18}>Quién tiene acceso</H3>
            <Body size={15}>
              Sólo yo, en mi rol de psicóloga clínica. Los datos están alojados en{' '}
              <strong>Supabase</strong> (proveedor de base de datos en la nube con servidores en
              Estados Unidos), bajo un acuerdo de procesamiento de datos. Los correos
              transaccionales (confirmación de cita, recordatorios) los envío a través de{' '}
              <strong>Resend</strong>.
            </Body>
            <Body size={15}>
              Excepciones a la confidencialidad — sólo en estos casos puedo compartir tu
              información, y siempre te lo voy a comentar antes si la situación lo permite:
            </Body>
            <ul style={{ paddingLeft: 24, color: 'var(--ink-700)', lineHeight: 1.7, margin: 0 }}>
              <li>Riesgo inminente para tu vida o la de un tercero.</li>
              <li>Orden judicial expresa.</li>
              <li>Maltrato a personas menores de edad o adultas mayores en situación de vulnerabilidad (deber legal de reporte).</li>
            </ul>
          </Stack>

          <Stack gap={14}>
            <H3 size={18}>Por cuánto tiempo los guardo</H3>
            <Body size={15}>
              Mientras dure nuestro proceso terapéutico y por <strong>5 años adicionales</strong>{' '}
              después de la última sesión, plazo que coincide con el mínimo recomendado por el
              CPCR para el resguardo de historiales clínicos. Después de ese período los datos se
              destruyen de forma segura, salvo que vos pidás antes su eliminación.
            </Body>
          </Stack>

          <Stack gap={14}>
            <H3 size={18}>Tus derechos</H3>
            <Body size={15}>
              Según la Ley 8968 tenés derecho a:
            </Body>
            <ul style={{ paddingLeft: 24, color: 'var(--ink-700)', lineHeight: 1.7, margin: 0 }}>
              <li><strong>Acceso</strong>: saber qué datos tuyos tengo.</li>
              <li><strong>Rectificación</strong>: pedir que corrija información incorrecta.</li>
              <li><strong>Cancelación</strong>: pedir que borre tus datos (con las salvedades del punto anterior).</li>
              <li><strong>Oposición</strong>: oponerte al tratamiento por motivos legítimos.</li>
              <li><strong>Portabilidad</strong>: recibir una copia de tus datos en formato estructurado.</li>
            </ul>
            <Body size={15}>
              Para ejercer cualquiera de estos derechos, escribime a{' '}
              <a href="mailto:cascantebermudezrosibel@gmail.com" style={{ color: 'var(--sage-700)' }}>
                cascantebermudezrosibel@gmail.com
              </a>{' '}
              con asunto "Derechos ARCO". Te respondo en máximo 5 días hábiles.
            </Body>
            <Body size={15}>
              Si considerás que mi manejo de tus datos no fue adecuado, podés presentar una queja
              ante la <strong>Agencia de Protección de Datos de los Habitantes (PRODHAB)</strong>:
              prodhab.go.cr.
            </Body>
          </Stack>

          <Stack gap={14}>
            <H3 size={18}>Seguridad</H3>
            <Body size={15}>
              La conexión al sitio usa HTTPS. La base de datos aplica Row-Level Security para
              que sólo yo pueda leer información clínica. Las notas clínicas se cifran en
              reposo. Las copias de seguridad se hacen automáticas y se conservan 30 días.
            </Body>
          </Stack>

          <Stack gap={14}>
            <H3 size={18}>Cambios al aviso</H3>
            <Body size={15}>
              Si necesito actualizarlo, vas a ver la nueva fecha de "Última actualización" arriba.
              Si los cambios son significativos te aviso por correo antes de tu siguiente sesión.
            </Body>
          </Stack>

          <div className="wf-divider" />
          <Meta>
            ¿Dudas? Escribime a{' '}
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
