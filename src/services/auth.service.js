const prisma = require("../prisma/client")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async({nombre, email , password})=>{
    const usuarioExistente = await prisma.user.findUnique({where : {email} })
    if(usuarioExistente){
        throw new Error ("Email ya registrado")
    }
    const hash = await bcrypt.hash(password,10)
    const usuario = await prisma.user.create({data :{nombre,email, password:hash}})
    return usuario
    
}

const login = async({email , password}) =>{
    const buscarUsario = await prisma.user.findUnique({where:{email}})
    if(!buscarUsario){
        throw new Error("Usuario ingresado no existe")
    }
    const comparacion = await bcrypt.compare(password,buscarUsario.password)
    if(!comparacion){
        throw new Error("Contraseña no existe")
    }
    const token = jwt.sign(
        {userId: buscarUsario.id},
        process.env.JWT_SECRET,
        {expiresIn:"7d"}
    )
    return token
}
module.exports = {register,login}