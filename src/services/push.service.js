// src/services/push.service.js
const webpush = require("web-push")
const prisma = require("../prisma/client")

// Configurar VAPID una sola vez al importar el servicio
webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

// Guarda o actualiza la suscripción del dispositivo
const guardarSuscripcion = async (userId, endpoint, keys) => {
  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    throw new Error("Suscripción inválida")
  }

  // Upsert — si ya existe la actualiza, si no la crea
  const suscripcion = await prisma.suscripcion.upsert({
    where: { userId },
    update: { endpoint, p256dh: keys.p256dh, auth: keys.auth },
    create: { endpoint, p256dh: keys.p256dh, auth: keys.auth, userId },
  })

  return suscripcion
}

// Elimina la suscripción del usuario
const eliminarSuscripcion = async (userId) => {
  await prisma.suscripcion.deleteMany({ where: { userId } })
}

// Envía una notificación push a un usuario específico
const enviarNotificacion = async (userId, payload) => {
  const suscripcion = await prisma.suscripcion.findUnique({
    where: { userId },
  })

  if (!suscripcion) return // El usuario no tiene suscripción activa

  const pushSuscripcion = {
    endpoint: suscripcion.endpoint,
    keys: {
      p256dh: suscripcion.p256dh,
      auth: suscripcion.auth,
    },
  }

  await webpush.sendNotification(
    pushSuscripcion,
    JSON.stringify(payload)
  )
}

module.exports = { guardarSuscripcion, eliminarSuscripcion, enviarNotificacion }