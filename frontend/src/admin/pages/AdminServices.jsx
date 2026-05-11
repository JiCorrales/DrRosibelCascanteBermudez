import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminTopbar } from '../AdminShell.jsx';
import { Btn, Stack, Row, H3, Body, Meta, Pill, Icon } from '../../components/primitives.jsx';
import { useServices, useUpdateService } from '../../lib/queries.js';
import { formatColon } from '../../data.js';

export default function AdminServices() {
  // activeOnly=false → la admin ve también los desactivados
  const servicesQ = useServices({ activeOnly: false });
  const updateService = useUpdateService();
  const services = servicesQ.data ?? [];

  useEffect(() => {
    document.title = 'Servicios · Admin · Rosibel';
  }, []);

  const toggle = (s) => {
    updateService.mutate({ id: s.id, patch: { active: !s.active } });
  };

  return (
    <>
      <AdminTopbar
        title="Servicios"
        sub={
          servicesQ.isLoading
            ? 'Cargando…'
            : `${services.length} servicio${services.length !== 1 ? 's' : ''} configurado${services.length !== 1 ? 's' : ''}`
        }
        action={<Btn small icon={false}>+ Nuevo</Btn>}
      />
      <div className="admin-content">
        {servicesQ.isError && (
          <Body
            role="alert"
            style={{
              marginBottom: 16,
              padding: '12px 16px',
              background: 'var(--danger-100)',
              color: 'var(--danger-500)',
              border: '1px solid rgb(var(--danger-rgb) / 0.28)',
              borderRadius: 'var(--r-md)',
            }}
          >
            No pudimos cargar los servicios: {servicesQ.error?.message ?? 'error desconocido'}
          </Body>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 18,
          }}
        >
          {services.map((s) => {
            const pendingToggle = updateService.isPending && updateService.variables?.id === s.id;
            return (
              <article
                key={s.id}
                className="wf-card"
                style={{ padding: 22, opacity: s.active ? 1 : 0.65 }}
              >
                <Stack gap={14}>
                  <Row justify="space-between" align="flex-start">
                    <Stack gap={4}>
                      <H3 size={17}>{s.name}</H3>
                      <Meta>{s.desc}</Meta>
                    </Stack>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={s.active}
                      aria-label={`${s.active ? 'Desactivar' : 'Activar'} ${s.name}`}
                      onClick={() => toggle(s)}
                      disabled={pendingToggle}
                      style={{
                        width: 38,
                        height: 22,
                        borderRadius: 999,
                        background: s.active ? 'var(--sage-500)' : 'var(--line-2)',
                        border: 0,
                        padding: 2,
                        cursor: pendingToggle ? 'wait' : 'pointer',
                        flexShrink: 0,
                        opacity: pendingToggle ? 0.6 : 1,
                      }}
                    >
                      <span
                        style={{
                          display: 'block',
                          width: 18,
                          height: 18,
                          borderRadius: 999,
                          background: '#fff',
                          transform: s.active ? 'translateX(16px)' : 'translateX(0)',
                          transition: 'transform 0.18s',
                        }}
                      />
                    </button>
                  </Row>
                  <Row gap={8} wrap>
                    <Pill warm>
                      <Icon name="clock" size={11} /> {s.dur} min
                    </Pill>
                    <Pill warm>
                      <Icon name="money" size={11} /> {formatColon(s.price)}
                    </Pill>
                    <Pill warm>
                      {s.modality === 'both'
                        ? 'Online + presencial'
                        : s.modality === 'online'
                        ? 'Online'
                        : 'Presencial'}
                    </Pill>
                  </Row>
                  <div className="wf-divider" />
                  <Row gap={10}>
                    <Btn as={Link} to={`/admin/servicios/${s.id}`} small ghost icon={false}>
                      Editar
                    </Btn>
                    <Btn small ghost icon={false}>
                      Duplicar
                    </Btn>
                  </Row>
                </Stack>
              </article>
            );
          })}
        </div>
      </div>
    </>
  );
}
