const express = require("express");
const router = express.Router();
const JWT = require('jsonwebtoken')
const JWTSECRET = 'ooiasdasoidaoidaoi'

function auth(req,res,next){
    const authToken = req.headers['authorization']
    if(authToken != undefined){
        const bearer = authToken.split(' ')
        const token = bearer[1]
        JWT.verify(token, JWTSECRET,(err, data)=>{
            if(err){
                res.status(401)
                res.json({err:"token invalido"})
            }else{
                req.token = token
                req.loggedUser = {id: data.id, email: data.email}
                next()
            }
        })

    }else{
        res.status(401)
        res.json({err: 'token invalido'})
    }
}
module.exports = auth