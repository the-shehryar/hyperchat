//? Initializing Variables 

require('dotenv').config()

let {
    DATABASE_URL, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY
} = process.env

const express = require("express")
const app = module.exports = express()
const mongoose = require('mongoose')
const expressSession = require("express-session")
const fs = require('fs')
const crypto = require('crypto') 
let {parse} = require('url')
// Connection in case of replication will be established this way

// const conn = mongoose.connect(DATABASE_URL, {useUnifiedTopology : true, useNewUrlParser: true, useFindAndModify : false , replicaSet : "lester"})

const conn = mongoose.connect(DATABASE_URL, {useUnifiedTopology : true, useNewUrlParser: true, useFindAndModify : false})
const database = mongoose.connection
const http = require('http')
const server = http.createServer()
const Port = 5000
const WebSocket = require('ws')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

//? Importing Middlewares

let { router_external_protection, router_internal_protection } = require('./controllers/jwtAuth')

//? Importing Models

const AccountsCollection = require('./models/account')
const {PrivateChat} = require('./models/chat.model')
let {SocketConnectionHandler} = require('./ws')

//* Database Monitoring

// PrivateChat.watch().on('change', (data) => {
//     if (data) {
//         console.log(data);
//     }
// })

//? Global Rules

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

//? Session IDS Generation

let cookiesecret = crypto.randomBytes(30).toString('hex')

//? Checks Errors On Database Connection
// console.log(database);
database.on("error", (error) => { console.log(error) })

database.once('open',()=>{console.log('db connected');})
//? Providing Static Directory

app.use('/' , express.static(__dirname + '/static'))

//? Creating A Web Socket Server

const SocketServer = new WebSocket.Server({noServer : true})



//* Request Event is not firing

SocketServer.on('request' , (req)=>{
    console.log('Connection Requested At WebSocket Server')
    // console.log(req)
})

//? Websocket Server Connection Handling 

SocketServer.on('connection', (socket, req) => {
    SocketConnectionHandler(socket, req, SocketServer)
})

//? Connection Upgradation

server.on('upgrade', async (request,socket,head)=>{

    SocketServer.handleUpgrade(request, socket, head, (ws) => {
        try {
            SocketServer.emit('connection', ws, request)
        } catch (error) {
            console.log(error)
        }
    })
})



app.put('/follow/:followId', (req,res) => {

    const getCurrentUserID = jwt.verify(Lookup(req.cookies, 'jwt'), ACCESS_TOKEN_KEY, (error, decoded) => {
        if (decoded) {
            return decoded.identifier
        }
        else {
            console.log(error)
            return null
        }
    })
    const targetUserID = req.params.followId

    let mutualSocketUrl = crypto.randomBytes(16).toString('hex')
    console.log(targetUserID)
    AccountsCollection.findByIdAndUpdate({identifier : {publicKey : targetUserID}} , {
        $push : {
            followers : getCurrentUserID,
            chatables : () => {
                try {
                    chatables.filter((id)=>{
                        if(id === getCurrentID){
                            return null
                        }
                        else {
                            console.lof('user is new')
                            return getCurrentID
                        }
                    })
                }catch(error){
                    console.log(error)
                }
            }
        }
    }, {
        new : true,
        
    }, (err,doc) => {
        if(err){
            console.log(err)
        }
        else {
            console.log(doc)
            AccountsCollection.findByIdAndUpdate(getCurrentUserID , {
                $push : {
                    following : targetUserID
                }
            }, {new : true})
            .then(result => {
                res.json(result)
            })
            .catch(err => {
                res.json(err)
            })
        }
    })
    
})


app.get('/getallusers', async (req, res) => {
    let userself = AccountsCollection.findOne({ _id: req.cookies.userid }, (error, doc) => {
        if (error) {
            console.log(error);
            return null;
        }
        else {
            return doc;
        }
    })
    if (userself !== null) {
        // console.log(userself);
        const allusers = mongoose.model('accounts')
        const foundUsers = await allusers.find({ _id: { $ne: req.cookies.userid } }, (err, doc) => {
            console.log(doc);
        
        }).select('userName followers following identifier.publicKey')
    
    res.header({
        'Content-Type' : "application/json"
    })
        console.log(foundUsers);
    res.json({users : foundUsers})
    }
    
})

app.get('/user/:followId' , (req,res) => {
    res.sendFile(process.cwd() + '/static/customProfile.html')
    // res.json({message : `${req.params.followId} recieved`})
})



// Router Assignments
const profileRoute = require('./routes/userProfile')
app.use('/profile' , profileRoute.router)

const actionsRoute = require('./routes/actions')
app.use('/actions' , actionsRoute)

const usersRoute = require('./routes/users')
app.use('/users' , usersRoute)

const signupRoute = require('./routes/signUp')
app.use('/signup', signupRoute)

const chatsRoute = require('./routes/chats')
app.use('/chats' , chatsRoute)

const privateConversation = require('./routes/privateConversation')
app.use('/privateConversation' , privateConversation)


const loginRoute = require('./routes/login')
app.use('/login' ,loginRoute)

const dashboardRoute = require('./routes/dashboard')
app.use('/dashboard' , dashboardRoute)

const feedRoute = require('./routes/feed')
app.use('/feed' , feedRoute)

app.get('/logout', router_external_protection ,async (req, res) => {
    let requester = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_KEY, (error, decodedToken) => {
        AccountsCollection.findOne({ "identifier.publicKey": decodedToken.identifier}, (error, user) => {
            user.isActive = false
            user.save()
        })
    })
    res.cookie('jwt', '', { httpOnly: true, maxAge: '1' })
    res.cookie('userid' , "", { httpOnly : true, maxAge  : "1"})
    res.status(302).redirect("/login")
})

app.get('/inquiry/', router_external_protection, (req, res) => {
    let queryType = req.query.type
    
    if (queryType === 'status') {
        let targetUser = req.query.u
        AccountsCollection.findOne({ identifier: { publicKey: targetUser } }, (error, user) => {
        if (user) {
            if (user.isActive) {
                res.status(200).json({ isActive: true })
            }
            else {
                res.status(200).json({ isActive: false})
            }
        }
        else {
            res.status(404).json({error : 'Bad Request'})
            console.log(error)
        }
    })
    }
})

app.use('/profiledata', router_external_protection, async (req, res) => {
    const allusers = mongoose.model('accounts')
    let public_key = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_KEY, (error, decoded) => {
        if (error) {
            return null
        }
        else {
            return decoded.identifier
        }
    })
    let user_data = await AccountsCollection.findOne({ identifier: { publicKey : public_key } }, (error, user) => {
        if (error) {
        }
        
    }).select('-password -notifications -preferences -_id -requests')
    res.status(200).json({user_data})
})
app.use('/notificationsdata', router_external_protection, async (req, res) => {
    res.status(200).json({message : "route was hit"})
})

// Listening Port

server.on('request',app)
server.listen(Port)