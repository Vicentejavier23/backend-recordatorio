const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const dotenv = require("dotenv")

dotenv.config()

const app = express()  // ← PRIMERO app

// DESPUÉS los middlewares
app.use(cors())
app.use(express.json())
app.use(helmet())

// DESPUÉS las rutas
const authRoutes = require("./routes/auth.routes")
const turnosRoutes = require("./routes/turnos.routes")
const pushRoutes = require("./routes/push.routes")

app.use("/api/auth", authRoutes)
app.use("/api/turnos", turnosRoutes)
app.use("/api/push", pushRoutes)

app.get("/health", (req, res) => {
  res.json({ status: "ok" })
})

module.exports = app