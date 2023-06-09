const sequelize = require('sequelize')
const connection = require('../database/database')

const Game = connection.define('games', {
    title:{
        type:sequelize.STRING,
        allowNull: false
    },
    year:{
        type: sequelize.INTEGER,
        allowNull: false
    },
    price:{
        type: sequelize.INTEGER,
        allowNull: false
    }
})

module.exports = Game;