# Guía del sitio — Dra. Rosibel Cascante Bermúdez

Bienvenida, Rosibel. Este documento te explica **todo lo que el sitio puede hacer hoy** y cómo va a verse tanto desde el lado de tus pacientes como desde tu panel de administración. Está pensado para que lo recorrás con calma, con el sitio abierto al lado, y me digas qué te gusta, qué cambiarías y qué falta antes de salir oficialmente.

> **Lugar para abrirlo:** <https://jicorrales.github.io/DrRosibelCascanteBermudez/>

---

## 1. Qué tenés hoy

El proyecto tiene **tres superficies**, todas accesibles desde la URL de arriba:

| Superficie | Para quién | URL | Estado |
|---|---|---|---|
| **Sitio público** | Pacientes y posibles pacientes | `/` | Funcional, con copy y datos provisionales |
| **Panel admin** | Vos, la doctora | `/admin/login` | Demo navegable, sin guardar datos todavía |
| **Portal del paciente** | Pacientes activos (Fase 2) | `/portal/login` | Demo navegable, igual |

Lo que ves hoy es un **prototipo funcional**. Cada botón abre lo que tiene que abrir, los flujos completos (reservar una cita, navegar el panel, ver el portal del paciente) funcionan de extremo a extremo. La parte que **todavía no está conectada** es la base de datos: si una persona reserva, no se guarda en ningún lado, no te llega un correo, y vos no podés ver esa reserva en tu panel. Esa es la última fase del proyecto — primero quería que vieras la experiencia completa y nos pusiéramos de acuerdo en cómo se ve y qué cambia, antes de invertir tiempo en lo que no se ve (servidores, correos, pagos).

---

## 2. Lo que ven tus pacientes (sitio público)

### 2.1. Página principal

Cuando alguien entra a tu sitio, eso es lo primero que ve. La página tiene **9 secciones** acomodadas verticalmente:

1. **Hero** — Foto editorial tuya + frase principal ("Un espacio para *volver a vos*") + botón "Agendar cita".
2. **Sobre mí** — Foto del consultorio (placeholder por ahora) + párrafo corto sobre quién sos, tres credenciales con check verde.
3. **Cómo trabajo** — Tres principios numerados: "Sin juicio", "Basado en evidencia", "A tu ritmo".
4. **Servicios** — Las tres terapias principales como tarjetas, cada una con precio y duración. Tocar una tarjeta abre la página individual del servicio. Hay un botón "Ver todos los servicios" abajo.
5. **Qué trabajamos** — Grid de 9 razones por las que la gente busca terapia (Ansiedad, Duelo, Pareja, Autoestima, Estrés laboral, Familia, Cambios de vida, Trauma, Identidad), cada una con su ícono.
6. **Testimonios** — Una cita en grande, con tu paciente + tiempo en proceso. Las cuatro citas se rotan con los puntitos abajo.
7. **Preguntas frecuentes** — Acordeón de 5 preguntas (duración, online/presencial, formas de pago, cancelaciones, confidencialidad).
8. **CTA final** — Bloque verde salvia invitando a reservar la primera sesión gratis, con tus datos de contacto a la derecha.
9. **Footer** — Pie de página oscuro con navegación, recursos y datos de contacto.

> **Importante:** los textos de cada sección son una **base** — coherentes con tu manera de trabajar pero genéricos. Cuando los leás, si algo no suena como vos, lo cambiamos.

### 2.2. Página de "Sobre mí" extendida

Desde el header (arriba a la derecha) o desde la sección de Sobre mí en la home, se llega a una página completa con:

- Tu nombre completo
- Foto extendida (hoy es la misma foto del hero)
- Dos párrafos de bio profesional
- Una línea de tiempo de formación: 2015 UCR, 2018 Maestría, 2020 Especialización en trauma
- Tus credenciales y código CPCR
- Un botón grande para agendar cita

> **Pendiente con vos:** confirmar el año exacto de tu licenciatura, tu número real de CPCR, y si tenés otras especializaciones para sumar.

### 2.3. Catálogo de servicios

Página dedicada con las cuatro opciones que ofrecés:

| Servicio | Duración | Precio actual (provisional) |
|---|---|---|
| Terapia individual | 50 min | ₡25.000 |
| Terapia de pareja | 80 min | ₡40.000 |
| Terapia para adolescentes | 50 min | ₡25.000 |
| Primer encuentro | 20 min | Gratis |

Cada tarjeta tiene dos botones: **"Ver detalle"** (abre una página propia con el detalle completo) y **"Reservar"** (abre el flujo de reserva con el servicio ya pre-seleccionado).

### 2.4. Página individual de cada servicio

Por ejemplo, si entrás a `/servicios/individual`, vas a ver:

- Eyebrow "Servicio" + el nombre grande
- Pills con duración, precio y modalidad ("Online / presencial")
- Descripción "¿De qué se trata?"
- Una lista "Para vos si..." con tres situaciones donde ese servicio aplica
- Cómo funciona la dinámica de las sesiones
- Un banner verde al final con "¿Listo para empezar?" + botón directo a reservar ese servicio

> **Pendiente con vos:** los precios, duraciones y descripciones son una propuesta. Necesito que los revisés y me digás cuáles son los reales.

### 2.5. Flujo de reserva (`/reservar`)

Este es **el corazón del sitio**: cómo una persona reserva una cita con vos sin tener que llamar. Tiene **cuatro pasos**:

#### Paso 1 — Elegir servicio

El paciente ve las cuatro opciones y selecciona una. Si llegó desde una tarjeta de servicio o desde un botón "Reservar primera sesión gratis", el servicio ya viene pre-seleccionado. Hay una barra de progreso arriba para que sepa en qué paso está.

#### Paso 2 — Elegir día y hora

Aparece un calendario de mayo 2026 (es una demo, después se conecta con tu calendario real). Los días verdes claros son los disponibles, los grises son los no disponibles. Tocás un día disponible y abajo aparecen las **horas libres**: 9:00, 10:00, 11:00, 14:00, 15:00, 16:00.

#### Paso 3 — Datos del paciente

Formulario con tres campos obligatorios (Nombre, Correo, Teléfono), un campo opcional ("¿Qué te trae a terapia?") y un check para aceptar el aviso de privacidad. **No se puede continuar sin completar todo eso ni sin el check.**

#### Paso 4 — Confirmación

Pantalla de éxito con:
- Un check grande en verde
- "Listo — nos *vemos pronto*."
- El correo del paciente destacado (para que sepa por dónde le llega la confirmación)
- Resumen de la cita: servicio, fecha, duración, total
- Dos botones: "Agregar a calendario" y "Volver al inicio"

> **Estado real hoy:** el flujo se completa pero los datos **no se guardan en ningún lado todavía**. Cuando integremos la base de datos, este mismo flujo va a (a) guardar la reserva en tu base, (b) enviarte un correo a vos avisándote, (c) enviar un correo al paciente con la confirmación + link para reagendar.

### 2.6. Página 404

Si alguien escribe mal una URL, ve una página amable que dice "No encontré *esta página*" y un botón "Volver al inicio".

---

## 3. Tu panel admin

> **Acceso:** <https://jicorrales.github.io/DrRosibelCascanteBermudez/admin/login>
>
> **Para ingresar a la demo:** cualquier correo + cualquier contraseña funciona. Cuando esté el backend real, será tu correo + tu contraseña + verificación en dos pasos.

El panel admin es donde **vos** vas a manejar todo el día a día de tu consulta. Funciona tanto en **laptop** (vista completa con barra lateral fija) como en **celular** (barra superior + menú deslizable + acceso rápido en la parte de abajo). Lo mismo: filtros, tablas y calendario se adaptan automáticamente al tamaño de pantalla — en celular las citas aparecen como tarjetas en lugar de tabla, y el calendario muestra un día a la vez con un selector de día arriba.

### 3.1. Login

Pantalla dividida en dos: a la izquierda un panel verde salvia con tu marca y la frase "Tu práctica, *en un solo lugar*". A la derecha, el formulario simple. Después de entrar, te lleva al Dashboard.

### 3.2. Dashboard (pantalla principal)

Es lo primero que ves cuando entrás al panel. Te muestra:

- Un saludo personalizado con el día actual ("Buenos días, Rosibel — Jueves 14 de mayo, 2026")
- **Cuatro indicadores arriba**:
  - **Citas hoy** — cuántas sesiones tenés en el día
  - **Semana** — total de citas de la semana, con comparación contra la semana anterior
  - **Pendientes** — reservas que necesitan tu confirmación
  - **Ingresos mes** — total facturado a la fecha
- **Agenda de hoy** — lista de las citas del día con la hora, nombre del paciente, servicio, modalidad (online/presencial) y estado (Confirmada/Pendiente).
- **Próximamente** — preview de los próximos días (cuántas citas mañana, si el sábado es libre, etc.).
- **Card destacado de reservas nuevas** — si hay reservas pendientes de confirmar, aparece una alerta verde con un botón "Revisar" que te lleva directo a esa lista filtrada.

### 3.3. Calendario semanal

Vista de **hora × día** para toda la semana. Cada cita aparece como un bloque vertical con el nombre del paciente y la hora. Los bloques verdes son confirmadas, los ámbar son pendientes. El día de hoy queda destacado en verde claro.

Arriba: botón "Hoy" para volver al día actual, flechas para semana anterior/siguiente, y selector "Día / Semana / Mes".

### 3.4. Disponibilidad

Acá controlás cuándo aceptás reservas. La pantalla tiene dos columnas:

**Izquierda — Horarios semanales:** cada día de la semana con un switch (verde = abierto, gris = cerrado) y el rango horario. Hoy quedó configurado como:
- Lun a Vie: abierto (Mié sólo mañanas, Vie hasta las 15:00)
- Sáb y Dom: cerrado

**Derecha — Días bloqueados:** lista de días puntuales que no atendés (ej. "Lun 22 — Vie 26 jul · Vacaciones", "Lun 15 sep · Feriado"). Botón "+ Bloquear fechas" para agregar nuevos.

**Buffer entre citas:** opciones 10/15/30 min — para que entre una cita y otra haya tiempo para notas, ir al baño, respirar. Por defecto: 15 min.

### 3.5. Citas (todas)

Lista completa de **todas** tus citas — pasadas, presentes y futuras. Arriba:

- **Filtros como pills:** Todas / Hoy / Esta semana / Pendientes / Completadas / Canceladas. Tocar uno filtra la tabla y la URL guarda el filtro (útil para enlaces directos).
- **Buscador:** podés escribir un nombre y filtra al vuelo.

La tabla muestra: fecha · hora, foto + nombre del paciente, servicio, estado (Confirmada/Pendiente/Completada/Cancelada/No asistió). Tocar una fila te lleva al detalle de ese cliente.

> **Estados de cita disponibles:** Pendiente (acaba de reservar), Confirmada (la aceptaste), Completada (ya sucedió), Cancelada (alguien canceló), No asistió.

### 3.6. Clientes (lista)

Tu base de pacientes como un **grid de tarjetas**. Cada tarjeta muestra:

- Avatar (placeholder)
- Nombre completo, edad, ciudad
- Cantidad de sesiones acumuladas
- Estado (Activo / Nuevo)
- Correo, teléfono, próxima cita

Arriba: filtros (Todos / Activos / Nuevos) + buscador por nombre o correo.

Tocar una tarjeta abre el detalle del cliente.

### 3.7. Detalle de cliente

Página completa con:

**Columna izquierda — Tarjeta del cliente:**
- Foto grande
- Nombre, edad, ciudad
- Correo, teléfono, ubicación
- Botón "Enviar mensaje"

**Columna derecha:**
- Tres KPIs arriba: Sesiones totales, Asistencia (%), Última visita
- **Tabs:** Historial · Notas · Tareas · Documentos · Pagos

El tab "Historial" lista todas las sesiones de esa persona con vos, en orden cronológico inverso. Los otros tabs están pensados para cuando integremos el backend:

- **Notas:** notas clínicas privadas (encriptadas en reposo cuando estén las queries reales).
- **Tareas:** ejercicios o registros que le asignás a la persona entre sesiones.
- **Documentos:** archivos que compartís con esa persona — aparecen también en su portal.
- **Pagos:** historial de pagos por sesión (SINPE / transferencia / tarjeta).

### 3.8. Servicios (CRUD)

Lista de todos los servicios que ofrecés, como tarjetas. Cada una con un **switch para activar/desactivar** (los inactivos se ven con opacidad reducida y no aparecen en el sitio público). Botones "Editar" y "Duplicar" en cada tarjeta.

### 3.9. Editar un servicio

Formulario con: Nombre, Descripción corta, Duración (min), Precio (₡), Modalidad (Online / Presencial / Híbrido), Buffer antes/después (0 / 15 / 30 min). A la derecha hay una **"Vista previa pública"** que te muestra cómo se verá ese servicio en el sitio mientras lo editás.

---

## 4. Portal del paciente (Fase 2)

> **Acceso de demo:** <https://jicorrales.github.io/DrRosibelCascanteBermudez/portal/login>
>
> Mismo truco que el admin: cualquier credencial entra. En la versión real, cada paciente activo recibe una invitación por correo.

El **portal del paciente** es un espacio privado para cada persona que está en proceso con vos. Es opcional — podés tener una práctica sin él, pero es lo que mucha gente espera hoy. Lo que tu paciente ve:

### 4.1. Inicio

- Saludo personalizado ("Hola, María — Buenas tardes")
- **Próxima cita destacada** en un card verde salvia, con día/hora, servicio, modalidad y botones "Unirme online" + "Reagendar"
- Lista de **tus tareas activas** con checkboxes
- Atajos a documentos compartidos

### 4.2. Mis citas

Lista de citas con dos pestañas: **Próximas** y **Pasadas**. Cada cita muestra fecha, servicio, modalidad y estado. Para las próximas hay botones "Reagendar" y "Cancelar" (con la regla de las 24h previas).

### 4.3. Mis tareas

Lista de las tareas que vos le asignaste, con tres pestañas: Activas / Esta semana / Completadas. Cada tarea tiene su descripción, fecha de asignación y, si aplica, una barra de progreso (ej. "Registro emocional diario · 1/7 días").

### 4.4. Documentos

Los archivos que vos compartiste con esa persona desde tu admin: consentimientos firmados, guías intro, planes de trabajo, audios de respiración, plantillas de diario. Los archivos aparecen como **tarjetas con vista previa** (icono según el tipo) y arriba hay un **filtro por tipo** (PDF / Audio / Video / Imagen / Enlace) con conteo de cuántos archivos hay de cada tipo.

### 4.5. Cómo funciona en la práctica

Imaginá este flujo cuando esté todo conectado:

1. Tu paciente termina su segunda sesión un jueves.
2. Vos entrás al admin → Clientes → su perfil → tab "Tareas" → agregás "Registro emocional diario, 7 días".
3. Ella abre el portal en su celular el sábado, ve la tarea pendiente, la marca como hecha cada noche.
4. El miércoles le compartís un PDF de respiración desde el admin.
5. Ella lo ve en su sección de "Documentos" y lo abre.

Todo eso sin chats, sin WhatsApps perdidos, sin documentos repetidos.

---

## 5. En qué estado está cada parte

| Parte | Funciona hoy | Falta para producción |
|---|---|---|
| Sitio público (landing, sobre, servicios, FAQ, etc.) | Sí, navegable | Reemplazar copy + fotos + datos reales |
| Flujo de reserva `/reservar` | Sí, los 4 pasos completos | Conectar a base de datos + enviar correos |
| Panel admin (todas las 9 pantallas) | Navegable como demo | Auth real + conexión a base de datos |
| Portal del paciente | Navegable como demo | Auth real + base de datos + magic links por correo |
| Diseño visual y paleta | Listo y aprobado | — |
| Responsive (computadora + celular) | Listo en sitio público, admin y portal | — |
| Tests automáticos | 24 unit + 27 end-to-end pasando | — |

---

## 6. Lo que necesito de vos antes de salir al aire

Para reemplazar los placeholders y dejar el sitio listo para que los pacientes lo usen, necesito:

### Datos profesionales

- [ ] **Año exacto** de tu licenciatura (hoy dice 2015 como ejemplo)
- [ ] Tu **código CPCR** real (hoy aparece "0000")
- [ ] **Especializaciones** y maestrías reales con sus años
- [ ] **Idiomas** en los que atendés (hoy: español e inglés — confirmar)

### Datos de contacto

- [ ] **Correo profesional** real (hoy: `hola@rosibelpsicologa.cr`)
- [ ] **Teléfono / WhatsApp** real (hoy: `+506 0000 0000`)
- [ ] **Dirección del consultorio** real (hoy: "San Pedro, San José")

### Catálogo de servicios

- [ ] **Nombres reales** de tus servicios (hoy: "Terapia individual / pareja / adolescentes / Primer encuentro")
- [ ] **Precios reales** (hoy: ₡25.000 / ₡40.000 / ₡25.000 / Gratis)
- [ ] **Duraciones** reales
- [ ] **Descripción** de cada uno (puedo ayudarte a redactarlas si me das los puntos clave)
- [ ] Modalidad (online / presencial / ambas) por servicio

### Fotos

- [x] Foto editorial (la que mandaste, ya está en el hero y en /sobre)
- [ ] **Foto del consultorio** (hoy es un placeholder a rayas en la sección "Sobre mí" del home)
- [ ] **Foto opcional** del ambiente para el detalle de servicios

### Contenido escrito

- [ ] **Aviso de privacidad** (lo podemos redactar juntos siguiendo la Ley 8968 de CR)
- [ ] **Términos del consentimiento informado** que el paciente acepta antes de reservar
- [ ] **Bio** definitiva tuya (hoy hay una propuesta basada en datos genéricos)
- [ ] **Testimonios reales**, si tenés permiso de uso de tus pacientes (hoy hay cuatro de ejemplo)

### Decisiones técnicas

- [ ] **¿Backend ahora o más adelante?** Si decidimos avanzar, te recomiendo **Supabase** (mismo costo bajo, encaja perfecto con lo que tenemos).
- [ ] **¿Querés cobrar online?** SINPE Móvil al confirmar, o solo cobrar en sesión.
- [ ] **¿Dominio propio?** Hoy estás en `jicorrales.github.io/DrRosibelCascanteBermudez/`. Para verse profesional conviene un dominio tipo `rosibelpsicologa.cr` (~₡10.000/año).
- [ ] **¿Querés el portal del paciente desde el inicio o en una segunda fase?** Es opcional.

---

## 7. Preguntas para mí

Cuando termines de recorrer todo, mandame por WhatsApp o correo:

1. ¿Qué te gustó y qué no?
2. ¿Algo te sentís incómoda mostrándole a un paciente como está?
3. ¿Hay algo que falta?
4. ¿Hay algo de más?
5. ¿Cuándo querés que esto esté **realmente** publicado con tus datos?

Sin presiones — la idea es que decidas con calma. Tomate el tiempo que necesités.

---

*Última actualización: 10 de mayo de 2026.*
