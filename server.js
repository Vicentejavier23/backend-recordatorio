require("dotenv").config()
const app = require("./src/app")
const { iniciarScheduler } = require("./src/services/scheduler.service")
const PORT = process.env.PORT || 3000


app.listen(PORT,()=>{
    console.log(`Servidor corriendo en puerto ${PORT}`)
    console.log("HORA:", process.env.HORA_RECORDATORIO)
    console.log("MINUTO:", process.env.MINUTO_RECORDATORIO)
    iniciarScheduler()
})
