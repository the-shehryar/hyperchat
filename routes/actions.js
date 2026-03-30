let {REST_PASSWORD_SECRET} = process.env
let {isNotFaulty} = require('../controllers/supportFunctions')
const express = require('express')
const app = express()
const fs = require('fs')
const { router_external_protection, obtainPublicKey } = require('../controllers/jwtAuth')
const router = express.Router()
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const AccountsCollection = require('../models/account')
const path = require('path')
let nodemailer = require('nodemailer')
let bcrypt = require('bcrypt')


async function sendNotification(notification){
    if(typeof notification === 'object'){
        AccountsCollection.findOne({identifier : {publicKey : notification.target}} , async (error,user) => {
            if(user){   
                if(user.preferences.private){
                    user.notifications.push({
                        initiator : notification.clientKey,
                        initiatorName : notification.clientName,
                        receiver : notification.target,
                        requestedAction : notification.action,
                        message : `${notification.clientName} has reqested to follow you`
                    })
                    await user.save()
                }
                else if (!user.preferences.private){
                    user.notifications.push({
                        initiator : notification.clientKey,
                        initiatorName : notification.clientName,
                        receiver : notification.target,
                        requestedAction : notification.action,
                        message : `${notification.clientName} has started following you`
                    })
                    await user.save()
                }
            }
        })
    }
}
async function sendActionRequest(incomingRequest){
    if(typeof incomingRequest === 'object'){
        await AccountsCollection.findOne({identifier : {publicKey : incomingRequest.target}} , (error,user) => {
            if(user){
                user.requests.push ({
                    initiator : incomingRequest.clientKey,
                    initiatorName : incomingRequest.clientName,
                    receiver : incomingRequest.target,
                    requestedAction : incomingRequest.action
                })
                sendNotification(incomingRequest)
            }
        })
    }
}




// Put Request Handling Route for /action/{queryStrings}
router.put('/' , (req,res) => {
    // qan ----  Query Action Name              follow,unfollow,block,unblock
    // tpk --- Target Public Key                   publicKey
    // rpk --- Requesting Public Key               publicKey

    //! Implement Validation Here
    
    const queryActionName = req.query.qan
    const targetPublicKey = req.query.tpk
    const requestingPublicKey = obtainPublicKey(req)
    // Checking If Requested or Target User Exists
    AccountsCollection.findOne({"identifier.publicKey": targetPublicKey}, async (err,targetDetails) => {
        
        if(err){
            console.log(err);
        }
        else if (targetDetails === null){
            console.log('user does not exist')
            res.json({error : "Bad Request - User does not exist"})
        }
        else {
            //  If User Exists Then 
            //  Match The Requested Action By The Client

            function filterChatables (chatables, username, key, url) {
                let keyExistance =  false
                if(chatables !== undefined){
                    chatables.filter ( item => {
                        if(item.key === key){
                            keyExistance = true
                            console.log(chatables)
                            console.log('user is already there')
                            return null
                        }
                    })
                }
                if(!keyExistance) {
                    chatables = [...chatables, {username,key,url}]
                    return chatables
                }


            }

            async function followingOperation (requestingUser,targetUsername,targetUser,socketUrl){
                try {
                    
                    AccountsCollection.findOne({"identifier.publicKey" : requestingUser} , async (err,user)=>{
                        
                        //? Adding publicKey into clients following list 

                        if(user.following.length < 1){

                            //? Pushing the key into empty following array 
                            try {
                                
                                user.following.push(targetUser)
                                let chatableRecordCheck = filterChatables(user.chatables, targetUsername, targetUser, socketUrl)        
                   
                                if(chatableRecordCheck !== null && chatableRecordCheck !== '' && chatableRecordCheck !== undefined) {
                                    user.chatables = chatableRecordCheck
                                }
                        

                                if(user.chatables !== null){
                                    await user.save()
                                }
                            }
                            catch(error){
                                console.log(error)
                            }
                        }
                        else {
                            let targetExists = false
                            user.following.map(
                                async (item) => {
                                    if(item === targetUser){
                                        targetExists = true
                                        res.json({error:  "You're already following this user"})
                                    }
                                }
                            )
                            if(!targetExists){
                                try {
                                    user.following.push(targetUser)
                                    user.chatables = filterChatables(user.chatables, targetUsername, targetUser, socketUrl)
                                    await user.save()

                                }
                                catch (error){
                                    console.log(error)
                                }
                            }
                        }
                    })
                }
                catch(error) {
                    console.log(error)
                }
            }



            //?  If Client Wants to follow target user then 
            if(queryActionName === 'follow'){
                let socketUrl = crypto.randomBytes(16).toString('hex')
                
                if(targetDetails.followers.length < 1){
                    
                    if(targetDetails.preferences.private){
                        let requestObject = {
                            target : targetDetails.identifier.publicKey,
                            // private : true,
                            clientName : requestingUserName,
                            clientKey : requestingPublicKey,
                            action : queryActionName
                        }
                        sendActionRequest(requestObject)
                    }
                    else {
                        
                        let {userName} = await AccountsCollection.findOne({'identifier.publicKey' : requestingPublicKey}, (error,user)=>{
                            if(user){
                                return user
                            }
                            else {
                                console.log('User does not exist')
                                return null
                            }
                        })
                        targetDetails.followers.push(requestingPublicKey)
                        let chatableRecordCheck = await filterChatables(targetDetails.chatables, userName, requestingPublicKey, socketUrl)        
                        
                        if(chatableRecordCheck !== null && chatableRecordCheck !== '' && chatableRecordCheck !== undefined) {
                            targetDetails.chatables = chatableRecordCheck
                        }
                        
                        try {
                            await targetDetails.save()
                            followingOperation(requestingPublicKey, targetDetails.userName,targetPublicKey,socketUrl)
                            res.json({requestStatus : 'completed', success : true})
                        }
                        catch (error) {
                            res.json({requestStatus : 'failed', success : false})
                            throw error
                        }
                    }
                    
                }
                else {
                    //  we assume that user does not exist in follower list 
                    let userExists = false
                    targetDetails.followers.map(
                        async item => {
                            if(item === requestingPublicKey){
                                userExists = true
                                res.json({error : "You're already following this user."})
                            }
                            
                        }
                    )
                     //* if Client Doesn't Exist Already, Request The Target User Or Add to followers if account is not private

                    if(!userExists){
                        //? If account is private then send request
                        if(targetDetails.preferences.private){
                            let requestObject = {
                                target : targetDetails.identifier.publicKey,
                                // private : true, 
                                clientName : requestingUserName,
                                clientKey : requestingPublicKey,
                                action : queryActionName
                            }
                            sendActionRequest(requestObject)
                        }
                        //  Add to followers Array if account is public
                        else if(!targetDetails.preferences.private){
                            let {userName} = AccountsCollection.findOne({'identifier.publicKey' : requestingPublicKey}, (error,user)=>{
                                if(user){
                                    return user
                                }
                                else {
                                    console.log('User does not exist')
                                    return null
                                }
                            })
                            targetDetails.followers.push(requestingPublicKey)
                            let chatableRecordCheck = await filterChatables(targetDetails.chatables, userName,requestingPublicKey, socketUrl)        
                    
                            if(chatableRecordCheck !== null && chatableRecordCheck !== '' && chatableRecordCheck !== undefined) {
                                targetDetails.chatables = chatableRecordCheck
                            }

                            try {
                                await targetDetails.save()
                                followingOperation(requestingPublicKey,targetDetails.userName,targetPublicKey,socketUrl)
                                res.json({requestStatus : 'completed', success : true})
                            }
                            catch(error){
                                throw error
                            }
                            
                            
                        }
                    }
                }

              
                //? Check If Client Already Exists

                //* Finding Client Name
                // let requestingUserName = AccountsCollection.findOne({identifier : {publicKey : requestingPublicKey}} , async (error, user) => {
                //     if(!user){
                //         console.log(error);
                //         return null;
                //     }
                //     else {
                //         console.log(user.name);
                //         return user.name
                //     }
                // })


                
               

                //? Updating corresponding following array

                
                
                // console.log(targetDetails);
            }



            //?i If Client wants to unfollow target user then
            if(queryActionName === 'unfollow'){
                //? removing user from the targets followers list 
                let deletingIndex = targetDetails.followers.indexOf(requestingPublicKey)
                if(deletingIndex > -1){
                    targetDetails.followers.splice(deletingIndex)
                    await targetDetails.save()


                    AccountsCollection.findOne({'identifier.publicKey' : requestingPublicKey}, async (error,user)=>{
                        if(!user){
                            res.json({error : "Requesting user key has been tempered"})
                        }
                        else if( user ){
                            let deletingIndex = user.following.indexOf(targetPublicKey)
                            user.following.splice(deletingIndex)
                            await user.save()
                        }
                    })
                }




            }
            //? If Client wants to block target user then
            if(queryActionName === 'block'){
                //! Implementation is Pending
            }
            //?i If Client wants to unblock target user then
            if(queryActionName === 'unblock'){
                //! Implementation is Pending
            }
        }
    } )
    
    
})

router.get('/',(req,res)=>{
    let recovery;

    if(req.query.type === 'recovery'){
        res.sendFile(process.cwd() + '/static/recovery.html')
    }

})


router.post('/recovery',(req,res)=>{
    let recoveryMail = req.body.recovery_email
    AccountsCollection.findOne({email : recoveryMail},(error, user)=>{
        if(user){
            let tokenUniqueSecret = REST_PASSWORD_SECRET + user.password
            let tokenPayload = {
                email : user.email,
                publicKey : user.identifier.publicKey
            }

            let token = jwt.sign(tokenPayload,tokenUniqueSecret, {expiresIn : "15m"})
            let resetLink = `http://localhost:5000/actions/reset-password/${user.identifier.publicKey}/${token}`
            console.log(resetLink)
            // Sending TokenBased Link To Emails
            nodemailer.createTransport({
                host : "shehryar1x@gmail.com"
            })
            res.json({success : true, message : 'The reset link is successfully sent to your email which is valid for 15 mints'})
        }
        else if(!user){
            // console.log(error)
            res.json({success: false, error : 'This email is not registered', message : "This does not exist or was not confirmed as recovery email."})
        }
    })
    
})


router.get('/reset-password/:id/:token', (req,res)=>{
    app.use('/' , express.static(__dirname + '/static'))
    let {id,token} = req.params
    AccountsCollection.findOne({'identifier.publicKey' : id}, (error, user)=>{
        if(user){
            res.sendFile(process.cwd() + '/static/reset.html')
        }
        else if(!user){
            res.status(404).send('Bad Request User Does Not Exists')
        }
        else {
            res.status(500).send("Something went wrong.")
        }
    })
})
router.post('/reset-password/:id/:token', (req,res)=>{
    
    let {id,token} = req.params
    console.log(req.body)
    AccountsCollection.findOne({'identifier.publicKey' : id}, (error, user)=>{
        if(user){
            res.send('dude')
        }
        else if(!user){
            res.status(404).send('Bad Request User Does Not Exists')
        }
        else {
            res.status(500).send("Something went wrong.")
        }
    })
})


router.get('/public/', router_external_protection, async (req,res)=>{
    const token = req.cookies.jwt
    const targetSubject = req.query.target

    jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (error, decodedToken)=>{
        if(error){
            throw error
        }
        else {
            let name, image
        }
    })

    // if(targetSubject === 'conversations'){

    // }
})

router.get('/getfriends', async (req,res)=>{
    const clientKey = obtainPublicKey(req)

    let friends = []

    if(clientKey !== null){
        let {chatables} = await AccountsCollection.findOne({"identifier.publicKey" : clientKey}, (error,account)=>{
            if(!error){
                return account
            }
            else {
                return null;
            }
        })
        // console.log(chatables)
        if(chatables !== null){
            
            console.log(chatables)

            if(chatables !== undefined){
                for(let friend of chatables){
                    console.log(friend)
                    friends.push( {
                        username : friend.username,
                        bio : '',
                        url : friend.url,
                        publickey : friend.key
                    } )
    
                }
            }
            console.log(friends)
        }
    }
    res.json({friends})
})

router.post('/update/password', async (req, res)=>{
    
    let userKey = obtainPublicKey(req) 
    let {currentPassword, newPassword, confirmPassword} = req.body
    AccountsCollection.findOne({'identifier.publicKey' : userKey},  (error, user)=>{
        if(user){
           bcrypt.compare(currentPassword, user.password, async (err,matched)=>{
                if(matched && newPassword === confirmPassword){
                    let hashedPassword = await bcrypt.hash(newPassword,10)
                    user.password = hashedPassword
                    user.save()
                    res.cookie('jwt', '', { httpOnly: true, maxAge: '2' })
                    res.send({success : true})
                    console.log('Password has been chnaged')
                }
           }) 
        }
    })
})

module.exports = router;