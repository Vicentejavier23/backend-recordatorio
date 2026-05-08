// src/routes/push.routes.js
const router = require("express").Router()
const pushController = require("../controllers/push.controller")
const authMiddleware = require("../middlewares/auth.middleware")

router.use(authMiddleware)

router.post("/suscribir", pushController.suscribir)
router.delete("/suscribir", pushController.desuscribir)

module.exports = router