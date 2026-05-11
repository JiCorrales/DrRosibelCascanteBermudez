// LANDING variants — each section in 3 takes.
// All mobile (390 wide). Heights vary by section.

/* ─────────── HERO (3) ─────────── */

const HeroA = () => (
  <Frame>
    <PhoneChrome />
    <Pad x={22} y={20} style={{ flex: 1 }}>
      <Stack gap={18}>
        <Row gap={14} align="center">
          <Photo w={72} h={72} rounded={999} label="rosibel" />
          <Stack gap={4}>
            <Pill warm dot>Disponible esta semana</Pill>
          </Stack>
        </Row>
        <H1 size={28}>Hola, soy<br/>Rosibel.</H1>
        <div className="wf-eyebrow" style={{ color: 'var(--ink-300)' }}>Psicóloga clínica · 10 años</div>
        <Body>
          Sé que dar el primer paso puede sentirse difícil. Acá vas a encontrar
          un espacio sin juicio donde podemos trabajar juntos lo que estés
          viviendo. Te acompaño con empatía, técnica y mucho respeto por tu
          proceso.
        </Body>
        <Row gap={10}>
          <Btn>Agendar una cita</Btn>
          <Btn ghost icon={false}>Conocerme</Btn>
        </Row>
      </Stack>
    </Pad>
    <div style={{ padding: '0 22px 22px' }}>
      <div className="wf-divider" />
      <Row gap={6} style={{ paddingTop: 14, color: 'var(--ink-300)' }}>
        <Icon name="location" size={12} />
        <Meta>San José, Costa Rica · Presencial y online</Meta>
      </Row>
    </div>
  </Frame>
);

const HeroB = () => (
  <Frame>
    <PhoneChrome />
    <Pad x={22} y={16} style={{ flex: 1 }}>
      <Stack gap={20}>
        <Eyebrow>Psicología clínica · San José</Eyebrow>
        <H1 size={40} style={{ lineHeight: 1.05 }}>
          Un espacio para<br/>
          <span style={{ fontStyle: 'italic', color: 'var(--sage-700)' }}>volver a vos</span>.
        </H1>
        <Body size={14}>
          Acompaño procesos de ansiedad, duelo, autoestima y relaciones desde
          una mirada cálida, ética y basada en evidencia.
        </Body>
        <div style={{ position: 'relative', marginTop: 8 }}>
          <Photo w="100%" h={220} rounded={14} label="retrato editorial" />
        </div>
        <Row gap={10}>
          <Btn block>Agendar cita</Btn>
        </Row>
        <Row gap={10} justify="space-between" style={{ paddingTop: 4 }}>
          <Meta>Rosibel Cascante</Meta>
          <Meta>Cód. CPCR 0000</Meta>
        </Row>
      </Stack>
    </Pad>
  </Frame>
);

const HeroC = () => (
  <Frame style={{ background: 'var(--sage-100)' }}>
    <PhoneChrome />
    <Pad x={22} y={14} style={{ flex: 1 }}>
      <Stack gap={16}>
        <Pill outline>· terapia presencial y online</Pill>
        <H1 size={32}>
          ¿Estás listo<br/>para empezar?
        </H1>
        <Body size={14}>
          Soy Rosibel, psicóloga clínica. Te ofrezco un primer encuentro de
          20 minutos sin costo para conocernos y ver si encajamos.
        </Body>
        <div className="wf-card" style={{ padding: 16, marginTop: 4 }}>
          <Row gap={12}>
            <Photo w={56} h={56} rounded={999} label="rb" />
            <Stack gap={2}>
              <H3 size={15}>Rosibel Cascante B.</H3>
              <Meta>Psic. clínica · 10 años</Meta>
              <Row gap={4} style={{ marginTop: 2 }}>
                {[1,2,3,4,5].map(i => <Icon key={i} name="star" size={11} color="var(--sage-700)"/>)}
                <Meta style={{ marginLeft: 4 }}>42 reseñas</Meta>
              </Row>
            </Stack>
          </Row>
        </div>
        <Row gap={10}>
          <Btn block>Agendar cita gratuita</Btn>
        </Row>
        <Row gap={20} justify="center" style={{ paddingTop: 8, color: 'var(--ink-500)' }}>
          <Row gap={5}><Icon name="check" size={11}/><Meta>Sin tarjeta</Meta></Row>
          <Row gap={5}><Icon name="check" size={11}/><Meta>Confidencial</Meta></Row>
        </Row>
      </Stack>
    </Pad>
  </Frame>
);

/* ─────────── SOBRE MÍ (3) ─────────── */

const SobreA = () => (
  <Frame>
    <Pad x={22} y={28}>
      <Stack gap={20}>
        <Eyebrow>01 · Sobre mí</Eyebrow>
        <H2 size={26}>Hola otra vez —<br/>te cuento un poco más.</H2>
        <Photo w="100%" h={230} rounded={14} label="foto consultorio" />
        <Body>
          Soy psicóloga clínica con 10 años acompañando procesos individuales
          y de pareja. Mi enfoque combina la terapia cognitivo-conductual con
          una mirada humanista —ningún proceso es igual a otro.
        </Body>
        <div className="wf-card tinted" style={{ padding: 16 }}>
          <Stack gap={10}>
            <Row gap={10}>
              <Icon name="check" size={12} color="var(--sage-700)" />
              <Meta>Univ. de Costa Rica · 2015</Meta>
            </Row>
            <Row gap={10}>
              <Icon name="check" size={12} color="var(--sage-700)" />
              <Meta>Colegiado · CPCR 0000</Meta>
            </Row>
            <Row gap={10}>
              <Icon name="check" size={12} color="var(--sage-700)" />
              <Meta>Especialización en trauma · 2020</Meta>
            </Row>
          </Stack>
        </div>
        <Btn ghost icon={false}>Conocer mi historia</Btn>
      </Stack>
    </Pad>
  </Frame>
);

const SobreB = () => (
  <Frame>
    <Pad x={22} y={28}>
      <Stack gap={18}>
        <Eyebrow>Sobre mí</Eyebrow>
        <Row gap={14} align="flex-start">
          <Stack gap={4}>
            <H2 size={22}>10 años</H2>
            <Meta>acompañando</Meta>
          </Stack>
          <div style={{ width: 1, alignSelf: 'stretch', background: 'var(--line)' }} />
          <Stack gap={4}>
            <H2 size={22}>+400</H2>
            <Meta>personas</Meta>
          </Stack>
          <div style={{ width: 1, alignSelf: 'stretch', background: 'var(--line)' }} />
          <Stack gap={4}>
            <H2 size={22}>2</H2>
            <Meta>idiomas</Meta>
          </Stack>
        </Row>
        <div className="wf-divider" />
        <Photo w="100%" h={180} rounded={14} label="retrato natural" />
        <Body>
          Estudié en la UCR, me especialicé en trauma y pareja, y desde 2016
          tengo consultorio propio en San Pedro. Trabajo con adolescentes y
          adultos, en español e inglés.
        </Body>
        <Stack gap={8}>
          {['Cognitivo-conductual','Enfoque humanista','Terapia de pareja Gottman'].map(t =>
            <Row gap={10} key={t}><Icon name="leaf" size={12} color="var(--sage-700)"/><Body size={13}>{t}</Body></Row>
          )}
        </Stack>
      </Stack>
    </Pad>
  </Frame>
);

const SobreC = () => (
  <Frame style={{ background: 'var(--bg-3)' }}>
    <Pad x={22} y={28}>
      <Stack gap={20}>
        <Eyebrow>Sobre mí</Eyebrow>
        <H2 size={26} style={{ fontStyle: 'italic' }}>
          "Creo que la terapia no se trata de arreglar — sino de escuchar lo que
          ya está pidiendo ser escuchado."
        </H2>
        <Row gap={10} align="center">
          <Photo w={44} h={44} rounded={999} label="rb"/>
          <Stack gap={2}>
            <H3 size={14}>Rosibel Cascante B.</H3>
            <Meta>Psicóloga clínica</Meta>
          </Stack>
        </Row>
        <div className="wf-divider sage"/>
        <Lines n={4} last="55%"/>
        <Row gap={10}>
          <Btn ghost icon={false}>Leer mi biografía completa</Btn>
        </Row>
      </Stack>
    </Pad>
  </Frame>
);

/* ─────────── ENFOQUE (3) ─────────── */

const EnfoqueA = () => (
  <Frame>
    <Pad x={22} y={28}>
      <Stack gap={20}>
        <Eyebrow>02 · Cómo trabajo</Eyebrow>
        <H2 size={26}>Tres principios<br/>que guían mi práctica.</H2>
        {[
          { n:'01', t:'Sin juicio', d:'Acá no hay diagnósticos rápidos ni etiquetas. Empezamos donde estás.' },
          { n:'02', t:'Basado en evidencia', d:'Uso herramientas con respaldo: TCC, EMDR, terapia de aceptación.' },
          { n:'03', t:'A tu ritmo', d:'Las sesiones son tuyas. Avanzamos según lo que vos necesitás cada semana.' },
        ].map(b => (
          <div key={b.n} className="wf-card" style={{ padding: 16 }}>
            <Row gap={14} align="flex-start">
              <div style={{ fontFamily: 'var(--serif)', fontSize: 22, color: 'var(--sage-500)', minWidth: 30 }}>{b.n}</div>
              <Stack gap={6}>
                <H3 size={15}>{b.t}</H3>
                <Body>{b.d}</Body>
              </Stack>
            </Row>
          </div>
        ))}
      </Stack>
    </Pad>
  </Frame>
);

const EnfoqueB = () => (
  <Frame style={{ background: 'var(--sage-100)' }}>
    <Pad x={22} y={28}>
      <Stack gap={18}>
        <Eyebrow>Mi enfoque</Eyebrow>
        <H2 size={24}>Una terapia integrativa —<br/>cálida y rigurosa.</H2>
        <Body>
          No creo en un solo enfoque para todos. Combino corrientes según lo que
          cada proceso pide.
        </Body>
        <Row gap={8} style={{ flexWrap: 'wrap' }}>
          {['Cognitivo-conductual','Humanista','Sistémico','Mindfulness','EMDR','Gottman'].map(t =>
            <Pill key={t}>{t}</Pill>
          )}
        </Row>
        <div className="wf-divider sage"/>
        <Stack gap={14}>
          {[
            ['¿Qué pasa en la primera sesión?','Hablamos de lo que te trae, sin presión de avanzar.'],
            ['¿Cuánto dura un proceso?','Depende del motivo. Lo conversamos juntos en sesión 3 o 4.'],
          ].map(([q,a]) => (
            <Stack gap={6} key={q}>
              <H3 size={14}>{q}</H3>
              <Body size={13}>{a}</Body>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Pad>
  </Frame>
);

const EnfoqueC = () => (
  <Frame>
    <Pad x={22} y={28}>
      <Stack gap={18}>
        <Eyebrow>Cómo trabajo</Eyebrow>
        <H2 size={26}>Así se ve un proceso<br/>conmigo.</H2>
        <div style={{ position: 'relative', paddingLeft: 22 }}>
          <div style={{ position:'absolute', left:9, top:6, bottom:6, width:2, background:'var(--sage-300)' }}/>
          {[
            { t:'1. Primer contacto', d:'20 min gratis para conocernos.' },
            { t:'2. Sesiones de exploración', d:'Las primeras 2-3 son para entender qué pasa.' },
            { t:'3. Plan de trabajo', d:'Acordamos juntos el camino.' },
            { t:'4. Cierre y seguimiento', d:'No te dejo a la mitad — cerramos con cuidado.' },
          ].map((s, i) => (
            <div key={i} style={{ position: 'relative', paddingBottom: 18 }}>
              <div style={{ position:'absolute', left:-22, top:4, width:14, height:14, borderRadius:999, background:'var(--bg)', border:'2px solid var(--sage-500)' }}/>
              <Stack gap={4}>
                <H3 size={14}>{s.t}</H3>
                <Body size={13}>{s.d}</Body>
              </Stack>
            </div>
          ))}
        </div>
      </Stack>
    </Pad>
  </Frame>
);

/* ─────────── SERVICIOS (3) ─────────── */

const ServService = ({ n, name, dur, price, layout }) => {
  if (layout === 'compact') return (
    <Row justify="space-between" align="center" style={{ padding: '14px 0', borderBottom: '1px solid var(--line)' }}>
      <Stack gap={4}>
        <H3 size={15}>{name}</H3>
        <Meta>{dur} min · ₡{price}</Meta>
      </Stack>
      <Icon name="arrow" size={14} color="var(--sage-700)"/>
    </Row>
  );
  if (layout === 'badge') return (
    <div className="wf-card" style={{ padding: 16 }}>
      <Row gap={12} align="flex-start">
        <div style={{ width:36, height:36, borderRadius:8, background:'var(--sage-100)', display:'flex',alignItems:'center',justifyContent:'center', color:'var(--sage-700)' }}>
          <Icon name={['user','users','heart','leaf'][n%4]} size={16}/>
        </div>
        <Stack gap={6} style={{ flex: 1 }}>
          <H3 size={15}>{name}</H3>
          <Body size={12}>Espacio individual para abordar lo que estás viviendo, a tu ritmo.</Body>
          <Row gap={10} style={{ marginTop: 4 }}>
            <Pill warm>{dur} min</Pill>
            <Pill warm>₡{price}</Pill>
          </Row>
        </Stack>
      </Row>
    </div>
  );
  return (
    <div className="wf-card" style={{ padding: 16 }}>
      <Stack gap={10}>
        <Row justify="space-between">
          <Pill outline>{`0${n}`}</Pill>
          <Meta>{dur} min</Meta>
        </Row>
        <H3 size={17}>{name}</H3>
        <Body size={13}>Descripción breve de lo que incluye este servicio y para quién está pensado.</Body>
        <Row justify="space-between" align="center" style={{ marginTop: 6 }}>
          <H3 size={18} style={{ color: 'var(--sage-700)' }}>₡{price}</H3>
          <Btn small>Reservar</Btn>
        </Row>
      </Stack>
    </div>
  );
};

const ServiciosA = () => (
  <Frame>
    <Pad x={22} y={28}>
      <Stack gap={18}>
        <Eyebrow>03 · Servicios</Eyebrow>
        <H2 size={26}>Lo que ofrezco.</H2>
        <Body>Cada espacio está pensado para una necesidad específica. Si no sabés cuál, escribime y vemos juntos.</Body>
        <Stack gap={12}>
          {['Servicio 1','Servicio 2','Servicio 3'].map((n,i)=>
            <ServService key={i} n={i+1} name={n} dur={[50,80,50][i]} price={['25.000','40.000','25.000'][i]}/>
          )}
        </Stack>
        <Btn ghost icon={false}>Ver todos los servicios</Btn>
      </Stack>
    </Pad>
  </Frame>
);

const ServiciosB = () => (
  <Frame style={{ background: 'var(--bg-3)' }}>
    <Pad x={22} y={28}>
      <Stack gap={16}>
        <Eyebrow>Servicios</Eyebrow>
        <H2 size={24}>¿Con qué te puedo ayudar?</H2>
        <div className="wf-card" style={{ padding: 4 }}>
          {['Servicio 1','Servicio 2','Servicio 3','Servicio 4'].map((n,i)=>
            <div key={i} style={{ padding: '0 14px' }}>
              <ServService n={i+1} name={n} dur={[50,80,50,90][i]} price={['25k','40k','25k','45k'][i]} layout="compact"/>
            </div>
          )}
        </div>
      </Stack>
    </Pad>
  </Frame>
);

const ServiciosC = () => (
  <Frame>
    <Pad x={22} y={28}>
      <Stack gap={16}>
        <Eyebrow>03 · Servicios</Eyebrow>
        <H2 size={24}>Espacios que ofrezco</H2>
        <Stack gap={12}>
          {['Servicio 1','Servicio 2','Servicio 3'].map((n,i)=>
            <ServService key={i} n={i+1} name={n} dur={[50,80,50][i]} price={['25.000','40.000','25.000'][i]} layout="badge"/>
          )}
        </Stack>
        <Body size={12} style={{ color:'var(--ink-500)', textAlign:'center', paddingTop: 6 }}>
          ¿No estás seguro cuál? <span style={{color:'var(--sage-700)', textDecoration:'underline'}}>Escribime.</span>
        </Body>
      </Stack>
    </Pad>
  </Frame>
);

/* ─────────── PARA QUÉ SITUACIONES (3) ─────────── */

const SitItems = ['Ansiedad','Duelo','Pareja','Autoestima','Estrés laboral','Familia','Cambios de vida','Trauma','Identidad'];

const SituacionesA = () => (
  <Frame>
    <Pad x={22} y={28}>
      <Stack gap={18}>
        <Eyebrow>04 · Para qué situaciones</Eyebrow>
        <H2 size={24}>Algunos de los temas<br/>que trabajamos juntos.</H2>
        <Row gap={8} style={{ flexWrap: 'wrap' }}>
          {SitItems.map(s => <Pill key={s} warm>{s}</Pill>)}
        </Row>
        <div className="wf-divider"/>
        <Body size={13} style={{ color:'var(--ink-500)' }}>
          ¿Tu situación no aparece en la lista? Eso también está bien — la
          terapia no necesita una etiqueta para empezar.
        </Body>
      </Stack>
    </Pad>
  </Frame>
);

const SituacionesB = () => (
  <Frame style={{ background: 'var(--sage-100)' }}>
    <Pad x={22} y={28}>
      <Stack gap={16}>
        <Eyebrow>Para qué situaciones</Eyebrow>
        <H2 size={24}>Puedo ayudarte si...</H2>
        <Stack gap={10}>
          {[
            'sentís ansiedad que no se va',
            'estás atravesando una pérdida',
            'tu relación de pareja está difícil',
            'querés entender quién sos hoy',
            'tu trabajo te está pasando factura',
          ].map((s,i) => (
            <Row gap={12} key={i} align="flex-start">
              <div style={{ minWidth: 8, height: 8, borderRadius:999, background:'var(--sage-500)', marginTop: 7 }}/>
              <Body size={14}>{s}</Body>
            </Row>
          ))}
        </Stack>
      </Stack>
    </Pad>
  </Frame>
);

const SituacionesC = () => (
  <Frame>
    <Pad x={22} y={28}>
      <Stack gap={16}>
        <Eyebrow>Qué trabajamos</Eyebrow>
        <H2 size={24}>9 razones por las que<br/>la gente llega.</H2>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10 }}>
          {SitItems.map((s,i)=>(
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
  </Frame>
);

/* ─────────── TESTIMONIOS (3) ─────────── */

const TestimonialQuote = ({ short }) => (
  <>
    <div style={{ fontFamily: 'var(--serif)', fontSize: 28, color:'var(--sage-300)', lineHeight:0.5 }}>"</div>
    <Body size={14}>
      {short ? 'Encontré un espacio donde ser yo, sin tener que dar explicaciones.' :
      'Fue la primera vez que me sentí escuchada de verdad. Rosibel sostuvo lo que yo no podía cargar sola, y me ayudó a encontrar mis propias respuestas. Hoy estoy en un lugar muy distinto.'}
    </Body>
  </>
);

const TestimoniosA = () => (
  <Frame>
    <Pad x={22} y={28}>
      <Stack gap={18}>
        <Eyebrow>05 · Testimonios</Eyebrow>
        <H2 size={24}>Lo que dicen quienes<br/>pasaron por acá.</H2>
        <div className="wf-card tinted" style={{ padding: 20 }}>
          <Stack gap={14}>
            <TestimonialQuote/>
            <Row gap={10}>
              <Photo w={36} h={36} rounded={999} label="m"/>
              <Stack gap={2}><H3 size={13}>María, 32</H3><Meta>3 meses en proceso</Meta></Stack>
            </Row>
          </Stack>
        </div>
        <Row gap={6} justify="center">
          {[1,2,3,4].map(i => <div key={i} style={{ width: i===1?20:6, height:6, borderRadius:999, background: i===1?'var(--sage-500)':'var(--sage-300)' }}/>)}
        </Row>
      </Stack>
    </Pad>
  </Frame>
);

const TestimoniosB = () => (
  <Frame>
    <Pad x={22} y={28}>
      <Stack gap={16}>
        <Eyebrow>Testimonios</Eyebrow>
        <H2 size={22}>De quienes confiaron.</H2>
        <Stack gap={12}>
          {[1,2,3].map(i => (
            <div key={i} className="wf-card" style={{ padding: 16 }}>
              <Stack gap={10}>
                <Row gap={4}>{[1,2,3,4,5].map(j=><Icon key={j} name="star" size={11} color="var(--sage-700)"/>)}</Row>
                <TestimonialQuote short/>
                <Meta>— Inicial · {2024+i}</Meta>
              </Stack>
            </div>
          ))}
        </Stack>
      </Stack>
    </Pad>
  </Frame>
);

const TestimoniosC = () => (
  <Frame style={{ background:'var(--sage-100)' }}>
    <Pad x={22} y={28}>
      <Stack gap={16}>
        <Eyebrow>Testimonios</Eyebrow>
        <H2 size={28} style={{ fontStyle:'italic', lineHeight: 1.25 }}>
          "Llegué rota.<br/>
          Hoy estoy aprendiendo<br/>
          a sostenerme."
        </H2>
        <Row gap={10} align="center" style={{ paddingTop: 6 }}>
          <Photo w={40} h={40} rounded={999} label="a"/>
          <Stack gap={2}><H3 size={13}>Ana, 28</H3><Meta>8 meses en terapia</Meta></Stack>
        </Row>
        <div className="wf-divider sage"/>
        <Meta style={{ textAlign:'center' }}>+40 personas han compartido su experiencia →</Meta>
      </Stack>
    </Pad>
  </Frame>
);

/* ─────────── FAQ (3) ─────────── */

const FAQs = [
  ['¿Cuánto dura una sesión?', 'Las sesiones individuales son de 50 minutos. Las de pareja, 80 min.'],
  ['¿Atendés en línea o presencial?', 'Ambos. Vos elegís según lo que te quede mejor.'],
  ['¿Cómo se paga?', 'SINPE Móvil, transferencia o tarjeta al momento de reservar.'],
  ['¿Qué pasa si no puedo asistir?', 'Podés reagendar hasta 24h antes desde el link de tu correo.'],
];

const FAQA = () => (
  <Frame>
    <Pad x={22} y={28}>
      <Stack gap={16}>
        <Eyebrow>06 · Preguntas frecuentes</Eyebrow>
        <H2 size={26}>Lo que la gente<br/>suele preguntar.</H2>
        <Stack gap={2}>
          {FAQs.map(([q],i)=>(
            <div key={i} style={{ padding:'16px 0', borderBottom: i<FAQs.length-1 ? '1px solid var(--line)' : 0 }}>
              <Row justify="space-between" align="center">
                <H3 size={14} style={{ flex: 1, paddingRight: 12 }}>{q}</H3>
                <Icon name="plus" size={14} color="var(--ink-500)"/>
              </Row>
              {i===0 && <Body size={13} style={{ paddingTop: 10 }}>{FAQs[0][1]}</Body>}
            </div>
          ))}
        </Stack>
      </Stack>
    </Pad>
  </Frame>
);

const FAQB = () => (
  <Frame style={{ background:'var(--bg-3)' }}>
    <Pad x={22} y={28}>
      <Stack gap={16}>
        <Eyebrow>FAQ</Eyebrow>
        <H2 size={24}>Antes de agendar.</H2>
        <Stack gap={10}>
          {FAQs.map(([q,a],i)=>(
            <div key={i} className="wf-card" style={{ padding: 14 }}>
              <Stack gap={6}>
                <H3 size={14}>{q}</H3>
                <Body size={12} style={{ color:'var(--ink-500)' }}>{a}</Body>
              </Stack>
            </div>
          ))}
        </Stack>
      </Stack>
    </Pad>
  </Frame>
);

const FAQC = () => (
  <Frame>
    <Pad x={22} y={28}>
      <Stack gap={16}>
        <Eyebrow>06 · FAQ</Eyebrow>
        <H2 size={24}>Más preguntas.</H2>
        <Row gap={8} style={{ flexWrap:'wrap' }}>
          {['Sesiones','Pagos','Reagendar','Online','Primera vez','Confidencialidad'].map((t,i)=>
            <Pill key={t} outline={i!==0}>{t}</Pill>
          )}
        </Row>
        <Stack gap={14}>
          {FAQs.slice(0,3).map(([q,a],i)=>(
            <Stack gap={6} key={i}>
              <Row gap={10} align="flex-start">
                <div style={{ fontFamily:'var(--serif)', fontSize:14, color:'var(--sage-700)', minWidth:16 }}>0{i+1}</div>
                <Stack gap={6} style={{ flex: 1 }}>
                  <H3 size={14}>{q}</H3>
                  <Body size={12}>{a}</Body>
                </Stack>
              </Row>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Pad>
  </Frame>
);

/* ─────────── CTA FINAL + CONTACTO (3) ─────────── */

const CtaA = () => (
  <Frame style={{ background:'var(--sage-500)' }}>
    <Pad x={22} y={36}>
      <Stack gap={20}>
        <Eyebrow style={{ color:'var(--sage-100)' }}>Empezar</Eyebrow>
        <H2 size={32} style={{ color:'var(--bg)' }}>¿Listo para<br/>dar el primer paso?</H2>
        <Body size={14} style={{ color:'var(--sage-100)' }}>
          Reservá una primera sesión de 20 minutos sin costo y vemos si encajamos.
        </Body>
        <Btn style={{ background: 'var(--bg)', color:'var(--sage-700)' }}>Agendar ahora</Btn>
        <div style={{ height: 1, background:'rgba(255,255,255,0.2)' }}/>
        <Stack gap={10}>
          <Row gap={10} style={{ color:'var(--sage-100)' }}><Icon name="mail" size={12}/><Meta style={{ color:'var(--sage-100)' }}>hola@rosibelpsicologa.cr</Meta></Row>
          <Row gap={10} style={{ color:'var(--sage-100)' }}><Icon name="phone" size={12}/><Meta style={{ color:'var(--sage-100)' }}>+506 0000 0000</Meta></Row>
        </Stack>
      </Stack>
    </Pad>
  </Frame>
);

const CtaB = () => (
  <Frame>
    <Pad x={22} y={32}>
      <Stack gap={20}>
        <Eyebrow>07 · Contacto</Eyebrow>
        <H2 size={28}>Conversemos.</H2>
        <Body>Si todavía no estás listo para agendar, escribime y vemos juntos.</Body>
        <div className="wf-card tinted" style={{ padding: 16 }}>
          <Stack gap={12}>
            <div className="wf-input field"><div className="lbl">Tu nombre</div><div className="ctrl">Nombre</div></div>
            <div className="wf-input field"><div className="lbl">Correo</div><div className="ctrl">correo@dominio.com</div></div>
            <div className="wf-input field"><div className="lbl">¿En qué te puedo ayudar?</div><div className="ctrl" style={{minHeight:60}}>Cuéntame brevemente...</div></div>
            <Btn block>Enviar mensaje</Btn>
          </Stack>
        </div>
      </Stack>
    </Pad>
  </Frame>
);

const CtaC = () => (
  <Frame style={{ background:'var(--bg-2)' }}>
    <Pad x={22} y={36}>
      <Stack gap={18}>
        <Photo w={88} h={88} rounded={999} label="rosibel" style={{ margin: '0 auto' }}/>
        <H2 size={26} style={{ textAlign:'center' }}>
          Hablemos —<br/>cuando estés.
        </H2>
        <Body style={{ textAlign:'center' }}>
          No hay prisa. Cuando estés listo, este botón te lleva al calendario.
        </Body>
        <Btn block>Agendar primera cita</Btn>
        <Row gap={14} justify="center" style={{ paddingTop: 6 }}>
          <Pill outline>WhatsApp</Pill>
          <Pill outline>Correo</Pill>
          <Pill outline>Llamada</Pill>
        </Row>
      </Stack>
    </Pad>
  </Frame>
);

/* ─────────── FOOTER (3) ─────────── */

const FooterA = () => (
  <Frame style={{ background:'var(--ink-900)' }}>
    <Pad x={22} y={28}>
      <Stack gap={18}>
        <Row gap={10} align="center">
          <div style={{ width: 28, height: 28, borderRadius:999, background:'var(--sage-300)' }}/>
          <H3 size={16} style={{ color:'var(--bg)' }}>rosibel cascante</H3>
        </Row>
        <Body style={{ color:'rgba(232,225,210,0.7)' }}>
          Psicología clínica · San José, Costa Rica
        </Body>
        <div style={{ height: 1, background:'rgba(255,255,255,0.12)' }}/>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 14 }}>
          {['Inicio','Servicios','Sobre mí','Reservar','FAQ','Contacto'].map(l =>
            <Meta key={l} style={{ color:'rgba(232,225,210,0.7)' }}>{l}</Meta>
          )}
        </div>
        <div style={{ height: 1, background:'rgba(255,255,255,0.12)' }}/>
        <Row justify="space-between">
          <Meta style={{ color:'rgba(232,225,210,0.5)' }}>© 2026</Meta>
          <Meta style={{ color:'rgba(232,225,210,0.5)' }}>Privacidad · Términos</Meta>
        </Row>
      </Stack>
    </Pad>
  </Frame>
);

const FooterB = () => (
  <Frame style={{ background:'var(--bg-3)' }}>
    <Pad x={22} y={28}>
      <Stack gap={14}>
        <H3 size={16}>rosibel cascante</H3>
        <Meta>Psicóloga clínica · CPCR 0000</Meta>
        <Stack gap={6}>
          <Row gap={8}><Icon name="location" size={12} color="var(--sage-700)"/><Meta>San Pedro, San José</Meta></Row>
          <Row gap={8}><Icon name="mail" size={12} color="var(--sage-700)"/><Meta>hola@rosibelpsicologa.cr</Meta></Row>
          <Row gap={8}><Icon name="phone" size={12} color="var(--sage-700)"/><Meta>+506 0000 0000</Meta></Row>
        </Stack>
        <div className="wf-divider"/>
        <Row gap={14}>
          {['IG','FB','LI'].map(s => <div key={s} style={{ width:32, height:32, borderRadius:999, background:'var(--bg)', display:'flex',alignItems:'center',justifyContent:'center', fontSize:10, fontWeight:600, color:'var(--ink-700)' }}>{s}</div>)}
        </Row>
        <Meta style={{ color:'var(--ink-300)', fontSize: 10 }}>© 2026 · Hecho con cuidado</Meta>
      </Stack>
    </Pad>
  </Frame>
);

const FooterC = () => (
  <Frame>
    <Pad x={22} y={28}>
      <Stack gap={20} style={{ textAlign:'center' }}>
        <H2 size={28} style={{ fontStyle:'italic', color:'var(--sage-700)' }}>
          Estoy acá<br/>cuando estés.
        </H2>
        <div className="wf-divider"/>
        <Stack gap={4}>
          <Meta>hola@rosibelpsicologa.cr</Meta>
          <Meta>+506 0000 0000</Meta>
        </Stack>
        <Row gap={14} justify="center">
          {['Instagram','LinkedIn'].map(s => <Meta key={s} style={{ textDecoration:'underline' }}>{s}</Meta>)}
        </Row>
        <Meta style={{ color:'var(--ink-300)' }}>CPCR 0000 · © 2026</Meta>
      </Stack>
    </Pad>
  </Frame>
);

Object.assign(window, {
  HeroA, HeroB, HeroC,
  SobreA, SobreB, SobreC,
  EnfoqueA, EnfoqueB, EnfoqueC,
  ServiciosA, ServiciosB, ServiciosC,
  SituacionesA, SituacionesB, SituacionesC,
  TestimoniosA, TestimoniosB, TestimoniosC,
  FAQA, FAQB, FAQC,
  CtaA, CtaB, CtaC,
  FooterA, FooterB, FooterC,
});
