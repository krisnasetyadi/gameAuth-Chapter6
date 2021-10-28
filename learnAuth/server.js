const express = require('express')
const app = express()
const PORT = process.env.PORT || 4000
const { pool } = require('./db')
const bcrypt = require('bcrypt') //make random variable
const session = require('express-session')
const flash = require('express-flash')
const passport = require('passport')
const initializePassport = require('./pass')
const cors = require('cors')

initializePassport(passport)

app.use(cors())
app.use(express.urlencoded({extended:false}))
app.set('view engine','ejs')
app.use(express.static('publics'))


app.use(session({
    secret: 'secret',

    resave:false,

    saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.get('/' , (req , res)=>{
   res.render("index")
})

app.get('/users/register' , (req , res)=>{
   res.render("register")
   
})

// take a data from register
app.post('/users/register',async(req,res)=>{
     let { name, email, password, password2 } = req.body

    console.log({
        name,
        email,
        password,
        password2
    })
    // make validation
    let errors = []
    if(!name || !email || !password || !password2){
        errors.push({ message:'Please enter all fields!'})
    }
    if (password.length < 6){
        errors.push({message:'Your password too short!'})
    }
    if(password != password2){
        errors.push({message: 'Password did not match!'})
    }
    if (errors.length>0){
        res.render('register',{ errors })
    } else {
        // form validation has passed

        // hash it for a unique variable
        let hashedPassword = await bcrypt.hash(password,10)
        console.log(hashedPassword)
    
    pool.query(
        `SELECT * FROM users
        WHERE email = $1`,[email],(err,results)=>{
            if (err){
                throw err
            }
            console.log(results.rows)

            if(results.rows.length > 0){
                errors.push({message:'Email already registered!'})
                res.render('register',{errors})
            }else{
                pool.query(
                    `INSERT INTO users (name,email,password)
                    VALUES($1,$2,$3)
                    RETURNING id,password`,[name,email,hashedPassword],
                        (err,results)=>{
                            if (err){
                                throw err
                            }
                            console.log(results.rows)
                            req.flash('success_msg','You are now registered. Please log in')
                            res.redirect('/users/login')
                        }

                )
            }
        }
    )
}
})

app.post('/users/dashboard',passport.authenticate('local',({
    successRedirect:'/users/dashboard',
    failureRedirect:'/users/login',
    failureFlash: true
})))

app.get('/users/login' , (req , res)=>{
    res.render("login")
 })
app.post('/users/login' , (req , res)=>{

    res.redirect('/users/dashboard')

})

app.get('/users/dashboard' , (req , res)=>{
    res.render("dashboard",{user:''})
 })



// PAYMENT

const initializepay = require('./pymnt_pass')
initializepay(passport)


 app.get('/users/payment' , (req , res)=>{
    res.render("index_payment")
 })
 
 
 // take a data from payment
 app.post('/users/payment',async(req,res)=>{
      let { firstname, lastname, cardnumber, cvvnumber } = req.body
 
     console.log({
         firstname,
         lastname,
         cardnumber,
         cvvnumber
     })
     // make validation
     let errors = []
     if(!firstname || !lastname || !cardnumber || !cvvnumber){
         errors.push({ message:'Please enter all fields!'})
     }
     if (cardnumber.length < 16){
         errors.push({message:'Your number is invalid!'})
     }
     if (errors.length>0){
         res.render('index_payment',{ errors })
     } else {
   let hashedNumber = await bcrypt.hash(cardnumber,20)
    console.log(hashedNumber) 
    if (errors.length>0){
    res.render('index_payment',{ errors })
    } else {      
    let hashedcvv = await bcrypt.hash(cvvnumber,20)
     console.log(hashedcvv)
    }
pool.query(
         `SELECT * FROM payments
         WHERE cardnumber = $1`,[cardnumber],(err,results)=>{
             if (err){
                 throw err
             }
             console.log(results.rows)
 
             if(results.rows.length > 0){
                 errors.push({message:' card already registered!'})
                 res.render('index_payment',{errors})
             }else{
                 pool.query(
                     `INSERT INTO payments (firstname,lastname,cardnumber,cvvnumber)
                     VALUES($1,$2,$3,$4)`,[firstname,lastname,hashedNumber,cvvnumber],
                         (err,results)=>{
                             if (err){
                                 throw err
                             }
                             console.log(results.rows)
                             req.flash('success_msg','Your card now registered!')
                             res.redirect('/users/dashboard')
                         }
                 )
             }
         }
     )
 }
 
 })
//  hashed CVV fail
 

 app.get('/users/payment/:id' , async (req , res)=>{
    try {
        const {id} = req.params
        const Mycard= await pool.query(
            `SELECT * FROM payments WHERE id = $1`,
            [id]
        )
        res.json(Mycard.rows[0])
    }catch(err){
        console.error(err.message)
    }
 })
 // UPDATE payment
 app.put('/users/payment/:id' , async (req , res)=>{
     try {
         const {id} = req.params
         const updateCard = await pool.query(
             `UPDATE payments SET cardnumber = $1 WHERE id = $2`,
             [cardnumber,id])
             res.json(results.rows[0])
             res.json('Payment was Updated!')
         } catch (err){
             console.error(err.message)
         }
 
 })
 // DELETE payment
 app.delete('/users/payment/:id' , async (req , res)=>{
    try {
        const {id} = req.params
        const deleteCard = await pool.query(`DELETE FROM payments
        WHERE cardnumber = $1`,[cardnumber])
        res.json('Card Number was deleted')
    } catch (err) {
        console.log(err.message)
    }
 })

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
