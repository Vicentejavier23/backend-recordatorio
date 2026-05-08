// src/controllers/push.controller.js
const pushService = require("../services/push.service")

const suscribir = async (req, res) => {
  try {
    const { endpoint, keys } = req.body
    const resultado = await pushService.guardarSuscripcion(
      req.userId,
      endpoint,
      keys
    )
    res.status(201).json(resultado)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

const desuscribir = async (req, res) => {
  try {
    await pushService.eliminarSuscripcion(req.userId)
    res.status(200).json({ message: "Suscripción eliminada" })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

module.exports = { suscribir, desuscribir }