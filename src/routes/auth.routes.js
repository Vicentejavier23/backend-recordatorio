const router = require("express").Router()
const {register , login} =  require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const prisma = require("../prisma/client")
router.post('/register',register)
router.post('/login',login)
router.get('/me',authMiddleware, async(req,res)=>{
    try{
        const usuario = await prisma.user.findUnique({
            where:{id:req.userId},
            select:{id:true,nombre:true,email:true}
        })
        res.status(200).json(usuario)
    }catch(err){
        res.status(400).json({error: err.message})
    }
})
module.exports = router