// /reservar — flujo de reserva (varios pasos + 2 enfoques alternativos)

/* Step header for wizard */
const StepHeader = ({ step, total = 4, title }) => (
  <Pad x={22} y={14}>
    <Stack gap={10}>
      <Row justify="space-between" align="center">
        <Meta>Reserva</Meta>
        <Meta>{step} de {total}</Meta>
      </Row>
      <Row gap={4}>
        {Array.from({length: total}).map((_,i) => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i < step ? 'var(--sage-500)' : 'var(--line)' }}/>
        ))}
      </Row>
      <H2 size={22} style={{ paddingTop: 6 }}>{title}</H2>
    </Stack>
  </Pad>
);

const Reserva1 = () => (
  <Frame>
    <PhoneChrome back title="Reservar"/>
    <StepHeader step={1} title="¿Qué servicio querés reservar?"/>
    <Pad x={22} y={6} style={{ flex: 1 }}>
      <Stack gap={10}>
        {[
          ['Servicio 1', '50 min', '₡25.000', true],
          ['Servicio 2', '80 min', '₡40.000', false],
          ['Servicio 3', '50 min', '₡25.000', false],
          ['Primer encuentro', '20 min', 'Gratis', false],
        ].map(([n,d,p,sel],i) => (
          <div key={i} className={`wf-card ${sel ? 'sage' : ''}`} style={{ padding: 14, borderColor: sel ? 'var(--sage-500)' : 'var(--line)', borderWidth: sel?2:1 }}>
            <Row justify="space-between" align="center">
              <Stack gap={4}>
                <H3 size={14}>{n}</H3>
                <Meta>{d}</Meta>
              </Stack>
              <Stack gap={2} style={{ alignItems: 'flex-end' }}>
                <H3 size={14} style={{ color:'var(--sage-700)' }}>{p}</H3>
                <div style={{ width:18, height:18, borderRadius:999, border:'1.5px solid var(--sage-500)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {sel && <div style={{ width:10, height:10, borderRadius:999, background:'var(--sage-500)' }}/>}
                </div>
              </Stack>
            </Row>
          </div>
        ))}
      </Stack>
    </Pad>
    <Pad x={22} y={16}><Btn block>Continuar</Btn></Pad>
  </Frame>
);

const Reserva2 = () => (
  <Frame>
    <PhoneChrome back title="Reservar"/>
    <StepHeader step={2} title="Elegí día y hora"/>
    <Pad x={22} y={6} style={{ flex: 1 }}>
      <Stack gap={16}>
        <div className="wf-card" style={{ padding: 14 }}>
          <MiniCal/>
        </div>
        <Stack gap={8}>
          <Row justify="space-between" align="center">
            <H3 size={14}>Jueves 14 de mayo</H3>
            <Meta>5 horarios</Meta>
          </Row>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 8 }}>
            {['9:00','10:00','11:00','14:00','15:00','16:00'].map((t,i) => (
              <div key={t} className="wf-card" style={{ padding: '12px 8px', textAlign:'center', background: i===2?'var(--sage-500)':'#fff', color: i===2?'var(--bg)':'var(--ink-700)', borderColor: i===2?'var(--sage-500)':'var(--line)' }}>
                <H3 size={13} style={{ color:'inherit' }}>{t}</H3>
              </div>
            ))}
          </div>
        </Stack>
      </Stack>
    </Pad>
    <Pad x={22} y={16}><Btn block>Continuar</Btn></Pad>
  </Frame>
);

const Reserva3 = () => (
  <Frame>
    <PhoneChrome back title="Reservar"/>
    <StepHeader step={3} title="Tus datos"/>
    <Pad x={22} y={6} style={{ flex: 1 }}>
      <Stack gap={12}>
        <div className="wf-card tinted" style={{ padding: 12 }}>
          <Row gap={10} align="center">
            <Icon name="cal" size={14} color="var(--sage-700)"/>
            <Stack gap={2}>
              <H3 size={13}>Servicio 1 · Jue 14 may · 11:00</H3>
              <Meta>50 min · ₡25.000</Meta>
            </Stack>
          </Row>
        </div>
        <div className="wf-input field"><div className="lbl">Nombre completo</div><div className="ctrl">Tu nombre</div></div>
        <div className="wf-input field"><div className="lbl">Correo</div><div className="ctrl">correo@dominio.com</div></div>
        <div className="wf-input field"><div className="lbl">Teléfono</div><div className="ctrl">+506 0000 0000</div></div>
        <div className="wf-input field"><div className="lbl">¿Qué te trae a terapia? (opcional)</div><div className="ctrl" style={{ minHeight: 64 }}>Breve mensaje...</div></div>
        <Row gap={10} align="flex-start" style={{ paddingTop: 4 }}>
          <div style={{ width:16, height:16, borderRadius:4, background:'var(--sage-500)', display:'flex',alignItems:'center',justifyContent:'center', flexShrink: 0, marginTop: 2 }}>
            <Icon name="check" size={10} color="var(--bg)"/>
          </div>
          <Body size={12} style={{ color:'var(--ink-500)' }}>Acepto el aviso de privacidad y consentimiento informado.</Body>
        </Row>
      </Stack>
    </Pad>
    <Pad x={22} y={16}><Btn block>Confirmar reserva</Btn></Pad>
  </Frame>
);

const Reserva4 = () => (
  <Frame>
    <PhoneChrome menu={false}/>
    <Pad x={22} y={28} style={{ flex: 1 }}>
      <Stack gap={20}>
        <div style={{ width: 64, height: 64, borderRadius: 999, background: 'var(--sage-100)', display:'flex',alignItems:'center',justifyContent:'center', color:'var(--sage-700)' }}>
          <Icon name="check" size={28}/>
        </div>
        <H2 size={26}>Listo —<br/>nos vemos pronto.</H2>
        <Body>
          Te envié los detalles a tu correo. Vas a recibir un recordatorio
          24 horas antes.
        </Body>
        <div className="wf-card tinted" style={{ padding: 16 }}>
          <Stack gap={12}>
            <Row justify="space-between"><Meta>Servicio</Meta><H3 size={13}>Servicio 1</H3></Row>
            <Row justify="space-between"><Meta>Fecha</Meta><H3 size={13}>Jue 14 may · 11:00</H3></Row>
            <Row justify="space-between"><Meta>Duración</Meta><H3 size={13}>50 min</H3></Row>
            <div className="wf-divider"/>
            <Row justify="space-between"><Meta>Total</Meta><H3 size={15} style={{ color:'var(--sage-700)' }}>₡25.000</H3></Row>
          </Stack>
        </div>
        <Stack gap={10}>
          <Btn block>Agregar a calendario</Btn>
          <Btn ghost block icon={false}>Reagendar o cancelar</Btn>
        </Stack>
      </Stack>
    </Pad>
  </Frame>
);

/* Variante: una sola pantalla con todo */
const ReservaOnePage = () => (
  <Frame>
    <PhoneChrome back title="Reservar"/>
    <Pad x={22} y={10} style={{ flex: 1, overflow:'hidden' }}>
      <Stack gap={16} className="wf-scrollmask">
        <H2 size={22}>Reservar una cita</H2>
        <Stack gap={8}>
          <div className="wf-eyebrow">Servicio</div>
          <div className="wf-card" style={{ padding: 12 }}>
            <Row justify="space-between"><H3 size={13}>Servicio 1 · 50 min</H3><Meta>₡25.000 ▾</Meta></Row>
          </div>
        </Stack>
        <Stack gap={8}>
          <div className="wf-eyebrow">Fecha</div>
          <div className="wf-card" style={{ padding: 12 }}>
            <MiniCal small/>
          </div>
        </Stack>
        <Stack gap={8}>
          <div className="wf-eyebrow">Hora</div>
          <Row gap={6} style={{ flexWrap:'wrap' }}>
            {['9:00','10:00','11:00','14:00','15:00'].map((t,i) =>
              <Pill key={t} warm={i!==2} outline={i===2}>{t}</Pill>
            )}
          </Row>
        </Stack>
        <Stack gap={8}>
          <div className="wf-eyebrow">Datos</div>
          <div className="wf-input">Nombre</div>
          <div className="wf-input">Correo</div>
        </Stack>
      </Stack>
    </Pad>
    <Pad x={22} y={14}><Btn block>Reservar — ₡25.000</Btn></Pad>
  </Frame>
);

/* Variante: estilo conversacional/chat */
const ReservaChat = () => (
  <Frame style={{ background:'var(--bg-3)' }}>
    <PhoneChrome back title="Conversemos"/>
    <Pad x={22} y={10} style={{ flex: 1 }}>
      <Stack gap={14}>
        <Row gap={10} align="flex-start">
          <Photo w={32} h={32} rounded={999} label="r"/>
          <div className="wf-card" style={{ padding: 12, maxWidth: '78%' }}>
            <Body size={13}>¡Hola! Para reservar, contame qué tipo de espacio buscás.</Body>
          </div>
        </Row>
        <div style={{ alignSelf:'flex-end' }}>
          <div style={{ background:'var(--sage-500)', color:'var(--bg)', padding:'10px 14px', borderRadius: 14, fontFamily:'var(--sans)', fontSize: 13, maxWidth: 240 }}>
            Algo individual, primera vez.
          </div>
        </div>
        <Row gap={10} align="flex-start">
          <Photo w={32} h={32} rounded={999} label="r"/>
          <div className="wf-card" style={{ padding: 12, maxWidth: '78%' }}>
            <Stack gap={10}>
              <Body size={13}>Buenísimo. Te recomiendo empezar con un primer encuentro de 20 min sin costo. ¿Te calza?</Body>
              <Row gap={6} style={{ flexWrap:'wrap' }}>
                <Pill warm>Lun 11 may</Pill>
                <Pill warm>Mar 12 may</Pill>
                <Pill warm>Jue 14 may</Pill>
                <Pill outline>+ más fechas</Pill>
              </Row>
            </Stack>
          </div>
        </Row>
      </Stack>
    </Pad>
    <Pad x={22} y={14}>
      <Row gap={8} style={{ background:'#fff', borderRadius: 22, padding: '8px 14px', border:'1px solid var(--line)' }}>
        <Meta style={{ flex: 1, color: 'var(--ink-300)' }}>Escribe tu respuesta…</Meta>
        <div style={{ width:30, height:30, borderRadius:999, background:'var(--sage-500)', display:'flex',alignItems:'center',justifyContent:'center' }}>
          <Icon name="arrow" size={12} color="var(--bg)"/>
        </div>
      </Row>
    </Pad>
  </Frame>
);

Object.assign(window, { Reserva1, Reserva2, Reserva3, Reserva4, ReservaOnePage, ReservaChat });
