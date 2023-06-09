const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const PORT = 4000
const connection = require('./database/database')
const cors = require('cors')


const GamesController = require('./games/gamesController')
const UsersController = require('./users/usersController')

var Games = require('./games/games')
var User = require('./users/users')



app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

connection.authenticate().then(()=>{
    console.log('conexao feita com sucesso')
}).catch((error)=>{
    console.log(error)
})

app.use('/', GamesController)
app.use('/', UsersController)


app.listen(PORT, ()=>{
    console.log(`Rodando na porta ${PORT}`)
})