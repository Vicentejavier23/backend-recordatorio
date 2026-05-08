// src/middlewares/upload.middleware.js
const multer = require("multer")

// Guardar en memoria en lugar de disco — más seguro y limpio
const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  const tiposPermitidos = ["application/pdf", "image/jpeg", "image/png"]

  if (tiposPermitidos.includes(file.mimetype)) {
    cb(null, true) // aceptar
  } else {
    cb(new Error("Solo se permiten PDF, JPG o PNG"), false) // rechazar
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // máximo 5MB
  },
})

module.exports = upload