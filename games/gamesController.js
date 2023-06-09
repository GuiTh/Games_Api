const express = require("express");
const router = express.Router();
const auth = require('../middleware/Auth')
const Games = require("./games");
const JWT = require('jsonwebtoken')
const JWTSECRET = 'ooiasdasoidaoidaoi'



router.get('/games', auth, (req,res)=>{
    var HATEOAS = [
        {
            href:'http://localhost:4000/game/0',
            method:'DELETE',
            rel:'delete_game'
        },
        {
            href:'http://localhost:4000/game/0',
            method:'GET',
            rel:'get_game'
        },
        {
            href:'http://localhost:4000/login',
            method:'POST',
            rel:'login'
        }
    ]
    Games.findAll({}).then( jogos =>{
        res.status(200).json({jogos, HATEOAS})
    })
})

router.post("/game",auth, (req,res)=>{
    var {title, year, price} = req.body
    Games.create({
        title,
        year,
        price
    }).then((jogos) =>{
        res.status(200).redirect("/games")
    }).catch(err =>{console.log(err)}) 

})

router.get('/game/:id',auth, (req,res) =>{
    var id = req.params.id
    if(isNaN(id)){
        res.sendStatus(400)
    }else{
        id = parseInt(req.params.id)
        var HATEOAS = [
            {
                href:'http://localhost:4000/game/'+id,
                method:'DELETE',
                rel:'delete_game'
            },
            {
                href:'http://localhost:4000/game/'+id,
                method:'GET',
                rel:'get_game'
            },
            {
                href:'http://localhost:4000/login',
                method:'POST',
                rel:'login'
            }
        ]

         Games.findOne({
            where:{
                id: id
            }
        }).then((result)=>{
            res.json({result, HATEOAS})
        })


    }
})


router.delete('/game/:id',auth, (req,res) =>{
    var id = req.params.id
    if(isNaN(id)){
        res.sendStatus(400)
    }else{
        id = parseInt(req.params.id)
        if(id == -1){
            res.sendStatus(400)
        }else{
            Games.destroy({
                where:{
                    id: id
                }
            }).then(()=>{
                res.send('deletado')
            })
        }
}
})

router.put('/game/:id',auth, (req,res) =>{

    if(isNaN(req.params.id)){
        res.sendStatus(400)
    }else{
        var id = parseInt(req.params.id)
        var HATEOAS = [
            {
                href:'http://localhost:4000/game/'+id,
                method:'DELETE',
                rel:'delete_game'
            },
            {
                href:'http://localhost:4000/game/'+id,
                method:'GET',
                rel:'get_game'
            },
            {
                href:'http://localhost:4000/login',
                method:'POST',
                rel:'login'
            }
        ]
        var game = Games.findOne({
            where:{
                id:id
            }
        }).then(jogo => console.log(jogo))

        if(game != undefined){
            var {title, price, year, updatedAt, createdAt} = req.body

            Games.update({
               title: title,
               year: year,
               price: price
            }, {where:{ id: id}}).then((result ) => res.json({game: 'ok', HATEOAS}))

            if(title != undefined){
                game.title = title
            }
            
            if(price != undefined){
                game.price = price
            }

            if(year != undefined){
                game.year = year
            }

            if(updatedAt != undefined){
                game.updatedAt = updatedAt
            }

            if(createdAt != undefined){
                game.createdAt = createdAt
            }
        }else{
            res.sendStatus(400)
        }
    }
})

module.exports = router