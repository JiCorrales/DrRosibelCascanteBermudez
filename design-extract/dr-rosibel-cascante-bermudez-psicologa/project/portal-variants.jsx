// Portal paciente — Fase 2. Mobile.

const PortalLogin = () => (
  <Frame>
    <PhoneChrome menu={false}/>
    <Pad x={22} y={28} style={{ flex: 1, display:'flex', flexDirection:'column', justifyContent:'center' }}>
      <Stack gap={20}>
        <div style={{ width: 56, height: 56, borderRadius: 999, background: 'var(--sage-500)', margin: '0 auto' }}/>
        <Stack gap={6} style={{ textAlign:'center' }}>
          <H1 size={26}>Bienvenido</H1>
          <Meta>Tu espacio personal con Rosibel</Meta>
        </Stack>
        <Stack gap={12}>
          <div className="wf-input field"><div className="lbl">Correo</div><div className="ctrl">tu@correo.com</div></div>
          <div className="wf-input field"><div className="lbl">Contraseña</div><div className="ctrl">••••••••</div></div>
        </Stack>
        <Btn block>Entrar</Btn>
        <Meta style={{ textAlign:'center', color:'var(--ink-500)' }}>¿Primera vez? Pedile a Rosibel tu invitación.</Meta>
      </Stack>
    </Pad>
  </Frame>
);

const PortalHome = () => (
  <Frame>
    <PhoneChrome/>
    <Pad x={22} y={10} style={{ flex: 1, overflow:'hidden' }}>
      <Stack gap={18}>
        <Stack gap={4}>
          <Meta>Hola, María</Meta>
          <H1 size={26}>Buenas tardes.</H1>
        </Stack>
        <div className="wf-card sage" style={{ padding: 16 }}>
          <Stack gap={10}>
            <Eyebrow style={{ color:'var(--sage-700)' }}>Próxima cita</Eyebrow>
            <H3 size={18}>Jue 14 may · 11:00</H3>
            <Meta>Servicio 1 · 50 min</Meta>
            <Row gap={8} style={{ marginTop: 4 }}>
              <Btn small icon={false}>Unirme online</Btn>
              <Btn small ghost icon={false}>Reagendar</Btn>
            </Row>
          </Stack>
        </div>
        <Stack gap={10}>
          <H3 size={15}>Tus tareas</H3>
          <Stack gap={8}>
            {[
              ['Registro emocional diario','Asignado lunes','Pendiente'],
              ['Lectura: ansiedad y respiración','3 días atrás','En progreso'],
              ['Ejercicio de gratitud','Semana pasada','Completado'],
            ].map(([t,d,s],i) => (
              <div key={i} className="wf-card" style={{ padding: 14 }}>
                <Row justify="space-between" align="center">
                  <Row gap={10} align="flex-start">
                    <div style={{ width:16, height:16, borderRadius: 4, border: '1.5px solid var(--sage-500)', background: s==='Completado'?'var(--sage-500)':'transparent', display:'flex',alignItems:'center',justifyContent:'center', marginTop: 2 }}>
                      {s==='Completado' && <Icon name="check" size={10} color="var(--bg)"/>}
                    </div>
                    <Stack gap={2}>
                      <H3 size={13} style={{ textDecoration: s==='Completado'?'line-through':'none', color: s==='Completado'?'var(--ink-300)':'var(--ink-900)' }}>{t}</H3>
                      <Meta>{d}</Meta>
                    </Stack>
                  </Row>
                </Row>
              </div>
            ))}
          </Stack>
        </Stack>
        <Stack gap={10}>
          <Row justify="space-between"><H3 size={15}>Tus documentos</H3><Meta>Ver todo →</Meta></Row>
          <Row gap={10}>
            {['Consentimiento','Guía intro','Plan'].map(t => (
              <div key={t} className="wf-card" style={{ padding: 12, flex: 1, textAlign:'center' }}>
                <Stack gap={6} style={{ alignItems:'center' }}>
                  <Icon name="doc" size={16} color="var(--sage-700)"/>
                  <Meta>{t}</Meta>
                </Stack>
              </div>
            ))}
          </Row>
        </Stack>
      </Stack>
    </Pad>
    <Row justify="space-around" style={{ padding: '12px 14px', borderTop: '1px solid var(--line)', background:'#fff' }}>
      {[['home','Inicio',true],['cal','Citas',false],['check','Tareas',false],['chat','Mensajes',false]].map(([ic,l,act])=>(
        <Stack gap={3} key={l} style={{ alignItems:'center', color: act?'var(--sage-700)':'var(--ink-300)' }}>
          <Icon name={ic} size={16}/>
          <span style={{ fontSize: 9, fontFamily:'var(--sans)' }}>{l}</span>
        </Stack>
      ))}
    </Row>
  </Frame>
);

const PortalTasks = () => (
  <Frame>
    <PhoneChrome back title="Mis tareas"/>
    <Pad x={22} y={6} style={{ flex: 1, overflow:'hidden' }}>
      <Stack gap={14}>
        <Row gap={8}>
          {['Activas','Esta semana','Completadas'].map((t,i)=><Pill key={t} outline={i!==0}>{t}</Pill>)}
        </Row>
        <Stack gap={10}>
          {[
            ['Registro emocional diario','Anotar 3 emociones cada noche antes de dormir.','Asignado lun · 1/7 días'],
            ['Lectura: ansiedad y respiración','PDF de 4 páginas con un ejercicio guiado al final.','3 días atrás'],
            ['Ejercicio de raíz física','Caminata de 10 min sin teléfono.','Semana pasada'],
          ].map(([t,d,m],i) => (
            <div key={i} className="wf-card" style={{ padding: 16 }}>
              <Stack gap={8}>
                <Row gap={10}>
                  <div style={{ width:14, height:14, borderRadius: 4, border: '1.5px solid var(--sage-500)', marginTop: 4 }}/>
                  <Stack gap={4} style={{ flex: 1 }}>
                    <H3 size={14}>{t}</H3>
                    <Body size={12}>{d}</Body>
                    <Meta style={{ paddingTop: 4 }}>{m}</Meta>
                  </Stack>
                </Row>
                {i===0 && (
                  <Row gap={4} style={{ paddingLeft: 24 }}>
                    {[1,1,1,1,0,0,0].map((on,j)=><div key={j} style={{ flex:1, height: 6, borderRadius: 2, background: on?'var(--sage-500)':'var(--sage-100)' }}/>)}
                  </Row>
                )}
              </Stack>
            </div>
          ))}
        </Stack>
      </Stack>
    </Pad>
  </Frame>
);

const PortalAppts = () => (
  <Frame>
    <PhoneChrome back title="Mis citas"/>
    <Pad x={22} y={6} style={{ flex: 1, overflow:'hidden' }}>
      <Stack gap={16}>
        <Row gap={8}>
          {['Próximas','Pasadas'].map((t,i)=><Pill key={t} outline={i!==0}>{t}</Pill>)}
        </Row>
        <Stack gap={12}>
          {[
            ['Jue 14 may','11:00','Servicio 1','Online','Confirmada'],
            ['Jue 21 may','11:00','Servicio 1','Online','Confirmada'],
            ['Jue 28 may','11:00','Servicio 1','Presencial','Por confirmar'],
          ].map(([d,h,s,m,st],i)=>(
            <div key={i} className={`wf-card ${i===0?'sage':''}`} style={{ padding: 16 }}>
              <Stack gap={10}>
                <Row justify="space-between" align="flex-start">
                  <Stack gap={4}>
                    <H3 size={15}>{d} · {h}</H3>
                    <Meta>{s} · 50 min</Meta>
                  </Stack>
                  <Pill outline={st!=='Confirmada'}>{st}</Pill>
                </Row>
                <Row gap={6}><Icon name="location" size={11} color="var(--ink-500)"/><Meta>{m}</Meta></Row>
                <div className="wf-divider"/>
                <Row gap={10}>
                  <Btn small ghost icon={false}>Reagendar</Btn>
                  <Btn small ghost icon={false}>Cancelar</Btn>
                </Row>
              </Stack>
            </div>
          ))}
        </Stack>
        <Btn block ghost icon={false}>+ Reservar nueva cita</Btn>
      </Stack>
    </Pad>
  </Frame>
);

const PortalDocs = () => (
  <Frame>
    <PhoneChrome back title="Documentos"/>
    <Pad x={22} y={6} style={{ flex: 1, overflow:'hidden' }}>
      <Stack gap={14}>
        <Meta>Documentos compartidos por Rosibel</Meta>
        <Stack gap={10}>
          {[
            ['Consentimiento informado','PDF · firmado 12 mar 2025'],
            ['Guía para la primera sesión','PDF · 4 págs'],
            ['Plan de trabajo · trimestre 1','PDF · 2 págs'],
            ['Audio: respiración guiada','Audio · 8 min'],
            ['Diario de emociones (plantilla)','PDF · 1 pág'],
          ].map(([t,m],i)=>(
            <div key={i} className="wf-card" style={{ padding: 14 }}>
              <Row gap={12} align="center">
                <div style={{ width: 38, height: 38, borderRadius: 8, background:'var(--sage-100)', display:'flex',alignItems:'center',justifyContent:'center', color:'var(--sage-700)' }}>
                  <Icon name="doc" size={16}/>
                </div>
                <Stack gap={2} style={{ flex: 1 }}>
                  <H3 size={13}>{t}</H3>
                  <Meta>{m}</Meta>
                </Stack>
                <Icon name="arrow" size={12} color="var(--ink-500)"/>
              </Row>
            </div>
          ))}
        </Stack>
      </Stack>
    </Pad>
  </Frame>
);

Object.assign(window, { PortalLogin, PortalHome, PortalTasks, PortalAppts, PortalDocs });
