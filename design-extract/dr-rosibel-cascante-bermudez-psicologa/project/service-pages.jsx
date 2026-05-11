// /servicios/[slug] — 3 variants. Plus a small sober variant for /sobre.

const ServicePageA = () => (
  <Frame>
    <PhoneChrome back title="Servicios"/>
    <Pad x={22} y={6} style={{ flex: 1 }}>
      <Stack gap={16}>
        <Eyebrow>Terapia individual</Eyebrow>
        <H1 size={28}>Servicio 1</H1>
        <Row gap={8}>
          <Pill warm>50 min</Pill>
          <Pill warm>₡25.000</Pill>
          <Pill warm>Online / presencial</Pill>
        </Row>
        <Photo w="100%" h={180} rounded={14} label="ambiente consultorio"/>
        <Stack gap={10}>
          <H3 size={15}>¿De qué se trata?</H3>
          <Body>Espacio individual semanal para abordar lo que estés viviendo, a tu ritmo y en un ambiente sin juicio.</Body>
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
          <Body size={13}>Sesiones semanales o quincenales de 50 min. Reservás por la web, te confirmo por correo y nos vemos.</Body>
        </Stack>
      </Stack>
    </Pad>
    <Pad x={22} y={16} style={{ borderTop: '1px solid var(--line)', background:'var(--bg)' }}>
      <Row justify="space-between" align="center">
        <Stack gap={2}><Meta>Desde</Meta><H3 size={18} style={{ color:'var(--sage-700)' }}>₡25.000</H3></Stack>
        <Btn>Reservar</Btn>
      </Row>
    </Pad>
  </Frame>
);

const ServicePageB = () => (
  <Frame style={{ background:'var(--sage-100)' }}>
    <PhoneChrome back title=""/>
    <Pad x={22} y={6} style={{ flex: 1 }}>
      <Stack gap={18}>
        <Pill outline>Servicio 02</Pill>
        <H1 size={34}>Servicio 2.</H1>
        <Body>Acompañamiento para parejas que quieren conversar mejor — y a veces, decidir mejor.</Body>
        <div className="wf-card" style={{ padding: 14 }}>
          <Row justify="space-around">
            {[['80 min','Duración'],['₡40.000','Inversión'],['1×sem','Frecuencia']].map(([v,l],i)=>
              <Stack gap={4} key={i} style={{ alignItems:'center' }}>
                <H3 size={16}>{v}</H3>
                <Meta>{l}</Meta>
              </Stack>
            )}
          </Row>
        </div>
        <Stack gap={10}>
          <H3 size={15}>Qué incluye</H3>
          <Stack gap={6}>
            {['Sesión inicial de exploración','Plan personalizado','Material entre sesiones'].map(t =>
              <Row gap={10} key={t}><Icon name="check" size={12} color="var(--sage-700)"/><Body size={13}>{t}</Body></Row>
            )}
          </Stack>
        </Stack>
        <div className="wf-divider sage"/>
        <Stack gap={8}>
          <H3 size={15}>Otros servicios</H3>
          <Row gap={8}>
            <Pill outline>Servicio 1</Pill>
            <Pill outline>Servicio 3</Pill>
          </Row>
        </Stack>
        <Btn block>Reservar — ₡40.000</Btn>
      </Stack>
    </Pad>
  </Frame>
);

const ServicePageC = () => (
  <Frame>
    <PhoneChrome back title=""/>
    <Pad x={22} y={6} style={{ flex: 1 }}>
      <Stack gap={18}>
        <Photo w="100%" h={200} rounded={14} label="foto editorial"/>
        <Row gap={8}><Pill warm>50 min</Pill><Pill warm>₡25.000</Pill></Row>
        <H1 size={26}>Servicio 3 — un espacio para adolescentes.</H1>
        <Body>Terapia adaptada para personas de 13 a 18 años, con privacidad y comunicación cuidada con la familia.</Body>
        <Stack gap={14}>
          {[
            ['¿Cómo es la primera sesión?','Hablamos sin presión, vemos qué te trae.'],
            ['¿Mis papás se enteran de lo que digo?','Lo que conversamos es confidencial salvo riesgo.'],
            ['¿Tengo que comprometerme a algo largo?','No. Vemos sesión a sesión.'],
          ].map(([q,a],i)=>(
            <Stack gap={6} key={i}>
              <Row gap={10}><div style={{ minWidth: 20, fontFamily:'var(--serif)', color:'var(--sage-700)' }}>0{i+1}</div><Stack gap={4}><H3 size={14}>{q}</H3><Body size={13}>{a}</Body></Stack></Row>
            </Stack>
          ))}
        </Stack>
        <Btn block>Agendar primera cita</Btn>
      </Stack>
    </Pad>
  </Frame>
);

const SobrePage = () => (
  <Frame>
    <PhoneChrome back title=""/>
    <Pad x={22} y={6} style={{ flex: 1 }}>
      <Stack gap={18}>
        <Eyebrow>Sobre la doctora</Eyebrow>
        <H1 size={28}>Rosibel<br/>Cascante Bermúdez.</H1>
        <Photo w="100%" h={260} rounded={14} label="retrato extendido"/>
        <Stack gap={10}>
          <Body>Soy psicóloga clínica costarricense, graduada de la Universidad de Costa Rica en 2015...</Body>
          <Lines n={3} last="60%"/>
        </Stack>
        <div className="wf-divider"/>
        <Stack gap={12}>
          <H3 size={15}>Formación</H3>
          {[
            ['2015','Licenciatura en Psicología, UCR'],
            ['2018','Maestría en Psicología Clínica'],
            ['2020','Especialización en trauma — Madrid'],
          ].map(([y,t],i)=>(
            <Row gap={14} key={i}>
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
        <Btn block>Agendar una cita</Btn>
      </Stack>
    </Pad>
  </Frame>
);

Object.assign(window, { ServicePageA, ServicePageB, ServicePageC, SobrePage });
