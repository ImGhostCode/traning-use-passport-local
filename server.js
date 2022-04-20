const express = require('express')
const session = require('express-session')
const passport = require('passport')
const localStrategy = require('passport-local').Strategy
require('dotenv').config()
const app = express()

const PORT = process.env.PORT || 5500
const store = session.MemoryStore()

//middleware
app.use(express.json())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000*10
    }, 
    store
}))

//fake account
const account = {
    username: 'ghost983',
    password: '12345678'
}

//passport
passport.use(new localStrategy((username, password, done)=> {
    if (username === account.username && password === account.password){
        return done(null, {
            username,
            active: true
        })
    }
    return done(null, false)
}))
app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser((account, done) => done(null, account.username))
passport.deserializeUser((username, done)=>{
    if (username === account.username){
        return done(null, {
            username,
            active: true
        })
    }
    return done(null, false)
})

//router
app.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login'
}),(req, res)=> {
    res.json({
        msg: 'Login success'
    })
})


app.get('/profile', (req, res)=> {
    if (req.isAuthenticated())
        return res.status(200).json({
            name: 'im ghost',
            age: 20
        })

    else 
        res.status(401).json({
            status: 'failed',
            msg: 'Missing login'
        })
    
})



app.listen(PORT,()=> {
    console.log('Server started on port: ', PORT )
} )