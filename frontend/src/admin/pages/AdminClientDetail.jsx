import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { AdminTopbar, StatCard, StatusPill } from '../AdminShell.jsx';
import { Btn, Stack, Row, H3, Body, Meta, Photo, Icon } from '../../components/primitives.jsx';
import {
  useClient,
  useClientBookings,
  useTasksForClient,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useDocumentsForClient,
  useCreateDocument,
  useDeleteDocument,
  useClinicalNotes,
  useCreateClinicalNote,
  useUpdateClinicalNote,
  useDeleteClinicalNote,
} from '../../lib/queries.js';
import { WHATSAPP_PREFILL, buildWaUrlForPhone } from '../../data.js';

const TABS = ['Historial', 'Notas', 'Tareas', 'Documentos', 'Pagos'];

const SHORT_DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

const displayName = (c) => c?.full_name ?? c?.name ?? '';
const firstNameOf = (c) => (displayName(c).split(' ')[0] ?? 'la persona');

function formatApptDate(isoDate) {
  if (!isoDate) return '—';
  const d = new Date(isoDate + 'T12:00:00');
  return `${SHORT_DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export default function AdminClientDetail() {
  const { id } = useParams();
  const clientQ = useClient(id);
  const apptsQ = useClientBookings(id);
  const [tab, setTab] = useState('Historial');
  const [showMessage, setShowMessage] = useState(false);

  const client = clientQ.data;
  const appts = apptsQ.data ?? [];

  useEffect(() => {
    if (client) document.title = `${displayName(client)} · Admin · Rosibel`;
  }, [client]);

  // Si la query terminó y el cliente no existe → 404 hacia listado
  if (!clientQ.isLoading && !clientQ.isError && client === null) {
    return <Navigate to="/admin/clientes" replace />;
  }

  if (clientQ.isLoading) {
    return (
      <>
        <AdminTopbar title="Cargando…" />
        <div className="admin-content">
          <Body style={{ color: 'var(--ink-500)' }}>Cargando cliente…</Body>
        </div>
      </>
    );
  }

  if (clientQ.isError) {
    return (
      <>
        <AdminTopbar title="Cliente" />
        <div className="admin-content">
          <Body
            role="alert"
            style={{
              padding: '12px 16px',
              background: 'var(--danger-100)',
              color: 'var(--danger-500)',
              border: '1px solid rgb(var(--danger-rgb) / 0.28)',
              borderRadius: 'var(--r-md)',
            }}
          >
            No pudimos cargar el cliente: {clientQ.error?.message ?? 'error desconocido'}
          </Body>
        </div>
      </>
    );
  }

  const completed = appts.filter((a) => a.status === 'completed').length;
  const finalized = appts.filter((a) => a.status !== 'pending' && a.status !== 'confirmed').length;
  const attendance = finalized ? Math.round((completed / finalized) * 100) : 100;
  const lastAppt = appts.find((a) => a.status === 'completed');
  const sessionsCount = client?.sessions ?? completed;
  const since = client?.since ?? (client?.first_visit ? formatApptDate(client.first_visit) : 'reciente');

  return (
    <>
      <AdminTopbar
        title={displayName(client)}
        sub={`${client?.status === 'active' ? 'Activo' : client?.status === 'new' ? 'Nuevo' : 'Cliente'} · desde ${since}`}
        action={
          <Btn as={Link} to="/admin/clientes" ghost small icon={false}>
            ← Volver
          </Btn>
        }
      />
      <div className="admin-content">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 320px) minmax(0, 1fr)',
            gap: 24,
            alignItems: 'flex-start',
          }}
          className="client-detail-grid"
        >
          <article className="wf-card" style={{ padding: 24 }}>
            <Stack gap={16}>
              <Photo w={96} h={96} rounded={999} label="" style={{ margin: '0 auto' }} />
              <Stack gap={4} style={{ textAlign: 'center' }}>
                <H3 size={22}>{displayName(client)}</H3>
                <Meta>
                  {[client?.age && `${client.age} años`, client?.city].filter(Boolean).join(' · ') || ' '}
                </Meta>
              </Stack>
              <div className="wf-divider" />
              <Stack gap={12}>
                <Row gap={10}>
                  <Icon name="mail" size={14} color="var(--ink-500)" />
                  <Meta>{client?.email}</Meta>
                </Row>
                {client?.phone && (
                  <Row gap={10}>
                    <Icon name="phone" size={14} color="var(--ink-500)" />
                    <Meta>{client.phone}</Meta>
                  </Row>
                )}
                {client?.city && (
                  <Row gap={10}>
                    <Icon name="location" size={14} color="var(--ink-500)" />
                    <Meta>{client.city}</Meta>
                  </Row>
                )}
              </Stack>
              <Btn block small icon={false} onClick={() => setShowMessage(true)}>
                Enviar mensaje
              </Btn>
            </Stack>
          </article>

          <Stack gap={20}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: 14,
              }}
            >
              <StatCard label="Sesiones" value={sessionsCount ?? 0} />
              <StatCard label="Asistencia" value={`${attendance}%`} />
              <StatCard
                label="Última"
                value={lastAppt ? formatApptDate(lastAppt.date) : '—'}
              />
            </div>

            <article className="wf-card" style={{ padding: 0 }}>
              <Row gap={4} style={{ padding: '0 24px', borderBottom: '1px solid var(--line)' }} wrap>
                {TABS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    role="tab"
                    aria-selected={tab === t}
                    onClick={() => setTab(t)}
                    style={{
                      all: 'unset',
                      cursor: 'pointer',
                      padding: '16px 6px',
                      fontFamily: 'var(--sans)',
                      fontSize: 13,
                      fontWeight: tab === t ? 500 : 400,
                      color: tab === t ? 'var(--ink-900)' : 'var(--ink-500)',
                      borderBottom: tab === t ? '2px solid var(--sage-500)' : '2px solid transparent',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </Row>

              <div style={{ padding: tab === 'Historial' ? 0 : 24 }}>
                {tab === 'Historial' && (
                  <Stack gap={0}>
                    {apptsQ.isLoading && (
                      <Body style={{ padding: 24, color: 'var(--ink-500)' }}>Cargando historial…</Body>
                    )}
                    {!apptsQ.isLoading && appts.length === 0 && (
                      <Body style={{ padding: 24, color: 'var(--ink-500)' }}>
                        Sin citas registradas.
                      </Body>
                    )}
                    {appts.map((a, i) => (
                      <Row
                        key={a.id}
                        justify="space-between"
                        align="center"
                        style={{
                          padding: '16px 24px',
                          borderBottom: i < appts.length - 1 ? '1px solid var(--line)' : 0,
                        }}
                      >
                        <Row gap={14} align="center">
                          <Icon
                            name={a.status === 'completed' ? 'check' : 'cal'}
                            size={14}
                            color="var(--sage-700)"
                          />
                          <Stack gap={2}>
                            <H3 size={13}>
                              {formatApptDate(a.date)} · {a.time}
                            </H3>
                            <Meta>{a.service?.name ?? 'Servicio'}</Meta>
                          </Stack>
                        </Row>
                        <StatusPill status={a.status} />
                      </Row>
                    ))}
                  </Stack>
                )}
                {tab === 'Notas' && <NotesTab clientId={id} clientName={firstNameOf(client)} />}
                {tab === 'Tareas' && <TasksTab clientId={id} clientName={firstNameOf(client)} />}
                {tab === 'Documentos' && <DocumentsTab clientId={id} clientName={firstNameOf(client)} />}
                {tab === 'Pagos' && (
                  <Body style={{ color: 'var(--ink-500)' }}>
                    Historial de pagos por sesión (SINPE, transferencia o tarjeta).
                  </Body>
                )}
              </div>
            </article>
          </Stack>
        </div>
      </div>

      {showMessage && client && (
        <MessageClientModal client={client} onClose={() => setShowMessage(false)} />
      )}

      <style>{`
        @media (max-width: 1100px) {
          .client-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

function MessageClientModal({ client, onClose }) {
  const firstName = firstNameOf(client);
  const waMessage = WHATSAPP_PREFILL.admin_to_client.replace('{{nombre}}', firstName);
  const waUrl = buildWaUrlForPhone(client.phone, waMessage);
  const mailSubject = encodeURIComponent('Consulta · Rosibel Cascante');
  const mailBody = encodeURIComponent(`Hola ${firstName},\n\n`);
  const mailUrl = client.email ? `mailto:${client.email}?subject=${mailSubject}&body=${mailBody}` : null;

  return (
    <div className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="msg-client-title">
      <button
        type="button"
        className="admin-modal__backdrop"
        onClick={onClose}
        aria-label="Cerrar"
      />
      <div className="admin-modal__panel" style={{ maxWidth: 420 }}>
        <Row justify="space-between" align="center" style={{ marginBottom: 12 }}>
          <H3 id="msg-client-title" size={18}>Escribirle a {firstName}</H3>
          <button
            type="button"
            className="admin-modal__close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </Row>
        <Stack gap={14}>
          <Meta>Elegí el canal. El mensaje queda pre-llenado, podés editarlo antes de enviar.</Meta>

          <a
            href={waUrl ?? undefined}
            target={waUrl ? '_blank' : undefined}
            rel="noopener noreferrer"
            aria-disabled={!waUrl}
            onClick={(e) => {
              if (!waUrl) {
                e.preventDefault();
                return;
              }
              onClose();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 18px',
              borderRadius: 'var(--r-md)',
              background: waUrl ? '#1FA851' : 'var(--line-2)',
              color: waUrl ? '#fff' : 'var(--ink-300)',
              textDecoration: 'none',
              fontFamily: 'var(--sans)',
              fontWeight: 600,
              fontSize: 14,
              cursor: waUrl ? 'pointer' : 'not-allowed',
              opacity: waUrl ? 1 : 0.7,
            }}
            title={waUrl ? `WhatsApp a ${client.phone}` : 'Este cliente no tiene teléfono registrado'}
          >
            <Icon name="whatsapp" size={18} />
            <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
              <span>WhatsApp</span>
              <span style={{ fontSize: 12, fontWeight: 400, opacity: 0.85 }}>
                {waUrl ? client.phone : 'Sin teléfono registrado'}
              </span>
            </Stack>
          </a>

          <a
            href={mailUrl ?? undefined}
            aria-disabled={!mailUrl}
            onClick={(e) => {
              if (!mailUrl) {
                e.preventDefault();
                return;
              }
              onClose();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 18px',
              borderRadius: 'var(--r-md)',
              background: mailUrl ? 'var(--sage-500)' : 'var(--line-2)',
              color: mailUrl ? '#fff' : 'var(--ink-300)',
              textDecoration: 'none',
              fontFamily: 'var(--sans)',
              fontWeight: 600,
              fontSize: 14,
              cursor: mailUrl ? 'pointer' : 'not-allowed',
              opacity: mailUrl ? 1 : 0.7,
            }}
            title={mailUrl ? `Correo a ${client.email}` : 'Este cliente no tiene correo registrado'}
          >
            <Icon name="mail" size={18} />
            <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
              <span>Correo</span>
              <span style={{ fontSize: 12, fontWeight: 400, opacity: 0.85 }}>
                {mailUrl ? client.email : 'Sin correo registrado'}
              </span>
            </Stack>
          </a>

          <Row gap={8} justify="flex-end" style={{ marginTop: 4 }}>
            <Btn ghost small icon={false} onClick={onClose} type="button">
              Cancelar
            </Btn>
          </Row>
        </Stack>
      </div>
    </div>
  );
}

function NotesTab({ clientId, clientName }) {
  const notesQ = useClinicalNotes(clientId);
  const createNote = useCreateClinicalNote();
  const updateNote = useUpdateClinicalNote();
  const deleteNote = useDeleteClinicalNote();
  const [body, setBody] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingBody, setEditingBody] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    try {
      await createNote.mutateAsync({ client_id: clientId, body: body.trim() });
      setBody('');
    } catch {
      /* error visible vía mutation isError */
    }
  };

  const startEdit = (note) => {
    setEditingId(note.id);
    setEditingBody(note.body);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingBody('');
  };

  const saveEdit = async () => {
    if (!editingBody.trim()) return;
    try {
      await updateNote.mutateAsync({ id: editingId, body: editingBody.trim() });
      cancelEdit();
    } catch {
      /* error visible vía mutation isError */
    }
  };

  const handleDelete = (note) => {
    if (window.confirm('¿Eliminar esta nota? No se puede recuperar.')) {
      deleteNote.mutate(note.id);
    }
  };

  const notes = notesQ.data ?? [];
  const formatDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString('es-CR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Stack gap={20}>
      <form onSubmit={handleCreate}>
        <Stack gap={10}>
          <H3 size={14}>Nueva nota sobre {clientName}</H3>
          <Meta>Las notas son privadas. Solo vos las ves — el paciente nunca las verá.</Meta>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Observaciones de la sesión, plan de trabajo, hipótesis…"
            rows={5}
            style={{
              background: '#fff',
              border: '1px solid var(--line-2)',
              borderRadius: 'var(--r-md)',
              padding: '12px 14px',
              fontSize: 14,
              fontFamily: 'var(--sans)',
              outline: 'none',
              width: '100%',
              resize: 'vertical',
              minHeight: 100,
            }}
          />
          <Row gap={8}>
            <Btn type="submit" small icon={false} disabled={createNote.isPending || !body.trim()}>
              {createNote.isPending ? 'Guardando…' : 'Guardar nota'}
            </Btn>
            {createNote.isError && (
              <Meta style={{ color: 'var(--danger-500)' }}>
                Error: {createNote.error?.message}
              </Meta>
            )}
          </Row>
        </Stack>
      </form>

      <div className="wf-divider" />

      <Stack gap={10}>
        <Meta>{notes.length} nota{notes.length !== 1 ? 's' : ''}</Meta>
        {notesQ.isLoading && <Body style={{ color: 'var(--ink-500)' }}>Cargando…</Body>}
        {!notesQ.isLoading && notes.length === 0 && (
          <Body style={{ color: 'var(--ink-500)' }}>Aún no hay notas para {clientName}.</Body>
        )}
        {notes.map((n) => {
          const isEditing = editingId === n.id;
          return (
            <article key={n.id} className="wf-card" style={{ padding: 14 }}>
              <Stack gap={8}>
                <Row justify="space-between" align="flex-start">
                  <Meta>
                    {formatDate(n.created_at)}
                    {n.updated_at && n.updated_at !== n.created_at && ' · editada'}
                  </Meta>
                  {!isEditing && (
                    <Row gap={6}>
                      <Btn small ghost icon={false} onClick={() => startEdit(n)}>
                        Editar
                      </Btn>
                      <button
                        type="button"
                        onClick={() => handleDelete(n)}
                        aria-label="Eliminar nota"
                        style={{
                          background: 'transparent',
                          border: 0,
                          padding: 6,
                          cursor: 'pointer',
                          color: 'var(--ink-300)',
                        }}
                      >
                        <Icon name="trash" size={14} />
                      </button>
                    </Row>
                  )}
                </Row>
                {isEditing ? (
                  <Stack gap={8}>
                    <textarea
                      value={editingBody}
                      onChange={(e) => setEditingBody(e.target.value)}
                      rows={5}
                      style={{
                        background: '#fff',
                        border: '1px solid var(--line-2)',
                        borderRadius: 'var(--r-md)',
                        padding: '10px 14px',
                        fontSize: 14,
                        fontFamily: 'var(--sans)',
                        outline: 'none',
                        width: '100%',
                        resize: 'vertical',
                        minHeight: 100,
                      }}
                    />
                    <Row gap={6}>
                      <Btn small icon={false} onClick={saveEdit} disabled={updateNote.isPending || !editingBody.trim()}>
                        {updateNote.isPending ? 'Guardando…' : 'Guardar'}
                      </Btn>
                      <Btn small ghost icon={false} onClick={cancelEdit} type="button">
                        Cancelar
                      </Btn>
                    </Row>
                  </Stack>
                ) : (
                  <Body size={14} style={{ whiteSpace: 'pre-wrap' }}>{n.body}</Body>
                )}
              </Stack>
            </article>
          );
        })}
      </Stack>
    </Stack>
  );
}

const TASK_STATUS_LABELS = {
  pending: 'Pendiente',
  in_progress: 'En progreso',
  done: 'Hecha',
  skipped: 'Omitida',
};

const DOC_KIND_LABELS = {
  pdf: 'PDF',
  audio: 'Audio',
  video: 'Video',
  image: 'Imagen',
  link: 'Enlace',
};

function TasksTab({ clientId, clientName }) {
  const tasksQ = useTasksForClient(clientId);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await createTask.mutateAsync({
        client_id: clientId,
        title: title.trim(),
        description: description.trim() || null,
      });
      setTitle('');
      setDescription('');
    } catch {
      /* error visible vía mutation isError */
    }
  };

  const handleStatus = (task, nextStatus) => {
    updateTask.mutate({ id: task.id, patch: { status: nextStatus } });
  };

  const handleDelete = (task) => {
    if (window.confirm(`¿Eliminar la tarea "${task.title}"?`)) {
      deleteTask.mutate(task.id);
    }
  };

  const tasks = tasksQ.data ?? [];

  return (
    <Stack gap={20}>
      <form onSubmit={handleCreate}>
        <Stack gap={10}>
          <H3 size={14}>Asignar nueva tarea a {clientName}</H3>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título de la tarea"
            required
            style={{
              background: '#fff',
              border: '1px solid var(--line-2)',
              borderRadius: 'var(--r-md)',
              padding: '10px 14px',
              fontSize: 14,
              fontFamily: 'var(--sans)',
              outline: 'none',
              width: '100%',
            }}
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción (opcional)"
            rows={2}
            style={{
              background: '#fff',
              border: '1px solid var(--line-2)',
              borderRadius: 'var(--r-md)',
              padding: '10px 14px',
              fontSize: 13,
              fontFamily: 'var(--sans)',
              outline: 'none',
              width: '100%',
              resize: 'vertical',
              minHeight: 56,
            }}
          />
          <Row gap={8}>
            <Btn type="submit" small icon={false} disabled={createTask.isPending || !title.trim()}>
              {createTask.isPending ? 'Asignando…' : 'Asignar tarea'}
            </Btn>
            {createTask.isError && (
              <Meta style={{ color: 'var(--danger-500)' }}>
                Error: {createTask.error?.message}
              </Meta>
            )}
          </Row>
        </Stack>
      </form>

      <div className="wf-divider" />

      <Stack gap={10}>
        <Meta>{tasks.length} tarea{tasks.length !== 1 ? 's' : ''} asignadas</Meta>
        {tasksQ.isLoading && <Body style={{ color: 'var(--ink-500)' }}>Cargando…</Body>}
        {!tasksQ.isLoading && tasks.length === 0 && (
          <Body style={{ color: 'var(--ink-500)' }}>Sin tareas asignadas.</Body>
        )}
        {tasks.map((t) => {
          const done = t.status === 'done';
          return (
            <article
              key={t.id}
              className="wf-card"
              style={{ padding: 14, opacity: done ? 0.7 : 1 }}
            >
              <Stack gap={8}>
                <Row justify="space-between" align="flex-start">
                  <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
                    <H3
                      size={14}
                      style={{
                        textDecoration: done ? 'line-through' : 'none',
                        color: done ? 'var(--ink-300)' : 'var(--ink-900)',
                      }}
                    >
                      {t.title}
                    </H3>
                    {t.description && <Body size={13}>{t.description}</Body>}
                    <Meta>
                      {TASK_STATUS_LABELS[t.status] ?? t.status}
                      {t.completed_at && ` · completada ${new Date(t.completed_at).toLocaleDateString('es-CR')}`}
                    </Meta>
                  </Stack>
                  <Row gap={6}>
                    {!done && (
                      <Btn small ghost icon={false} onClick={() => handleStatus(t, 'done')}>
                        Marcar hecha
                      </Btn>
                    )}
                    {done && (
                      <Btn small ghost icon={false} onClick={() => handleStatus(t, 'pending')}>
                        Reabrir
                      </Btn>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(t)}
                      aria-label={`Eliminar tarea ${t.title}`}
                      style={{
                        background: 'transparent',
                        border: 0,
                        padding: 6,
                        cursor: 'pointer',
                        color: 'var(--ink-300)',
                      }}
                    >
                      <Icon name="trash" size={14} />
                    </button>
                  </Row>
                </Row>
              </Stack>
            </article>
          );
        })}
      </Stack>
    </Stack>
  );
}

function DocumentsTab({ clientId, clientName }) {
  const docsQ = useDocumentsForClient(clientId);
  const createDoc = useCreateDocument();
  const deleteDoc = useDeleteDocument();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [kind, setKind] = useState('pdf');

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    try {
      await createDoc.mutateAsync({
        client_id: clientId,
        title: title.trim(),
        external_url: url.trim(),
        kind,
        meta: `${DOC_KIND_LABELS[kind]} · enlace externo`,
      });
      setTitle('');
      setUrl('');
      setKind('pdf');
    } catch {
      /* error visible vía createDoc.isError */
    }
  };

  const handleDelete = (doc) => {
    if (window.confirm(`¿Quitar "${doc.title}" del portal de ${clientName}?`)) {
      deleteDoc.mutate(doc.id);
    }
  };

  const docs = docsQ.data ?? [];

  return (
    <Stack gap={20}>
      <form onSubmit={handleCreate}>
        <Stack gap={10}>
          <H3 size={14}>Compartir un documento con {clientName}</H3>
          <Meta>
            Pegá un link de Google Drive, Dropbox o cualquier servicio. {clientName} lo verá
            en su portal y lo podrá abrir.
          </Meta>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título visible (ej. Plan de trabajo · 1er trimestre)"
            required
            style={{
              background: '#fff',
              border: '1px solid var(--line-2)',
              borderRadius: 'var(--r-md)',
              padding: '10px 14px',
              fontSize: 14,
              fontFamily: 'var(--sans)',
              outline: 'none',
              width: '100%',
            }}
          />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://drive.google.com/…"
            required
            style={{
              background: '#fff',
              border: '1px solid var(--line-2)',
              borderRadius: 'var(--r-md)',
              padding: '10px 14px',
              fontSize: 14,
              fontFamily: 'var(--sans)',
              outline: 'none',
              width: '100%',
            }}
          />
          <Row gap={8} wrap>
            <span style={{ fontSize: 12, color: 'var(--ink-500)', alignSelf: 'center' }}>Tipo:</span>
            {Object.entries(DOC_KIND_LABELS).map(([k, label]) => (
              <button
                key={k}
                type="button"
                onClick={() => setKind(k)}
                style={{ all: 'unset', cursor: 'pointer' }}
                aria-pressed={kind === k}
              >
                <span className={`wf-pill ${kind === k ? '' : 'outline'}`}>{label}</span>
              </button>
            ))}
          </Row>
          <Row gap={8}>
            <Btn type="submit" small icon={false} disabled={createDoc.isPending || !title.trim() || !url.trim()}>
              {createDoc.isPending ? 'Compartiendo…' : 'Compartir documento'}
            </Btn>
            {createDoc.isError && (
              <Meta style={{ color: 'var(--danger-500)' }}>
                Error: {createDoc.error?.message}
              </Meta>
            )}
          </Row>
        </Stack>
      </form>

      <div className="wf-divider" />

      <Stack gap={10}>
        <Meta>{docs.length} documento{docs.length !== 1 ? 's' : ''} compartido{docs.length !== 1 ? 's' : ''}</Meta>
        {docsQ.isLoading && <Body style={{ color: 'var(--ink-500)' }}>Cargando…</Body>}
        {!docsQ.isLoading && docs.length === 0 && (
          <Body style={{ color: 'var(--ink-500)' }}>Sin documentos compartidos.</Body>
        )}
        {docs.map((d) => (
          <article key={d.id} className="wf-card" style={{ padding: 14 }}>
            <Row gap={12} align="center">
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: 'var(--sage-100)',
                  color: 'var(--sage-700)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon name="doc" size={16} />
              </span>
              <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                <H3 size={13}>{d.title}</H3>
                <Meta>
                  {DOC_KIND_LABELS[d.kind] ?? d.kind}
                  {d.external_url && ' · enlace externo'}
                </Meta>
              </Stack>
              {d.external_url && (
                <a
                  href={d.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 12, color: 'var(--sage-700)' }}
                >
                  Abrir →
                </a>
              )}
              <button
                type="button"
                onClick={() => handleDelete(d)}
                aria-label={`Quitar documento ${d.title}`}
                style={{
                  background: 'transparent',
                  border: 0,
                  padding: 6,
                  cursor: 'pointer',
                  color: 'var(--ink-300)',
                }}
              >
                <Icon name="trash" size={14} />
              </button>
            </Row>
          </article>
        ))}
      </Stack>
    </Stack>
  );
}
