const express = require("express");
const router = express.Router();
const User = require("./users");
const auth = require('../middleware/Auth')
const JWTSECRET = 'ooiasdasoidaoidaoi'
const JWT = require('jsonwebtoken')



router.get('/users', auth, (req,res)=>{
    User.findAll({}).then((users) => res.send(users))
})

router.post('/user', (req,res)=>{
    var {name, email, password} = req.body
    User.create({
        name,
        email,
        password
    }).then((user) =>{
        res.status(200)
        res.json({user: user})
    }).catch((err) =>{console.log(err)})
})

router.delete('/user/:id', auth, (req,res)=>{
    var id = req.params.id
    if(isNaN(id)){
        res.sendStatus(400)
    }else{
        id = parseInt(req.params.id)
        if(id == -1){
            res.sendStatus(400)
        }else{
            User.destroy({
                where:{
                    id: id
                }
            }).then(()=>{
                res.send('deletado')
            })
        }
}
})

router.get('/user/:id', auth, (req,res)=>{
    var id = req.params.id
    if(isNaN(id)){
        res.sendStatus(200)
    }else{
        id = parseInt(req.params.id)

        User.findOne({ 
            where:{
                id: id
            }
        }).then((result) =>{
            res.send(result)
        })
    }
})

router.post('/auth', (req,res)=>{
    var {email, password} = req.body
    User.findOne({
        where:{
            email: email
        }
    }).then((user)=>{
        var passwordHashed = user.dataValues.password
        if(passwordHashed == password){
            JWT.sign({id:user.dataValues.id, email:email}, JWTSECRET,{expiresIn: '2d'}, (err,token)=>{
                if(err){
                    res.status(400)
                    res.json({err: "falha interna"})
                }else{
                    res.status(200)
                    res.json({token:token})
                }
            })
        }else{
            res.status(401)
            res.json({err: "Credenciais invalidas"})
        }
    }).catch((err) =>res.status(400).json('usuario nao encontrado'))
})





module.exports = router