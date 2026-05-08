const authService = require("../services/auth.service")

const register = async(req , res) =>{
    try{
        const {nombre,email,password} = req.body
        const usuario = await authService.register({nombre,email, password})
        res.status(201).json(usuario)
    }catch(err){
        res.status(400).json({error:err.message})
    }
}
const login = async(req , res) =>{
    try{
        const {email,password} = req.body
        const token = await authService.login({email, password})
        res.status(200).json({token})
    }catch(err){
        res.status(400).json({error:err.message})
    }
}
module.exports={register,login}