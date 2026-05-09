# Recordatorio de turno — Backend

API REST para el sistema de recordatorio de turnos de trabajo. Maneja autenticación, gestión de turnos, notificaciones push y envío automático de recordatorios diarios.

## Stack

- Node.js + Express
- Prisma ORM
- PostgreSQL (Supabase)
- JWT + bcryptjs
- Web Push (VAPID)
- node-cron
- Groq AI (llama-3.3-70b) — parsing de horarios
- Tesseract.js + Sharp — OCR de imágenes
- Multer — manejo de archivos

## Requisitos

- Node.js 18+
- npm
- PostgreSQL (o cuenta en Supabase)

## Instalación

```bash
git clone https://github.com/tu-usuario/shift-reminder-server
cd shift-reminder-server
npm install
npx prisma generate
npx prisma migrate dev
```

## Variables de entorno

Crea un archivo `.env` en la raíz:

```
DATABASE_URL=postgresql://usuario:password@host:5432/database
JWT_SECRET=string_largo_y_seguro
VAPID_PUBLIC_KEY=tu_clave_publica_vapid
VAPID_PRIVATE_KEY=tu_clave_privada_vapid
VAPID_EMAIL=mailto:tucorreo@gmail.com
GROQ_API_KEY=tu_clave_groq
HORA_RECORDATORIO=19
MINUTO_RECORDATORIO=0
```

### Generar claves VAPID

```bash
npx web-push generate-vapid-keys
```

## Desarrollo

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## Producción

```bash
npm start
```

## Estructura

```
src/
├── controllers/        # Lógica de cada endpoint
│   ├── auth.controller.js
│   ├── turnos.controller.js
│   └── push.controller.js
├── middlewares/        # Middlewares de Express
│   ├── auth.middleware.js
│   └── upload.middleware.js
├── routes/             # Definición de endpoints
│   ├── auth.routes.js
│   ├── turnos.routes.js
│   └── push.routes.js
├── services/           # Lógica de negocio
│   ├── auth.service.js
│   ├── turnos.service.js
│   ├── push.service.js
│   ├── parser.service.js
│   └── scheduler.service.js
├── prisma/
│   └── client.js       # Cliente Prisma singleton
└── app.js              # Configuración Express
prisma/
├── schema.prisma       # Modelos de BD
└── migrations/
server.js               # Entry point
```

## Endpoints

### Auth
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Registro de usuario | No |
| POST | `/api/auth/login` | Inicio de sesión | No |
| GET | `/api/auth/me` | Datos del usuario actual | Sí |

### Turnos
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/api/turnos` | Obtener turnos del usuario | Sí |
| POST | `/api/turnos/upload` | Subir horario PDF/imagen | Sí |
| POST | `/api/turnos/manual` | Agregar turno manual | Sí |
| DELETE | `/api/turnos/:id` | Eliminar turno | Sí |

### Push
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/api/push/suscribir` | Guardar suscripción push | Sí |
| DELETE | `/api/push/suscribir` | Eliminar suscripción | Sí |

### Health
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/health` | Estado del servidor |

## Scheduler

El cron job se ejecuta todos los días a la hora configurada en `HORA_RECORDATORIO` y `MINUTO_RECORDATORIO`. Busca los turnos del día siguiente y envía notificaciones push a los usuarios correspondientes.

Timezone: `America/Santiago`

## Base de datos

### Modelos

**User** — usuarios de la app
**Turno** — turnos de trabajo por usuario
**Suscripcion** — suscripción push por dispositivo

## Deploy

El backend está desplegado en Render (plan gratuito). Se mantiene activo con UptimeRobot haciendo ping cada 5 minutos a `/health`.

Variables de entorno requeridas en Render — ver sección Variables de entorno.

### Build command
```
npm install && npx prisma generate
```

### Start command
```
node server.js
```
