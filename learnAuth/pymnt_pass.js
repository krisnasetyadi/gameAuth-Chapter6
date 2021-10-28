const LocalStrategy = require('passport-local').Strategy
const { pool } = require('./db')
const bcrypt = require('bcrypt')

function initialize (passport){
const cardUser = (cardnumber,done)=>{
    pool.query(
        `SELECT * FROM payments WHERE cardnumber = $1`,[cardnumber],
        (err,results)=>{
            if (err){
                throw err
            }
            console.log(results.rows)
            return done(null,false,{message:"Number registered success"})
        })}
        
    passport.use(
        new LocalStrategy({
            cardField:"cardnumber",
            cvvField:"cvv"
        },
        cardUser
        )
    )
    passport.serializeUser((userpay,done)=>done(null,userpay.id))

    passport.deserializeUser((id,done)=>{
        pool.query(
            `SELECT * FROM payments WHERE id = $1`,[id],
            (err,results)=>{
                if(err){
                    throw err
                }
            }
        )
    })
}
module.exports = initialize