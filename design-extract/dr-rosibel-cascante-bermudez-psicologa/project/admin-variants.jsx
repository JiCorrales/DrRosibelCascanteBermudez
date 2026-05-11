// Admin panel — desktop. Sidebar + main panel pattern.

const AdminShell = ({ active = 'dashboard', children, width = 1280 }) => (
  <Frame kind="desktop" style={{ width, fontSize: 13 }}>
    <Row gap={0} style={{ flex: 1, height: '100%' }} align="stretch">
      {/* Sidebar */}
      <div style={{ width: 220, background: 'var(--ink-900)', color: '#E8E1D2', padding: '20px 14px', display:'flex', flexDirection:'column', gap: 4 }}>
        <Row gap={10} align="center" style={{ padding: '4px 8px 14px' }}>
          <div style={{ width: 28, height: 28, borderRadius: 999, background: 'var(--sage-300)' }}/>
          <Stack gap={2}>
            <div style={{ fontFamily:'var(--serif)', fontSize: 14, color: '#fff' }}>rosibel</div>
            <div style={{ fontSize: 10, color: 'rgba(232,225,210,0.5)' }}>admin</div>
          </Stack>
        </Row>
        {[
          ['home','dashboard','Dashboard'],
          ['cal','calendar','Calendario'],
          ['clock','appts','Citas'],
          ['users','clients','Clientes'],
          ['bookmark','services','Servicios'],
          ['chat','messages','Mensajes'],
          ['cog','settings','Ajustes'],
        ].map(([ic,id,l]) => {
          const is = id === active;
          return (
            <Row gap={10} align="center" key={id} style={{ padding: '9px 10px', borderRadius: 6, background: is ? 'rgba(168,184,154,0.18)' : 'transparent', color: is?'#fff':'rgba(232,225,210,0.75)' }}>
              <Icon name={ic} size={14}/>
              <span style={{ fontFamily:'var(--sans)', fontSize: 12, fontWeight: is?500:400 }}>{l}</span>
            </Row>
          );
        })}
        <div style={{ marginTop: 'auto', padding: '12px 8px', borderTop:'1px solid rgba(255,255,255,0.1)', display:'flex', gap: 10, alignItems:'center' }}>
          <Photo w={28} h={28} rounded={999} label=""/>
          <Stack gap={1}>
            <div style={{ fontSize: 11, color: '#fff' }}>Rosibel C.</div>
            <div style={{ fontSize: 9, color: 'rgba(232,225,210,0.5)' }}>Salir</div>
          </Stack>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'hidden', display:'flex', flexDirection:'column' }}>
        {children}
      </div>
    </Row>
  </Frame>
);

const AdminTopbar = ({ title, sub, action }) => (
  <Row justify="space-between" align="center" style={{ padding: '20px 28px', borderBottom: '1px solid var(--line)', background:'#fff' }}>
    <Stack gap={4}>
      <H2 size={20}>{title}</H2>
      {sub && <Meta>{sub}</Meta>}
    </Stack>
    <Row gap={10}>
      <div className="wf-input" style={{ padding: '7px 12px', minWidth: 200 }}><Icon name="search" size={12}/><span style={{ marginLeft: 8 }}>Buscar…</span></div>
      <div style={{ position:'relative', width: 34, height: 34, borderRadius: 8, background:'#fff', border:'1px solid var(--line)', display:'flex',alignItems:'center',justifyContent:'center', color:'var(--ink-700)' }}>
        <Icon name="bell" size={14}/>
        <div style={{ position:'absolute', top: 6, right: 6, width: 6, height: 6, borderRadius:999, background:'var(--sage-500)' }}/>
      </div>
      {action && <Btn small icon={false}>{action}</Btn>}
    </Row>
  </Row>
);

/* ─── DASHBOARD (3 variants) ─── */

const Stat = ({ label, value, delta, sub }) => (
  <div className="wf-card" style={{ padding: 16, flex: 1 }}>
    <Stack gap={6}>
      <Meta>{label}</Meta>
      <H2 size={24}>{value}</H2>
      {sub && <Meta style={{ color: 'var(--sage-700)' }}>{sub}</Meta>}
    </Stack>
  </div>
);

const ApptRow = ({ time, name, type, status, compact }) => (
  <Row align="center" justify="space-between" style={{ padding: '12px 14px', borderBottom: compact ? '1px solid var(--line)' : 0 }}>
    <Row gap={14} align="center">
      <Stack gap={2} style={{ minWidth: 60 }}>
        <H3 size={13}>{time}</H3>
        <Meta>50 min</Meta>
      </Stack>
      <Photo w={32} h={32} rounded={999} label=""/>
      <Stack gap={2}>
        <H3 size={13}>{name}</H3>
        <Meta>{type}</Meta>
      </Stack>
    </Row>
    <Row gap={10} align="center">
      <Pill outline={status!=='Hoy'}>{status}</Pill>
      <Icon name="arrow" size={12} color="var(--ink-500)"/>
    </Row>
  </Row>
);

const AdminDashboardA = () => (
  <AdminShell active="dashboard">
    <AdminTopbar title="Buenos días, Rosibel" sub="Jueves 14 de mayo, 2026" action="+ Nueva cita"/>
    <div style={{ flex: 1, overflow:'hidden', padding: 28, background:'var(--bg)' }}>
      <Stack gap={20}>
        <Row gap={14}>
          <Stat label="Citas hoy" value="6" sub="2 confirmadas"/>
          <Stat label="Semana" value="22" sub="+4 vs. semana pasada"/>
          <Stat label="Pendientes" value="3" sub="por confirmar"/>
          <Stat label="Ingresos mes" value="₡520k" sub="al 14 de mayo"/>
        </Row>
        <Row gap={20} align="flex-start">
          <div style={{ flex: 2 }}>
            <div className="wf-card" style={{ padding: 0 }}>
              <Row justify="space-between" align="center" style={{ padding: '14px 18px', borderBottom:'1px solid var(--line)' }}>
                <H3 size={15}>Agenda de hoy</H3>
                <Meta>Ver calendario →</Meta>
              </Row>
              {[
                ['9:00','Cliente 1','Servicio 1','Hoy'],
                ['10:00','Cliente 2','Servicio 1','Confirmada'],
                ['11:30','Cliente 3','Primer encuentro','Pendiente'],
                ['14:00','Cliente 4','Servicio 2','Confirmada'],
                ['15:30','Cliente 5','Servicio 1','Confirmada'],
              ].map((r,i)=><ApptRow key={i} time={r[0]} name={r[1]} type={r[2]} status={r[3]} compact={i<4}/>)}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <Stack gap={14}>
              <div className="wf-card" style={{ padding: 16 }}>
                <Stack gap={12}>
                  <H3 size={14}>Próximamente</H3>
                  <Stack gap={10}>
                    {['Mañana · 8 citas','Sábado · día libre','Lun 18 may · 4 citas'].map((t,i)=>
                      <Row gap={10} key={i}><Icon name="cal" size={12} color="var(--sage-700)"/><Body size={12}>{t}</Body></Row>
                    )}
                  </Stack>
                </Stack>
              </div>
              <div className="wf-card sage" style={{ padding: 16 }}>
                <Stack gap={8}>
                  <H3 size={14}>3 reservas nuevas</H3>
                  <Body size={12}>Necesitan tu confirmación.</Body>
                  <Btn small icon={false}>Revisar</Btn>
                </Stack>
              </div>
            </Stack>
          </div>
        </Row>
      </Stack>
    </div>
  </AdminShell>
);

const AdminDashboardB = () => (
  <AdminShell active="dashboard">
    <AdminTopbar title="Hoy" sub="Jueves 14 de mayo, 2026"/>
    <div style={{ flex: 1, padding: 28, background: 'var(--bg)', overflow: 'hidden' }}>
      <Row gap={24} align="flex-start" style={{ height: '100%' }}>
        <div style={{ flex: 1 }}>
          <Stack gap={16}>
            <Eyebrow>Tu día</Eyebrow>
            <H1 size={36} style={{ lineHeight: 1.1 }}>6 sesiones —<br/><span style={{ color:'var(--sage-700)' }}>la primera en 32 min.</span></H1>
            <div className="wf-card" style={{ padding: 20 }}>
              <Stack gap={14}>
                <Row justify="space-between"><Meta>Próxima</Meta><H3 size={13}>09:00</H3></Row>
                <H2 size={22}>Cliente 1</H2>
                <Meta>Servicio 1 · 50 min · Online</Meta>
                <Row gap={10}>
                  <Btn small>Abrir sala</Btn>
                  <Btn small ghost icon={false}>Ver nota</Btn>
                </Row>
              </Stack>
            </div>
            <Row gap={14}>
              <Stat label="Semana" value="22"/>
              <Stat label="Ingreso mes" value="₡520k"/>
              <Stat label="Tasa asist." value="94%"/>
            </Row>
          </Stack>
        </div>
        <div style={{ flex: 1 }}>
          <div className="wf-card" style={{ padding: 18 }}>
            <Stack gap={14}>
              <Row justify="space-between"><H3 size={15}>Mayo 2026</H3><Meta>Ver mes →</Meta></Row>
              <MiniCal/>
            </Stack>
          </div>
        </div>
      </Row>
    </div>
  </AdminShell>
);

const AdminDashboardC = () => (
  <AdminShell active="dashboard">
    <AdminTopbar title="Resumen" action="+ Nueva cita"/>
    <div style={{ flex: 1, padding: 28, background: 'var(--bg)', overflow: 'hidden' }}>
      <Stack gap={20}>
        <Row gap={14}>
          {[['Citas hoy','6','+2'],['Esta semana','22','+4'],['Ingresos','₡520k','+12%'],['Nuevos cli.','5','este mes']].map(([l,v,d])=>
            <Stat key={l} label={l} value={v} sub={d}/>
          )}
        </Row>
        <div className="wf-card" style={{ padding: 0 }}>
          <Row justify="space-between" align="center" style={{ padding: '14px 18px', borderBottom:'1px solid var(--line)' }}>
            <H3 size={15}>Próximos 7 días</H3>
            <Row gap={6}><Pill outline>Día</Pill><Pill>Semana</Pill><Pill outline>Mes</Pill></Row>
          </Row>
          <div style={{ padding: 18 }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap: 10 }}>
              {['Jue 14','Vie 15','Sáb 16','Dom 17','Lun 18','Mar 19','Mié 20'].map((d,i)=>(
                <div key={d} style={{ borderTop:'2px solid '+(i===0?'var(--sage-500)':'var(--line)'), paddingTop: 10 }}>
                  <Stack gap={8}>
                    <Meta>{d}</Meta>
                    <H3 size={20}>{[6,8,0,0,4,5,6][i]}</H3>
                    <div style={{ display:'flex', flexDirection:'column', gap: 3 }}>
                      {Array.from({length:[6,8,0,0,4,5,6][i]}).map((_,j)=>
                        <div key={j} style={{ height: 4, borderRadius: 2, background: j%3===0?'var(--sage-500)':'var(--sage-300)' }}/>
                      )}
                    </div>
                  </Stack>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Stack>
    </div>
  </AdminShell>
);

/* ─── CALENDARIO ─── */

const AdminCalendar = () => (
  <AdminShell active="calendar">
    <AdminTopbar title="Calendario" action="+ Nueva cita"/>
    <div style={{ flex: 1, padding: 0, background:'#fff', overflow:'hidden', display:'flex', flexDirection:'column' }}>
      <Row justify="space-between" align="center" style={{ padding: '14px 28px', borderBottom:'1px solid var(--line)' }}>
        <Row gap={14} align="center">
          <Btn small ghost icon={false}>Hoy</Btn>
          <Row gap={6}>
            <button style={{ width:28, height:28, borderRadius:6, border:'1px solid var(--line)', background:'#fff', color:'var(--ink-700)', display:'flex',alignItems:'center',justifyContent:'center' }}><Icon name="back" size={11}/></button>
            <button style={{ width:28, height:28, borderRadius:6, border:'1px solid var(--line)', background:'#fff', color:'var(--ink-700)', display:'flex',alignItems:'center',justifyContent:'center', transform:'rotate(180deg)' }}><Icon name="back" size={11}/></button>
          </Row>
          <H3 size={16}>Sem. del 11 al 17 de mayo</H3>
        </Row>
        <Row gap={6}>{['Día','Semana','Mes'].map((t,i)=><Pill key={t} outline={i!==1}>{t}</Pill>)}</Row>
      </Row>
      <div style={{ flex: 1, overflow:'hidden', display:'grid', gridTemplateColumns: '60px repeat(7, 1fr)' }}>
        {/* time gutter */}
        <div style={{ borderRight:'1px solid var(--line)' }}>
          <div style={{ height: 36, borderBottom:'1px solid var(--line)' }}/>
          {['8','9','10','11','12','13','14','15','16','17'].map(h => (
            <div key={h} style={{ height: 56, padding: '4px 10px', textAlign:'right', fontSize: 10, color:'var(--ink-300)', borderBottom: '1px solid var(--line)' }}>{h}:00</div>
          ))}
        </div>
        {['Lun 11','Mar 12','Mié 13','Jue 14','Vie 15','Sáb 16','Dom 17'].map((d,col)=>(
          <div key={d} style={{ borderRight:'1px solid var(--line)', position:'relative' }}>
            <div style={{ height: 36, borderBottom:'1px solid var(--line)', padding:'8px 10px', textAlign:'center', background: col===3?'var(--sage-100)':'transparent' }}>
              <div style={{ fontSize: 11, color:'var(--ink-500)' }}>{d.split(' ')[0]}</div>
              <H3 size={13} style={{ color: col===3?'var(--sage-700)':'var(--ink-900)' }}>{d.split(' ')[1]}</H3>
            </div>
            {['8','9','10','11','12','13','14','15','16','17'].map(h => (
              <div key={h} style={{ height: 56, borderBottom: '1px solid var(--line)' }}/>
            ))}
            {/* events */}
            {[
              [1,56,40,'Cliente A'],
              [3,56+56,50,'Cliente B'],
              [0,56*3,50,'Servicio 2'],
              [2,56*5+20,50,'Cliente C'],
              [4,56*2,50,'Cliente D'],
              [3,56*6,40,'Cliente E'],
            ].filter(e=>e[0]===col).map((e,i)=>(
              <div key={i} style={{ position:'absolute', left: 4, right: 4, top: 36 + e[1], height: e[2], background:'var(--sage-100)', borderLeft:'3px solid var(--sage-500)', borderRadius: 4, padding: '4px 6px', fontSize: 10, color:'var(--ink-900)' }}>
                <div style={{ fontWeight: 600 }}>{e[3]}</div>
                <div style={{ color:'var(--ink-500)' }}>50 min</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </AdminShell>
);

const AdminAvailability = () => (
  <AdminShell active="calendar">
    <AdminTopbar title="Disponibilidad" sub="Define cuándo aceptás reservas"/>
    <div style={{ flex: 1, padding: 28, background:'var(--bg)', overflow:'hidden' }}>
      <Row gap={20} align="flex-start">
        <div style={{ flex: 1 }}>
          <div className="wf-card" style={{ padding: 20 }}>
            <Stack gap={16}>
              <H3 size={15}>Horarios semanales</H3>
              {[
                ['Lunes', '9:00 — 17:00', true],
                ['Martes', '9:00 — 17:00', true],
                ['Miércoles', '9:00 — 13:00', true],
                ['Jueves', '9:00 — 17:00', true],
                ['Viernes', '9:00 — 15:00', true],
                ['Sábado', 'Cerrado', false],
                ['Domingo', 'Cerrado', false],
              ].map(([d,h,on],i)=>(
                <Row justify="space-between" align="center" key={d} style={{ padding: '10px 0', borderBottom: i<6?'1px solid var(--line)':0 }}>
                  <Row gap={14} align="center">
                    <div style={{ width:34, height:20, borderRadius:999, background: on?'var(--sage-500)':'var(--line-2)', position:'relative', padding: 2 }}>
                      <div style={{ width: 16, height: 16, borderRadius:999, background:'#fff', marginLeft: on?14:0, transition:'.2s' }}/>
                    </div>
                    <H3 size={13}>{d}</H3>
                  </Row>
                  <Meta>{h}</Meta>
                </Row>
              ))}
            </Stack>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <Stack gap={14}>
            <div className="wf-card" style={{ padding: 20 }}>
              <Stack gap={12}>
                <H3 size={14}>Días bloqueados</H3>
                <Body size={12}>Vacaciones, feriados o días personales.</Body>
                <Stack gap={8}>
                  {['Lun 22 — Vie 26 jul · Vacaciones','Lun 15 sep · Feriado'].map(t=>
                    <Row gap={10} key={t} justify="space-between"><Body size={12}>{t}</Body><Icon name="trash" size={12} color="var(--ink-300)"/></Row>
                  )}
                </Stack>
                <Btn small ghost icon={false}>+ Bloquear fechas</Btn>
              </Stack>
            </div>
            <div className="wf-card warm" style={{ padding: 20 }}>
              <Stack gap={10}>
                <H3 size={14}>Buffer entre citas</H3>
                <Meta>15 min entre sesiones</Meta>
                <Row gap={8}><Pill>10 min</Pill><Pill warm outline>15 min</Pill><Pill outline>30 min</Pill></Row>
              </Stack>
            </div>
          </Stack>
        </div>
      </Row>
    </div>
  </AdminShell>
);

/* ─── CITAS LIST ─── */

const AdminAppts = () => (
  <AdminShell active="appts">
    <AdminTopbar title="Citas" action="+ Nueva cita"/>
    <div style={{ flex: 1, padding: 28, background:'var(--bg)', overflow:'hidden' }}>
      <Stack gap={16}>
        <Row gap={8}>
          {['Todas','Hoy','Esta semana','Pendientes','Completadas','Canceladas'].map((t,i)=>
            <Pill key={t} outline={i!==1}>{t}</Pill>
          )}
        </Row>
        <div className="wf-card" style={{ padding: 0 }}>
          <Row align="center" style={{ padding: '12px 18px', borderBottom: '1px solid var(--line)', fontSize: 11, color:'var(--ink-300)', textTransform:'uppercase', letterSpacing:'0.08em' }}>
            <div style={{ flex: 1 }}>Fecha · Hora</div>
            <div style={{ flex: 2 }}>Cliente</div>
            <div style={{ flex: 1.5 }}>Servicio</div>
            <div style={{ flex: 1 }}>Estado</div>
            <div style={{ flex: 0.5 }}></div>
          </Row>
          {[
            ['Jue 14 may · 9:00','Cliente 1','Servicio 1','Confirmada'],
            ['Jue 14 may · 10:00','Cliente 2','Servicio 1','Confirmada'],
            ['Jue 14 may · 11:30','Cliente 3','Primer encuentro','Pendiente'],
            ['Jue 14 may · 14:00','Cliente 4','Servicio 2','Confirmada'],
            ['Vie 15 may · 9:00','Cliente 5','Servicio 1','Confirmada'],
            ['Vie 15 may · 11:00','Cliente 6','Servicio 3','Confirmada'],
            ['Mié 13 may · 14:00','Cliente 7','Servicio 1','Completada'],
            ['Mié 13 may · 16:00','Cliente 8','Servicio 2','No asistió'],
          ].map((r,i)=>(
            <Row align="center" key={i} style={{ padding: '14px 18px', borderBottom: i<7?'1px solid var(--line)':0 }}>
              <div style={{ flex: 1, fontSize: 12 }}>{r[0]}</div>
              <Row gap={10} style={{ flex: 2 }} align="center"><Photo w={26} h={26} rounded={999} label=""/><H3 size={13}>{r[1]}</H3></Row>
              <div style={{ flex: 1.5, fontSize: 12, color:'var(--ink-500)' }}>{r[2]}</div>
              <div style={{ flex: 1 }}><Pill outline={r[3]!=='Confirmada'}>{r[3]}</Pill></div>
              <div style={{ flex: 0.5, textAlign:'right', color:'var(--ink-500)' }}>•••</div>
            </Row>
          ))}
        </div>
      </Stack>
    </div>
  </AdminShell>
);

/* ─── CLIENTES ─── */

const AdminClients = () => (
  <AdminShell active="clients">
    <AdminTopbar title="Clientes" sub="42 personas en tu base" action="+ Nuevo"/>
    <div style={{ flex: 1, padding: 28, background:'var(--bg)', overflow:'hidden' }}>
      <Stack gap={16}>
        <Row justify="space-between">
          <Row gap={8}>
            {['Todos','Activos','Inactivos','Nuevos'].map((t,i)=><Pill key={t} outline={i!==0}>{t}</Pill>)}
          </Row>
          <Meta>Ordenar: última visita ▾</Meta>
        </Row>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 14 }}>
          {Array.from({length:9}).map((_,i)=>(
            <div key={i} className="wf-card" style={{ padding: 16 }}>
              <Stack gap={10}>
                <Row gap={10} align="center">
                  <Photo w={40} h={40} rounded={999} label=""/>
                  <Stack gap={2}>
                    <H3 size={13}>Cliente {i+1}</H3>
                    <Meta>Activo · 8 sesiones</Meta>
                  </Stack>
                </Row>
                <div className="wf-divider"/>
                <Stack gap={6}>
                  <Row gap={8}><Icon name="mail" size={11} color="var(--ink-300)"/><Meta>cliente{i+1}@correo.com</Meta></Row>
                  <Row gap={8}><Icon name="phone" size={11} color="var(--ink-300)"/><Meta>+506 0000 0000</Meta></Row>
                  <Row gap={8}><Icon name="clock" size={11} color="var(--ink-300)"/><Meta>Próx. jue 14 may</Meta></Row>
                </Stack>
              </Stack>
            </div>
          ))}
        </div>
      </Stack>
    </div>
  </AdminShell>
);

const AdminClientDetail = () => (
  <AdminShell active="clients">
    <AdminTopbar title="Cliente 1" sub="Activo · desde marzo 2025"/>
    <div style={{ flex: 1, padding: 28, background:'var(--bg)', overflow:'hidden' }}>
      <Row gap={20} align="flex-start">
        <div style={{ width: 280 }}>
          <div className="wf-card" style={{ padding: 20 }}>
            <Stack gap={14}>
              <Photo w={80} h={80} rounded={999} label="" style={{ margin: '0 auto' }}/>
              <Stack gap={4} style={{ textAlign:'center' }}>
                <H2 size={18}>Cliente 1</H2>
                <Meta>32 años · CR</Meta>
              </Stack>
              <div className="wf-divider"/>
              <Stack gap={10}>
                <Row gap={10}><Icon name="mail" size={12} color="var(--ink-500)"/><Meta>cliente1@correo.com</Meta></Row>
                <Row gap={10}><Icon name="phone" size={12} color="var(--ink-500)"/><Meta>+506 0000 0000</Meta></Row>
                <Row gap={10}><Icon name="location" size={12} color="var(--ink-500)"/><Meta>San Pedro, SJ</Meta></Row>
              </Stack>
              <Btn small block icon={false}>Enviar mensaje</Btn>
            </Stack>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <Stack gap={16}>
            <Row gap={14}>
              <Stat label="Sesiones" value="8"/>
              <Stat label="Asistencia" value="100%"/>
              <Stat label="Última" value="7 may"/>
            </Row>
            <div className="wf-card" style={{ padding: 0 }}>
              <Row gap={4} style={{ padding: '0 18px', borderBottom: '1px solid var(--line)' }}>
                {['Historial','Notas','Tareas','Documentos','Pagos'].map((t,i)=>
                  <div key={t} style={{ padding:'14px 4px', borderBottom: i===0?'2px solid var(--sage-500)':'2px solid transparent', fontSize: 12, fontWeight: i===0?500:400, color: i===0?'var(--ink-900)':'var(--ink-500)' }}>{t}</div>
                )}
              </Row>
              <Stack gap={0}>
                {['Jue 7 may · 10:00 · Servicio 1','Jue 30 abr · 10:00 · Servicio 1','Jue 23 abr · 10:00 · Servicio 1','Jue 16 abr · 10:00 · Servicio 1'].map((t,i)=>(
                  <Row align="center" key={i} justify="space-between" style={{ padding: '14px 18px', borderBottom: i<3?'1px solid var(--line)':0 }}>
                    <Row gap={12}><Icon name="check" size={12} color="var(--sage-700)"/><Body size={13}>{t}</Body></Row>
                    <Meta>Completada</Meta>
                  </Row>
                ))}
              </Stack>
            </div>
          </Stack>
        </div>
      </Row>
    </div>
  </AdminShell>
);

/* ─── SERVICIOS CRUD ─── */

const AdminServices = () => (
  <AdminShell active="services">
    <AdminTopbar title="Servicios" action="+ Nuevo servicio"/>
    <div style={{ flex: 1, padding: 28, background:'var(--bg)', overflow:'hidden' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 16 }}>
        {[
          ['Servicio 1','Terapia individual','50 min','₡25.000', true],
          ['Servicio 2','Terapia de pareja','80 min','₡40.000', true],
          ['Servicio 3','Terapia para adolescentes','50 min','₡25.000', true],
          ['Primer encuentro','Sesión gratuita inicial','20 min','Gratis', true],
          ['Evaluación','Evaluación clínica inicial','90 min','₡45.000', false],
        ].map(([n,d,dur,p,on],i)=>(
          <div key={i} className="wf-card" style={{ padding: 18, opacity: on?1:0.65 }}>
            <Stack gap={12}>
              <Row justify="space-between" align="flex-start">
                <Stack gap={4}>
                  <H3 size={15}>{n}</H3>
                  <Meta>{d}</Meta>
                </Stack>
                <div style={{ width:34, height:20, borderRadius:999, background: on?'var(--sage-500)':'var(--line-2)', padding: 2 }}>
                  <div style={{ width:16, height:16, borderRadius:999, background:'#fff', marginLeft: on?14:0 }}/>
                </div>
              </Row>
              <Row gap={8}>
                <Pill warm><Icon name="clock" size={10}/> {dur}</Pill>
                <Pill warm><Icon name="money" size={10}/> {p}</Pill>
              </Row>
              <div className="wf-divider"/>
              <Row gap={10}>
                <Btn small ghost icon={false}>Editar</Btn>
                <Btn small ghost icon={false}>Duplicar</Btn>
              </Row>
            </Stack>
          </div>
        ))}
      </div>
    </div>
  </AdminShell>
);

const AdminServiceEdit = () => (
  <AdminShell active="services">
    <AdminTopbar title="Editar servicio" sub="Servicio 1"/>
    <div style={{ flex: 1, padding: 28, background:'var(--bg)', overflow:'hidden' }}>
      <Row gap={20} align="flex-start">
        <div style={{ flex: 2 }}>
          <div className="wf-card" style={{ padding: 22 }}>
            <Stack gap={16}>
              <Stack gap={6}><Meta>Nombre del servicio</Meta><div className="wf-input" style={{ color: 'var(--ink-900)' }}>Servicio 1</div></Stack>
              <Stack gap={6}><Meta>Descripción corta</Meta><div className="wf-input" style={{ color: 'var(--ink-900)', minHeight: 80, alignItems:'flex-start' }}>Espacio individual para abordar lo que estás viviendo...</div></Stack>
              <Row gap={14}>
                <Stack gap={6} style={{ flex: 1 }}><Meta>Duración (min)</Meta><div className="wf-input" style={{ color: 'var(--ink-900)' }}>50</div></Stack>
                <Stack gap={6} style={{ flex: 1 }}><Meta>Precio (₡)</Meta><div className="wf-input" style={{ color: 'var(--ink-900)' }}>25.000</div></Stack>
              </Row>
              <Stack gap={6}>
                <Meta>Modalidad</Meta>
                <Row gap={8}><Pill>Online</Pill><Pill>Presencial</Pill><Pill outline>Híbrido</Pill></Row>
              </Stack>
              <Stack gap={6}>
                <Meta>Buffer antes/después</Meta>
                <Row gap={8}><Pill outline>0 min</Pill><Pill>15 min</Pill><Pill outline>30 min</Pill></Row>
              </Stack>
              <div className="wf-divider"/>
              <Row gap={10}>
                <Btn>Guardar cambios</Btn>
                <Btn ghost icon={false}>Cancelar</Btn>
              </Row>
            </Stack>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div className="wf-card warm" style={{ padding: 18 }}>
            <Stack gap={10}>
              <H3 size={14}>Vista previa pública</H3>
              <Meta>Cómo se verá en la web</Meta>
              <div className="wf-card" style={{ padding: 12, background:'#fff' }}>
                <Stack gap={8}>
                  <H3 size={13}>Servicio 1</H3>
                  <Meta>Espacio individual...</Meta>
                  <Row justify="space-between" align="center" style={{ marginTop: 4 }}><H3 size={15} style={{color:'var(--sage-700)'}}>₡25.000</H3><Pill warm>50 min</Pill></Row>
                </Stack>
              </div>
            </Stack>
          </div>
        </div>
      </Row>
    </div>
  </AdminShell>
);

const AdminLogin = () => (
  <Frame kind="desktop" style={{ width: 1280 }}>
    <div style={{ flex: 1, display:'grid', gridTemplateColumns: '1fr 1fr' }}>
      <div style={{ background:'var(--sage-500)', padding: 60, display:'flex', flexDirection:'column', justifyContent:'space-between', color:'var(--bg)' }}>
        <Row gap={10} align="center">
          <div style={{ width: 36, height: 36, borderRadius:999, background:'var(--sage-100)' }}/>
          <div style={{ fontFamily:'var(--serif)', fontSize: 18 }}>rosibel</div>
        </Row>
        <Stack gap={20}>
          <H1 size={48} style={{ color:'var(--bg)', lineHeight: 1.1 }}>
            Tu práctica,<br/>
            <span style={{ fontStyle:'italic' }}>en un solo lugar.</span>
          </H1>
          <Body style={{ color:'var(--sage-100)', maxWidth: 360 }}>
            Gestioná tu agenda, tus clientes y tu día desde un panel diseñado para vos.
          </Body>
        </Stack>
        <Meta style={{ color:'var(--sage-100)' }}>v1.0 — primera fase</Meta>
      </div>
      <div style={{ padding: 60, display:'flex', flexDirection:'column', justifyContent:'center', background:'var(--bg)' }}>
        <div style={{ maxWidth: 360 }}>
          <Stack gap={18}>
            <Eyebrow>Acceso admin</Eyebrow>
            <H2 size={28}>Iniciar sesión</H2>
            <Stack gap={12}>
              <div className="wf-input field"><div className="lbl">Correo</div><div className="ctrl">tu@correo.com</div></div>
              <div className="wf-input field"><div className="lbl">Contraseña</div><div className="ctrl">••••••••••</div></div>
            </Stack>
            <Row justify="space-between" align="center">
              <Row gap={8}><div style={{ width:14,height:14,borderRadius:3,border:'1.5px solid var(--line-2)' }}/><Meta>Recordarme</Meta></Row>
              <Meta style={{ color:'var(--sage-700)' }}>¿Olvidaste tu contraseña?</Meta>
            </Row>
            <Btn block>Entrar</Btn>
            <Meta style={{ textAlign:'center', color:'var(--ink-500)' }}>Acceso protegido con 2FA</Meta>
          </Stack>
        </div>
      </div>
    </div>
  </Frame>
);

Object.assign(window, {
  AdminLogin,
  AdminDashboardA, AdminDashboardB, AdminDashboardC,
  AdminCalendar, AdminAvailability,
  AdminAppts,
  AdminClients, AdminClientDetail,
  AdminServices, AdminServiceEdit,
});
