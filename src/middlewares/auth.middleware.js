const jwt = require("jsonwebtoken")

const authMiddleware = (req, res, next) => {
  try {
    // 1. Obtener el header de autorización
    const authHeader = req.headers.authorization

    // 2. Verificar que existe y tiene formato "Bearer <token>"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token no proporcionado" })
    }

    // 3. Extraer el token — split por espacio, tomar el segundo elemento
    const token = authHeader.split(" ")[1]

    // 4. Verificar y decodificar el token
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    // 5. Adjuntar el userId al request para usarlo en controllers
    req.userId = payload.userId

    // 6. Continuar al siguiente middleware o controller
    next()

  } catch (err) {
    // jwt.verify lanza error si el token es inválido o expiró
    return res.status(401).json({ error: "Token inválido o expirado" })
  }
}

module.exports = authMiddleware