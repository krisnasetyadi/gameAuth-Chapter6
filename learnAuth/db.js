require("dotenv").config()

const { Pool } = require("pg")

const production =process.env.NODE_ENV === "production"

const conectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`

// const pool = new Pool ({
//     conectionString: production ? process.env.DATABASE_URL : conectionString
const pol= require('pg').Pool

const pool = new pol({
    user:"postgres",
    password:"qwerty",
    host:"localhost",
    port:5432,
    database:"data_base"
})
module.exports = pool
// })

module.exports={ pool }