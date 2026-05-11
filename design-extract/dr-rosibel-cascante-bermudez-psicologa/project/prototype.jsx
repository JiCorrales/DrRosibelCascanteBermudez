// Hi-fi clickable prototype — interactive versions of the selected variants.
// Routes: landing | servicio | reservar | sobre, with working state.

const useRoute = () => {
  const [route, setRoute] = React.useState({ name: 'landing' });
  return { route, go: (name, params={}) => { setRoute({ name, ...params }); window.scrollTo?.(0,0); const el = document.getElementById('proto-scroll'); if (el) el.scrollTop = 0; } };
};

const RouteCtx = React.createContext(null);
const useGo = () => React.useContext(RouteCtx);

// ─────── HERO B (clickable) ───────
const HeroLive = () => {
  const go = useGo();
  return (
    <Frame>
      <PhoneChrome/>
      <Pad x={22} y={16} style={{ flex: 1 }}>
        <Stack gap={20}>
          <Eyebrow>Psicología clínica · San José</Eyebrow>
          <H1 size={40} style={{ lineHeight: 1.05 }}>
            Un espacio para<br/>
            <span style={{ fontStyle: 'italic', color: 'var(--sage-700)' }}>volver a vos</span>.
          </H1>
          <Body size={14}>Acompaño procesos de ansiedad, duelo, autoestima y relaciones desde una mirada cálida, ética y basada en evidencia.</Body>
          <Photo w="100%" h={220} rounded={14} label="retrato editorial"/>
          <button onClick={()=>go('reservar')} className="wf-btn block" style={{ width:'100%' }}>
            Agendar cita
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
          </button>
          <Row gap={10} justify="space-between" style={{ paddingTop: 4 }}>
            <Meta>Rosibel Cascante</Meta>
            <Meta>Cód. CPCR 0000</Meta>
          </Row>
        </Stack>
      </Pad>
    </Frame>
  );
};

// ─────── SOBRE A ───────
const SobreLive = () => {
  const go = useGo();
  return (
    <Pad x={22} y={28} style={{ background: 'var(--bg)' }}>
      <Stack gap={20}>
        <Eyebrow>01 · Sobre mí</Eyebrow>
        <H2 size={26}>Hola otra vez —<br/>te cuento un poco más.</H2>
        <Photo w="100%" h={230} rounded={14} label="foto consultorio"/>
        <Body>Soy psicóloga clínica con 10 años acompañando procesos individuales y de pareja. Mi enfoque combina la terapia cognitivo-conductual con una mirada humanista —ningún proceso es igual a otro.</Body>
        <div className="wf-card tinted" style={{ padding: 16 }}>
          <Stack gap={10}>
            {['Univ. de Costa Rica · 2015','Colegiado · CPCR 0000','Especialización en trauma · 2020'].map(t =>
              <Row gap={10} key={t}><Icon name="check" size={12} color="var(--sage-700)"/><Meta>{t}</Meta></Row>
            )}
          </Stack>
        </div>
        <button onClick={()=>go('sobre')} className="wf-btn ghost" style={{ alignSelf:'flex-start' }}>Conocer mi historia</button>
      </Stack>
    </Pad>
  );
};

// ─────── ENFOQUE A ───────
const EnfoqueLive = () => (
  <Pad x={22} y={28} style={{ background: 'var(--bg)' }}>
    <Stack gap={20}>
      <Eyebrow>02 · Cómo trabajo</Eyebrow>
      <H2 size={26}>Tres principios<br/>que guían mi práctica.</H2>
      {[
        ['01','Sin juicio','Acá no hay diagnósticos rápidos ni etiquetas. Empezamos donde estás.'],
        ['02','Basado en evidencia','Uso herramientas con respaldo: TCC, EMDR, terapia de aceptación.'],
        ['03','A tu ritmo','Las sesiones son tuyas. Avanzamos según lo que vos necesitás cada semana.'],
      ].map(([n,t,d])=>(
        <div key={n} className="wf-card" style={{ padding: 16 }}>
          <Row gap={14} align="flex-start">
            <div style={{ fontFamily:'var(--serif)', fontSize: 22, color:'var(--sage-500)', minWidth: 30 }}>{n}</div>
            <Stack gap={6}><H3 size={15}>{t}</H3><Body>{d}</Body></Stack>
          </Row>
        </div>
      ))}
    </Stack>
  </Pad>
);

// ─────── SERVICIOS A (clickable) ───────
const SERVICES = [
  { id: 1, name: 'Servicio 1', dur: 50, price: 25000, desc: 'Espacio individual para abordar lo que estás viviendo, a tu ritmo.' },
  { id: 2, name: 'Servicio 2', dur: 80, price: 40000, desc: 'Acompañamiento para parejas que quieren conversar mejor.' },
  { id: 3, name: 'Servicio 3', dur: 50, price: 25000, desc: 'Terapia adaptada para personas de 13 a 18 años.' },
  { id: 0, name: 'Primer encuentro', dur: 20, price: 0, desc: 'Sesión inicial gratuita para conocernos.' },
];

const ServiciosLive = () => {
  const go = useGo();
  return (
    <Pad x={22} y={28} style={{ background: 'var(--bg)' }}>
      <Stack gap={18}>
        <Eyebrow>03 · Servicios</Eyebrow>
        <H2 size={26}>Lo que ofrezco.</H2>
        <Body>Cada espacio está pensado para una necesidad específica. Si no sabés cuál, escribime y vemos juntos.</Body>
        <Stack gap={12}>
          {SERVICES.slice(0,3).map((s,i)=>(
            <button
              key={s.id}
              onClick={()=>go('servicio',{ serviceId: s.id })}
              style={{ all:'unset', cursor:'pointer', display:'block' }}
            >
              <div className="wf-card" style={{ padding: 16 }}>
                <Stack gap={10}>
                  <Row justify="space-between">
                    <Pill outline>{`0${i+1}`}</Pill>
                    <Meta>{s.dur} min</Meta>
                  </Row>
                  <H3 size={17}>{s.name}</H3>
                  <Body size={13}>{s.desc}</Body>
                  <Row justify="space-between" align="center" style={{ marginTop: 6 }}>
                    <H3 size={18} style={{ color: 'var(--sage-700)' }}>₡{s.price.toLocaleString('es-CR')}</H3>
                    <span className="wf-btn small" onClick={(e)=>{e.stopPropagation(); go('reservar',{ preService: s.id });}}>Reservar</span>
                  </Row>
                </Stack>
              </div>
            </button>
          ))}
        </Stack>
        <button className="wf-btn ghost" onClick={()=>go('servicios')}>Ver todos los servicios</button>
      </Stack>
    </Pad>
  );
};

// ─────── SITUACIONES C ───────
const SITS = ['Ansiedad','Duelo','Pareja','Autoestima','Estrés laboral','Familia','Cambios de vida','Trauma','Identidad'];
const SituacionesLive = () => (
  <Pad x={22} y={28} style={{ background: 'var(--bg)' }}>
    <Stack gap={16}>
      <Eyebrow>04 · Qué trabajamos</Eyebrow>
      <H2 size={24}>9 razones por las que<br/>la gente llega.</H2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10 }}>
        {SITS.map((s,i)=>(
          <div key={s} className="wf-card" style={{ padding: '14px 12px', textAlign:'center' }}>
            <Stack gap={6}>
              <div style={{ color:'var(--sage-500)' }}>
                <Icon name={['heart','leaf','users','star','clock','home','user','bookmark','eye'][i]} size={18}/>
              </div>
              <H3 size={13}>{s}</H3>
            </Stack>
          </div>
        ))}
      </div>
    </Stack>
  </Pad>
);

// ─────── TESTIMONIOS A (clickable pagination) ───────
const TESTIMS = [
  ['Fue la primera vez que me sentí escuchada de verdad. Rosibel sostuvo lo que yo no podía cargar sola, y me ayudó a encontrar mis propias respuestas. Hoy estoy en un lugar muy distinto.','María, 32','3 meses en proceso'],
  ['Llegué con muchas dudas y miedo. Salir de cada sesión me deja más liviano. No se trata de respuestas — se trata de hacer mejores preguntas.','Andrés, 41','6 meses en proceso'],
  ['Cuando perdí a mi mamá no sabía cómo seguir. El acompañamiento de Rosibel me permitió atravesar el duelo sin perder el piso.','Laura, 29','1 año en proceso'],
  ['Empezamos como pareja con la sensación de que ya no nos entendíamos. Hoy hablamos distinto. Vale la pena.','Pareja A','5 meses'],
];
const TestimoniosLive = () => {
  const [i, setI] = React.useState(0);
  const [t, who, when] = TESTIMS[i];
  return (
    <Pad x={22} y={28} style={{ background: 'var(--bg)' }}>
      <Stack gap={18}>
        <Eyebrow>05 · Testimonios</Eyebrow>
        <H2 size={24}>Lo que dicen quienes<br/>pasaron por acá.</H2>
        <div className="wf-card tinted" style={{ padding: 20, minHeight: 230 }}>
          <Stack gap={14}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 28, color:'var(--sage-300)', lineHeight:0.5 }}>"</div>
            <Body size={14}>{t}</Body>
            <Row gap={10}>
              <Photo w={36} h={36} rounded={999} label=""/>
              <Stack gap={2}><H3 size={13}>{who}</H3><Meta>{when}</Meta></Stack>
            </Row>
          </Stack>
        </div>
        <Row gap={6} justify="center">
          {TESTIMS.map((_,j) => (
            <button key={j} onClick={()=>setI(j)} style={{ background: 'none', border:0, padding: 4, cursor:'pointer' }}>
              <div style={{ width: i===j?20:6, height:6, borderRadius:999, background: i===j?'var(--sage-500)':'var(--sage-300)', transition: '.2s' }}/>
            </button>
          ))}
        </Row>
      </Stack>
    </Pad>
  );
};

// ─────── FAQ A (working accordion) ───────
const FAQS = [
  ['¿Cuánto dura una sesión?','Las sesiones individuales son de 50 minutos. Las de pareja, 80 min. Las primeras sesiones tienden a sentirse más largas porque hay mucho por contar — eso es normal.'],
  ['¿Atendés en línea o presencial?','Ambos. Podés elegir según lo que te quede mejor o alternar semana a semana. La videollamada se hace por una plataforma segura, sin necesidad de instalar nada.'],
  ['¿Cómo se paga?','SINPE Móvil, transferencia bancaria o tarjeta al momento de reservar. Se cobra al confirmar la cita; si necesitás reagendar, el monto se mantiene.'],
  ['¿Qué pasa si no puedo asistir?','Podés reagendar o cancelar hasta 24 horas antes desde el link que recibís por correo, sin penalidad.'],
  ['¿Cuánta gente sabe lo que conversamos?','Nadie más que yo. Todo lo que hablamos es estrictamente confidencial, salvo riesgo vital — y eso lo conversaríamos primero.'],
];
const FAQLive = () => {
  const [open, setOpen] = React.useState(0);
  return (
    <Pad x={22} y={28} style={{ background: 'var(--bg)' }}>
      <Stack gap={16}>
        <Eyebrow>06 · Preguntas frecuentes</Eyebrow>
        <H2 size={26}>Lo que la gente<br/>suele preguntar.</H2>
        <Stack gap={0}>
          {FAQS.map(([q,a],i)=>(
            <div key={i} style={{ borderBottom: '1px solid var(--line)' }}>
              <button
                onClick={()=>setOpen(open===i?-1:i)}
                style={{ all:'unset', cursor:'pointer', display:'block', width:'100%', padding: '16px 0' }}
              >
                <Row justify="space-between" align="center">
                  <H3 size={14} style={{ flex: 1, paddingRight: 12 }}>{q}</H3>
                  <div style={{ transform: open===i?'rotate(45deg)':'rotate(0)', transition: '.2s', color:'var(--ink-500)' }}>
                    <Icon name="plus" size={14}/>
                  </div>
                </Row>
              </button>
              {open===i && (
                <div style={{ padding: '0 0 18px' }}>
                  <Body size={13}>{a}</Body>
                </div>
              )}
            </div>
          ))}
        </Stack>
      </Stack>
    </Pad>
  );
};

// ─────── CTA A ───────
const CtaLive = () => {
  const go = useGo();
  return (
    <Pad x={22} y={36} style={{ background:'var(--sage-500)' }}>
      <Stack gap={20}>
        <Eyebrow style={{ color:'var(--sage-100)' }}>Empezar</Eyebrow>
        <H2 size={32} style={{ color:'var(--bg)' }}>¿Listo para<br/>dar el primer paso?</H2>
        <Body size={14} style={{ color:'var(--sage-100)' }}>
          Reservá una primera sesión de 20 minutos sin costo y vemos si encajamos.
        </Body>
        <button onClick={()=>go('reservar',{ preService: 0 })} className="wf-btn" style={{ background:'var(--bg)', color:'var(--sage-700)' }}>
          Agendar ahora
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
        </button>
        <div style={{ height: 1, background:'rgba(255,255,255,0.2)' }}/>
        <Stack gap={10}>
          <Row gap={10} style={{ color:'var(--sage-100)' }}><Icon name="mail" size={12}/><Meta style={{ color:'var(--sage-100)' }}>hola@rosibelpsicologa.cr</Meta></Row>
          <Row gap={10} style={{ color:'var(--sage-100)' }}><Icon name="phone" size={12}/><Meta style={{ color:'var(--sage-100)' }}>+506 0000 0000</Meta></Row>
        </Stack>
      </Stack>
    </Pad>
  );
};

// ─────── FOOTER A (clickable nav) ───────
const FooterLive = () => {
  const go = useGo();
  return (
    <Pad x={22} y={28} style={{ background:'var(--ink-900)' }}>
      <Stack gap={18}>
        <Row gap={10} align="center">
          <div style={{ width: 28, height: 28, borderRadius:999, background:'var(--sage-300)' }}/>
          <H3 size={16} style={{ color:'var(--bg)' }}>rosibel cascante</H3>
        </Row>
        <Body style={{ color:'rgba(232,225,210,0.7)' }}>Psicología clínica · San José, Costa Rica</Body>
        <div style={{ height: 1, background:'rgba(255,255,255,0.12)' }}/>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 14 }}>
          {[['Inicio','landing'],['Servicios','servicios'],['Sobre mí','sobre'],['Reservar','reservar'],['FAQ','landing'],['Contacto','landing']].map(([l,r]) =>
            <button key={l} onClick={()=>go(r)} style={{ all:'unset', cursor:'pointer', fontFamily:'var(--sans)', fontSize: 12, color:'rgba(232,225,210,0.7)', textAlign:'left' }}>{l}</button>
          )}
        </div>
        <div style={{ height: 1, background:'rgba(255,255,255,0.12)' }}/>
        <Row justify="space-between">
          <Meta style={{ color:'rgba(232,225,210,0.5)' }}>© 2026</Meta>
          <Meta style={{ color:'rgba(232,225,210,0.5)' }}>Privacidad · Términos</Meta>
        </Row>
      </Stack>
    </Pad>
  );
};

// ─────── LANDING (composed) ───────
const Landing = () => (
  <>
    <HeroLive/>
    <SobreLive/>
    <EnfoqueLive/>
    <ServiciosLive/>
    <SituacionesLive/>
    <TestimoniosLive/>
    <FAQLive/>
    <CtaLive/>
    <FooterLive/>
  </>
);

// ─────── /servicios/[slug] ───────
const ServicioPage = ({ serviceId = 1 }) => {
  const go = useGo();
  const s = SERVICES.find(x => x.id === serviceId) || SERVICES[0];
  return (
    <Frame>
      <PhoneChrome back title="Servicios" menu={false}/>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Pad x={22} y={6}>
          <Stack gap={16}>
            <Eyebrow>Servicio</Eyebrow>
            <H1 size={28}>{s.name}</H1>
            <Row gap={8}>
              <Pill warm>{s.dur} min</Pill>
              <Pill warm>{s.price ? `₡${s.price.toLocaleString('es-CR')}` : 'Gratis'}</Pill>
              <Pill warm>Online / presencial</Pill>
            </Row>
            <Photo w="100%" h={180} rounded={14} label="ambiente consultorio"/>
            <Stack gap={10}>
              <H3 size={15}>¿De qué se trata?</H3>
              <Body>{s.desc} Trabajamos a tu ritmo, en un ambiente sin juicio, con sesiones {s.dur === 80 ? 'quincenales' : 'semanales'} de {s.dur} min.</Body>
            </Stack>
            <div className="wf-divider"/>
            <Stack gap={10}>
              <H3 size={15}>Para vos si...</H3>
              <Stack gap={8}>
                {['sentís ansiedad o estrés persistente','estás atravesando un cambio importante','querés conocerte mejor'].map(t =>
                  <Row gap={10} key={t}><Icon name="check" size={12} color="var(--sage-700)"/><Body size={13}>{t}</Body></Row>
                )}
              </Stack>
            </Stack>
            <div className="wf-divider"/>
            <Stack gap={10}>
              <H3 size={15}>Cómo funciona</H3>
              <Body size={13}>Sesiones de {s.dur} min. Reservás por la web, te confirmo por correo y nos vemos. Podés reagendar hasta 24h antes sin penalidad.</Body>
            </Stack>
            <div style={{ height: 60 }}/>
          </Stack>
        </Pad>
      </div>
      <Pad x={22} y={16} style={{ borderTop: '1px solid var(--line)', background:'var(--bg)', flexShrink: 0 }}>
        <Row justify="space-between" align="center">
          <Stack gap={2}>
            <Meta>Desde</Meta>
            <H3 size={18} style={{ color:'var(--sage-700)' }}>{s.price ? `₡${s.price.toLocaleString('es-CR')}` : 'Gratis'}</H3>
          </Stack>
          <button onClick={()=>go('reservar',{ preService: s.id })} className="wf-btn">
            Reservar
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
          </button>
        </Row>
      </Pad>
    </Frame>
  );
};

// ─────── /reservar (working wizard) ───────
const TIMES = ['9:00','10:00','11:00','14:00','15:00','16:00'];
const Reservar = ({ preService }) => {
  const go = useGo();
  const [step, setStep] = React.useState(1);
  const [svc, setSvc] = React.useState(preService ?? 1);
  const [day, setDay] = React.useState(14);
  const [time, setTime] = React.useState(2);
  const [form, setForm] = React.useState({ name:'', email:'', phone:'', msg:'', consent: false });
  const service = SERVICES.find(s => s.id === svc);
  const canNext = step===1 ? svc!=null : step===2 ? (day!=null && time!=null) : step===3 ? (form.name && form.email && form.phone && form.consent) : true;

  const Header = () => (
    <Pad x={22} y={14} style={{ flexShrink: 0 }}>
      <Stack gap={10}>
        <Row justify="space-between" align="center">
          <Meta>Reserva</Meta>
          <Meta>{step} de 4</Meta>
        </Row>
        <Row gap={4}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= step ? 'var(--sage-500)' : 'var(--line)' }}/>
          ))}
        </Row>
        <H2 size={22} style={{ paddingTop: 6 }}>{
          step===1 ? '¿Qué servicio querés reservar?' :
          step===2 ? 'Elegí día y hora' :
          step===3 ? 'Tus datos' : ''
        }</H2>
      </Stack>
    </Pad>
  );

  if (step === 4) {
    return (
      <Frame>
        <PhoneChrome menu={false}/>
        <div style={{ flex: 1, overflowY:'auto' }}>
          <Pad x={22} y={28}>
            <Stack gap={20}>
              <div style={{ width: 64, height: 64, borderRadius: 999, background: 'var(--sage-100)', display:'flex',alignItems:'center',justifyContent:'center', color:'var(--sage-700)' }}>
                <Icon name="check" size={28}/>
              </div>
              <H2 size={26}>Listo —<br/>nos vemos pronto.</H2>
              <Body>Te envié los detalles a <strong>{form.email || 'tu correo'}</strong>. Vas a recibir un recordatorio 24 horas antes.</Body>
              <div className="wf-card tinted" style={{ padding: 16 }}>
                <Stack gap={12}>
                  <Row justify="space-between"><Meta>Servicio</Meta><H3 size={13}>{service.name}</H3></Row>
                  <Row justify="space-between"><Meta>Fecha</Meta><H3 size={13}>{`Jue ${day} may · ${TIMES[time]}`}</H3></Row>
                  <Row justify="space-between"><Meta>Duración</Meta><H3 size={13}>{service.dur} min</H3></Row>
                  <div className="wf-divider"/>
                  <Row justify="space-between"><Meta>Total</Meta><H3 size={15} style={{ color:'var(--sage-700)' }}>{service.price ? `₡${service.price.toLocaleString('es-CR')}` : 'Gratis'}</H3></Row>
                </Stack>
              </div>
              <Stack gap={10}>
                <button className="wf-btn block" style={{ width:'100%' }}>Agregar a calendario</button>
                <button className="wf-btn ghost block" style={{ width:'100%' }} onClick={()=>go('landing')}>Volver al inicio</button>
              </Stack>
            </Stack>
          </Pad>
        </div>
      </Frame>
    );
  }

  return (
    <Frame>
      <div style={{ flexShrink: 0 }}>
        <PhoneChrome menu={false}/>
        <div className="wf-nav" style={{ paddingTop: 0 }}>
          <button onClick={()=> step===1 ? go('landing') : setStep(step-1)} style={{ all:'unset', cursor:'pointer', display:'flex', alignItems:'center', gap:8, fontSize:13, color:'var(--ink-700)' }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M10 3l-5 5 5 5"/></svg>
            {step===1?'Volver al inicio':'Atrás'}
          </button>
        </div>
      </div>
      <Header/>

      <div style={{ flex: 1, overflowY:'auto' }}>
        <Pad x={22} y={6}>
          {step === 1 && (
            <Stack gap={10}>
              {SERVICES.map(s => {
                const sel = svc === s.id;
                return (
                  <button key={s.id} onClick={()=>setSvc(s.id)} style={{ all:'unset', cursor:'pointer', display:'block' }}>
                    <div className={`wf-card ${sel?'sage':''}`} style={{ padding: 14, borderColor: sel?'var(--sage-500)':'var(--line)', borderWidth: sel?2:1, borderStyle:'solid', borderRadius: 14, background: sel?'var(--sage-100)':'#fff' }}>
                      <Row justify="space-between" align="center">
                        <Stack gap={4}>
                          <H3 size={14}>{s.name}</H3>
                          <Meta>{s.dur} min</Meta>
                        </Stack>
                        <Stack gap={2} style={{ alignItems: 'flex-end' }}>
                          <H3 size={14} style={{ color:'var(--sage-700)' }}>{s.price ? `₡${s.price.toLocaleString('es-CR')}` : 'Gratis'}</H3>
                          <div style={{ width:18, height:18, borderRadius:999, border:'1.5px solid var(--sage-500)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            {sel && <div style={{ width:10, height:10, borderRadius:999, background:'var(--sage-500)' }}/>}
                          </div>
                        </Stack>
                      </Row>
                    </div>
                  </button>
                );
              })}
            </Stack>
          )}

          {step === 2 && (
            <Stack gap={16}>
              <div className="wf-card" style={{ padding: 14 }}>
                <CalPicker day={day} setDay={setDay}/>
              </div>
              <Stack gap={8}>
                <Row justify="space-between" align="center">
                  <H3 size={14}>{`Jueves ${day} de mayo`}</H3>
                  <Meta>{TIMES.length} horarios</Meta>
                </Row>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 8 }}>
                  {TIMES.map((t,i) => (
                    <button key={t} onClick={()=>setTime(i)} style={{ all:'unset', cursor:'pointer' }}>
                      <div className="wf-card" style={{ padding: '12px 8px', textAlign:'center', background: i===time?'var(--sage-500)':'#fff', color: i===time?'var(--bg)':'var(--ink-700)', borderColor: i===time?'var(--sage-500)':'var(--line)' }}>
                        <H3 size={13} style={{ color:'inherit' }}>{t}</H3>
                      </div>
                    </button>
                  ))}
                </div>
              </Stack>
            </Stack>
          )}

          {step === 3 && (
            <Stack gap={12}>
              <div className="wf-card tinted" style={{ padding: 12 }}>
                <Row gap={10} align="center">
                  <Icon name="cal" size={14} color="var(--sage-700)"/>
                  <Stack gap={2}>
                    <H3 size={13}>{service.name} · Jue {day} may · {TIMES[time]}</H3>
                    <Meta>{service.dur} min · {service.price ? `₡${service.price.toLocaleString('es-CR')}` : 'Gratis'}</Meta>
                  </Stack>
                </Row>
              </div>
              {[
                ['name','Nombre completo','Tu nombre'],
                ['email','Correo','correo@dominio.com'],
                ['phone','Teléfono','+506 0000 0000'],
              ].map(([k,l,ph])=>(
                <Stack gap={6} key={k}>
                  <div className="wf-eyebrow" style={{ fontSize:11, color:'var(--ink-500)' }}>{l}</div>
                  <input
                    value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}
                    placeholder={ph}
                    style={{ background:'#fff', border:'1px solid var(--line-2)', borderRadius:'var(--r-md)', padding:'10px 12px', fontSize:13, fontFamily:'var(--sans)', color:'var(--ink-900)', outline:'none' }}
                  />
                </Stack>
              ))}
              <Stack gap={6}>
                <div className="wf-eyebrow" style={{ fontSize:11, color:'var(--ink-500)' }}>¿Qué te trae a terapia? (opcional)</div>
                <textarea
                  value={form.msg} onChange={e=>setForm({...form,msg:e.target.value})}
                  placeholder="Breve mensaje..."
                  style={{ background:'#fff', border:'1px solid var(--line-2)', borderRadius:'var(--r-md)', padding:'10px 12px', fontSize:13, fontFamily:'var(--sans)', color:'var(--ink-900)', minHeight: 64, resize:'vertical', outline:'none' }}
                />
              </Stack>
              <button onClick={()=>setForm({...form,consent:!form.consent})} style={{ all:'unset', cursor:'pointer' }}>
                <Row gap={10} align="flex-start" style={{ paddingTop: 4 }}>
                  <div style={{ width:16, height:16, borderRadius:4, background: form.consent?'var(--sage-500)':'#fff', border: form.consent?'0':'1.5px solid var(--line-2)', display:'flex',alignItems:'center',justifyContent:'center', flexShrink: 0, marginTop: 2 }}>
                    {form.consent && <Icon name="check" size={10} color="var(--bg)"/>}
                  </div>
                  <Body size={12} style={{ color:'var(--ink-500)' }}>Acepto el aviso de privacidad y consentimiento informado.</Body>
                </Row>
              </button>
            </Stack>
          )}
          <div style={{ height: 24 }}/>
        </Pad>
      </div>

      <Pad x={22} y={16} style={{ flexShrink: 0, borderTop:'1px solid var(--line)' }}>
        <button
          disabled={!canNext}
          onClick={()=>setStep(step+1)}
          className="wf-btn block"
          style={{ width:'100%', opacity: canNext?1:0.5, cursor: canNext?'pointer':'not-allowed' }}
        >
          {step===3 ? 'Confirmar reserva' : 'Continuar'}
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
        </button>
      </Pad>
    </Frame>
  );
};

// Interactive cal picker
const CalPicker = ({ day, setDay }) => {
  const avail = [12, 13, 14, 15, 19, 20, 21, 26, 27, 28];
  const days = ['L','M','M','J','V','S','D'];
  const start = 4, total = 31;
  const cells = [];
  for (let i=0;i<start;i++) cells.push(<div key={'p'+i} className="cell muted"></div>);
  for (let d=1; d<=total; d++) {
    const isAvail = avail.includes(d);
    const isSel = d === day;
    let cls = 'cell';
    if (isSel) cls = 'cell sel';
    else if (isAvail) cls = 'cell avail';
    else if (d <= 10) cls = 'cell muted';
    else cls = 'cell muted';
    cells.push(
      <button
        key={d}
        disabled={!isAvail}
        onClick={()=>setDay(d)}
        className={cls}
        style={{ all:'unset', cursor: isAvail?'pointer':'default' }}
      >
        <span style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>{d}</span>
      </button>
    );
  }
  // restore class names without losing them under all:unset
  return (
    <div>
      <Row justify="space-between" style={{ marginBottom: 10 }}>
        <button style={{ background:'transparent', border:0, padding:4, cursor:'pointer', color:'var(--ink-500)' }}><Icon name="back"/></button>
        <div style={{ fontFamily:'var(--serif)', fontSize:14, color:'var(--ink-900)' }}>Mayo 2026</div>
        <button style={{ background:'transparent', border:0, padding:4, cursor:'pointer', color:'var(--ink-500)', transform:'rotate(180deg)' }}><Icon name="back"/></button>
      </Row>
      <div className="wf-cal-head">{days.map((d,i) => <span key={i}>{d}</span>)}</div>
      <div className="wf-cal-grid" style={{ fontSize: 11 }}>
        {Array.from({length:start}).map((_,i)=><div key={'pad'+i} className="cell muted"></div>)}
        {Array.from({length:total}).map((_,i) => {
          const d = i+1;
          const isAvail = avail.includes(d);
          const isSel = d === day;
          let cls = 'cell';
          if (isSel) cls = 'cell sel';
          else if (isAvail) cls = 'cell avail';
          else cls = 'cell muted';
          return (
            <div
              key={d}
              className={cls}
              onClick={isAvail?()=>setDay(d):undefined}
              style={{ cursor: isAvail?'pointer':'default' }}
            >{d}</div>
          );
        })}
      </div>
    </div>
  );
};

// ─────── /sobre ───────
const SobrePage = () => {
  const go = useGo();
  return (
    <Frame>
      <PhoneChrome back title="" menu={false}/>
      <div style={{ flex: 1, overflowY:'auto' }}>
        <Pad x={22} y={6}>
          <Stack gap={18}>
            <Eyebrow>Sobre la doctora</Eyebrow>
            <H1 size={28}>Rosibel<br/>Cascante Bermúdez.</H1>
            <Photo w="100%" h={260} rounded={14} label="retrato extendido"/>
            <Body>
              Soy psicóloga clínica costarricense, graduada de la Universidad de
              Costa Rica en 2015. Desde 2016 tengo consultorio propio en San Pedro
              y atiendo a adolescentes y adultos, en español e inglés.
            </Body>
            <div className="wf-divider"/>
            <Stack gap={12}>
              <H3 size={15}>Formación</H3>
              {[
                ['2015','Licenciatura en Psicología, UCR'],
                ['2018','Maestría en Psicología Clínica'],
                ['2020','Especialización en trauma — Madrid'],
              ].map(([y,t])=>(
                <Row gap={14} key={y}>
                  <H3 size={13} style={{ color:'var(--sage-700)', minWidth: 36 }}>{y}</H3>
                  <Body size={13}>{t}</Body>
                </Row>
              ))}
            </Stack>
            <div className="wf-divider"/>
            <Stack gap={10}>
              <H3 size={15}>Códigos profesionales</H3>
              <Meta>Colegio Profesional de Psicólogos de Costa Rica · 0000</Meta>
            </Stack>
            <button onClick={()=>go('reservar')} className="wf-btn block" style={{ width:'100%' }}>
              Agendar una cita
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
            </button>
            <div style={{ height: 16 }}/>
          </Stack>
        </Pad>
      </div>
    </Frame>
  );
};

// ─────── /servicios (listado) ───────
const ServiciosList = () => {
  const go = useGo();
  return (
    <Frame>
      <PhoneChrome back title="Servicios" menu={false}/>
      <div style={{ flex: 1, overflowY:'auto' }}>
        <Pad x={22} y={6}>
          <Stack gap={16}>
            <H1 size={28}>Todos los servicios</H1>
            <Body>Cada espacio está pensado para una necesidad. Tocá uno para ver el detalle.</Body>
            <Stack gap={12}>
              {SERVICES.map((s,i)=>(
                <button key={s.id} onClick={()=>go('servicio',{ serviceId: s.id })} style={{ all:'unset', cursor:'pointer', display:'block' }}>
                  <div className="wf-card" style={{ padding: 16 }}>
                    <Stack gap={10}>
                      <Row justify="space-between">
                        <Pill outline>{`0${i+1}`}</Pill>
                        <Meta>{s.dur} min</Meta>
                      </Row>
                      <H3 size={17}>{s.name}</H3>
                      <Body size={13}>{s.desc}</Body>
                      <Row justify="space-between" align="center" style={{ marginTop: 6 }}>
                        <H3 size={18} style={{ color: 'var(--sage-700)' }}>{s.price ? `₡${s.price.toLocaleString('es-CR')}` : 'Gratis'}</H3>
                        <Icon name="arrow" size={14} color="var(--sage-700)"/>
                      </Row>
                    </Stack>
                  </div>
                </button>
              ))}
            </Stack>
          </Stack>
        </Pad>
      </div>
    </Frame>
  );
};

// ─────── ROOT ───────
const Proto = () => {
  const { route, go } = useRoute();
  let screen;
  switch (route.name) {
    case 'servicio':  screen = <ServicioPage serviceId={route.serviceId}/>; break;
    case 'servicios': screen = <ServiciosList/>; break;
    case 'reservar':  screen = <Reservar preService={route.preService}/>; break;
    case 'sobre':     screen = <SobrePage/>; break;
    default:
      screen = (
        <Frame>
          <div style={{ flex: 1, overflowY:'auto' }} id="proto-scroll">
            <Landing/>
          </div>
        </Frame>
      );
  }
  return <RouteCtx.Provider value={go}>{screen}</RouteCtx.Provider>;
};

Object.assign(window, { Proto });
