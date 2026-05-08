// src/routes/turnos.routes.js
const router = require("express").Router()
const turnosController = require("../controllers/turnos.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const upload = require("../middlewares/upload.middleware")


router.use(authMiddleware)

// upload.single("horario") → espera un archivo con el campo "horario"
router.post("/upload", upload.single("horario"), turnosController.uploadTurnos)
router.post("/manual", turnosController.agregarTurnoManual)
router.get("/", turnosController.getTurnos)
router.delete("/:id", turnosController.deleteTurno)

module.exports = router