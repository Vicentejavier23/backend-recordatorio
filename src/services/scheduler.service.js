// src/services/scheduler.service.js
const cron = require("node-cron")
const prisma = require("../prisma/client")
const { enviarNotificacion } = require("./push.service")


const iniciarScheduler = () => {
  const hora = process.env.HORA_RECORDATORIO || 19
  const minuto = process.env.MINUTO_RECORDATORIO || 10
  console.log(`⏰ Scheduler configurado para las ${hora}:${minuto}`)
  // Corre todos los días a las 19:00 (7 PM)
  // Formato cron: segundo minuto hora día mes díaSemana
  cron.schedule(`0 ${hora} ${minuto}* * *`, async () => {
    console.log("🔔 Ejecutando scheduler de recordatorios...")

    try {
      // Calcular la fecha de mañana
      const manana = new Date()
      manana.setDate(manana.getDate() + 1)
      manana.setHours(0, 0, 0, 0) // inicio del día

      const pasadoManana = new Date(manana)
      pasadoManana.setDate(pasadoManana.getDate() + 1) // fin del día

      // Buscar todos los turnos de mañana con su usuario
      const turnos = await prisma.turno.findMany({
        where: {
          fecha: {
            gte: manana,       // mayor o igual que inicio de mañana
            lt: pasadoManana,  // menor que inicio de pasado mañana
          },
        },
        include: {
          user: true, // incluye los datos del usuario
        },
      })

      console.log(`📋 Turnos encontrados para mañana: ${turnos.length}`)

      // Enviar notificación a cada usuario con turno mañana
      for (const turno of turnos) {
        await enviarNotificacion(turno.userId, {
          title: "🗓️ Recordatorio de turno",
          body: `Mañana entras a las ${turno.inicio} hasta las ${turno.fin} — Turno ${turno.tipo}`,
          url: "/",
        })
        console.log(`✅ Notificación enviada a: ${turno.user.nombre}`)
      }

    } catch (err) {
      console.error("❌ Error en scheduler:", err.message)
    }
  }, {
    timezone: "America/Santiago" // ajusta a tu zona horaria
  })

  console.log("⏰ Scheduler iniciado")
}

module.exports = { iniciarScheduler }