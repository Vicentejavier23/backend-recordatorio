// src/controllers/turnos.controller.js
const turnosService = require("../services/turnos.service")
const { extraerTexto, parsearConIA } = require("../services/parser.service")

const uploadTurnos = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No se proporcionó ningún archivo" })
      }
      const texto = await extraerTexto(req.file)
      console.log("TEXTO EXTRAÍDO:", texto) // ← agrega esto
      const turnos = await parsearConIA(texto, req.file)
      console.log("TURNOS PARSEADOS:", turnos) // ← y esto
      const resultado = await turnosService.saveTurnos(req.userId, turnos)
      res.status(201).json({
        message: `${turnos.length} turnos guardados correctamente`,
        turnos,
      })
    } catch (err) {
      console.error("ERROR UPLOAD:", err) // ← y esto
      res.status(400).json({ error: err.message })
    }
  }
  const agregarTurnoManual = async (req, res) => {
    try {
      const { fecha, inicio, fin, tipo } = req.body
      const turno = await turnosService.saveTurnoManual(req.userId, { fecha, inicio, fin, tipo })
      res.status(201).json(turno)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  }
const getTurnos = async (req, res) => {
  try {
    const turnos = await turnosService.getTurnosByUser(req.userId)
    res.status(200).json(turnos)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

const deleteTurno = async (req, res) => {
  try {
    await turnosService.deleteTurno(req.userId, parseInt(req.params.id))
    res.status(200).json({ message: "Turno eliminado" })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

module.exports = { uploadTurnos, getTurnos, deleteTurno, agregarTurnoManual }