const prisma = require("../prisma/client")

const saveTurnos = async (userId, turnos) => {
  if (!turnos || !Array.isArray(turnos) || turnos.length === 0) {
    throw new Error("No se proporcionaron turnos válidos")
  }

  await prisma.turno.deleteMany({ where: { userId } })

  const turnosCreados = await prisma.turno.createMany({
    data: turnos.map((t) => {
      let fecha
      if (t.fecha.match(/^\d{2}-\d{2}-\d{2}$/)) {
        const [dia, mes, anio] = t.fecha.split("-")
        fecha = new Date(`20${anio}-${mes}-${dia}`)
      } else {
        fecha = new Date(t.fecha)
      }
      return { fecha, inicio: t.inicio, fin: t.fin, tipo: t.tipo, userId }
    }),
  })

  return turnosCreados
}

// ✅ Fuera de saveTurnos
const saveTurnoManual = async (userId, { fecha, inicio, fin, tipo }) => {
  const turno = await prisma.turno.create({
    data: {
      fecha: new Date(fecha),
      inicio,
      fin,
      tipo,
      userId,
    }
  })
  return turno
}

const getTurnosByUser = async (userId) => {
  const turnos = await prisma.turno.findMany({
    where: { userId },
    orderBy: { fecha: "asc" },
  })
  return turnos
}

const deleteTurno = async (userId, turnoId) => {
  const turno = await prisma.turno.findUnique({ where: { id: turnoId } })
  if (!turno) throw new Error("Turno no encontrado")
  if (turno.userId !== userId) throw new Error("No autorizado")
  await prisma.turno.delete({ where: { id: turnoId } })
}

module.exports = { saveTurnos, getTurnosByUser, deleteTurno, saveTurnoManual }