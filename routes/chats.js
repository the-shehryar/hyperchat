const express = require('express')
const router = express.Router()
const AccountsCollection = require('../models/account')
const {PrivateChat} = require('../models/chat.model')
const process = require('process')
const {ACCESS_TOKEN_KEY} = process.env
let {router_external_protection, obtainPublicKey} = require("../controllers/jwtAuth")
const jwt = require('jsonwebtoken')
let fs = require('fs')
let path = require('path')

router.get('/' , router_external_protection, (req, res)=>{
    res.status(200).sendFile(process.cwd() + '/static/chat.html')
})

router.get('/', router_external_protection, (req, res) => {

    let targetUser = req.query.user
    const searchUser = AccountsCollection.findOne({ identifier: { publicKey: targetUser } }, async (err, doc) => {
        if(doc){
            res.status(200).sendFile(process.cwd() + '/static/chat.html')
        }
        else {
            console.log(err) 
        }
    })
})

router.get('/connectedAccounts', router_external_protection , async (req, res)=>{

    const clientKey = req.query.rpk
    const verifyUser = jwt.verify(req.cookies.jwt, ACCESS_TOKEN_KEY, (error, success)=>{
        if(success.identifier === clientKey){
            return true
        }
        else {
            return false
        }
    })

    if(verifyUser){
        const searchUserChats =  PrivateChat.find({'template.users' : {$in : clientKey}}, async (error,records)=>{
            // records will be an array
            let leftingMessages= []
            let initialMessagePayload = {}
            let userMessageObjectArray = []
            // All message records that contain client key essentially all previous chats of user            
            let target;
            

            for(let index = 0; index < records.length; index++){
                userMessageObjectArray = []
                let savedMessage = records[index]
                let previousMessagesArray = savedMessage.template.messages
                let involvingUser = savedMessage.template.users
                let updateableIndex = []
                // console.log(involvingUser)

                involvingUser.map( user => {
                    if(user !== clientKey){
                        target = user
                    }
                })
                
                let targetUser = await AccountsCollection.findOne({'identifier.publicKey' : target}, (error,user)=>{
                    return user
                })


                // for(let index = previousMessagesArray.length - 1; index >= 0; index--){
                //     console.log(previousMessageArray[index])
                // }

                previousMessagesArray.filter( (item,index) => { 
                    
                    if(!item.content_received){
                        //? Finding Unread Messages 
                        let customMessage = {
                            content : item.content,                 
                            content_received : item.content_received,
                            content_seen : item.content_seen,
                            sending_user : item.sending_user,
                            receiving_user : item.receiving_user,
                            delivery_date : item.delivery_date,
                            delivery_time : item.delivery_time
                        }
                        if(Object.getOwnPropertyNames(item.attachment).length === 0){
                            console.log('No luck')
                        } 
                        else {
                            //? Temporary Fix 
                            for(let entry in item.attachment){
                                if(item.attachment[entry] == 'image' || item.attachment[entry] == 'audio' || item.attachment[entry] == "video" || item.attachment[entry]=='document'){
                                    customMessage.attachment_url = `http://localhost:5000/chats/media/${item.attachment.file_name}`
                                    customMessage.attachment_type = 'image'
                                }
                            }
                        }
                        
                        userMessageObjectArray.push(customMessage)
                        item.content_received = true
                    }
                    

                    // PrivateChat.findByIdAndUpdate(savedMessage._id, {'template.messages' : previousMessagesArray}, (err,doc)=>{
                    //     console.log(doc.template.messages)
                    // })

                    initialMessagePayload[targetUser.userName] = {
                        metadata : {
                            publicKey : targetUser.identifier.publicKey,
                            name : targetUser.userName
                        },
                        messages : userMessageObjectArray
                    }  
                })

                //? if unread messages are less than 15 then do this 

                if(initialMessagePayload[targetUser.userName].messages.length < 15){
                    let additionalMessageCount = initialMessagePayload[targetUser.userName].messages.length
                    console.log(additionalMessageCount)

                    if(additionalMessageCount === 0){
                        let readMessage = []
                        let checkCount = Math.floor(previousMessagesArray.length / 2)
                        let loadCount = 0
                        if(checkCount >=15){
                            loadCOunt = checkCount
                        }else if(checkCount > 15){
                            loadCount = 15
                        }

                        for(let index = previousMessagesArray.length - 1 ; index > (previousMessagesArray.length - 1) - loadCount; index--){
                            let currentMessage = previousMessagesArray[index] 
                            let leftOverMessage = {
                                content : currentMessage.content,
                                content_received : currentMessage.content_received,
                                content_seen : currentMessage.content_seen,
                                sending_user : currentMessage.sending_user,
                                receiving_user : currentMessage.receiving_user,
                                delivery_date : currentMessage.delivery_date,
                                delivery_time : currentMessage.delivery_time
                            }
                            if(currentMessage.attachment !== undefined){
                                leftOverMessage.attachment_url = `http://localhost:5000/chats/media/${currentMessage.attachment.file_name}`
                                leftOverMessage.attachment_type = currentMessage.attachment.file_type
                            }

                            readMessage.push(leftOverMessage)
                        }
                        initialMessagePayload[targetUser.userName].messages = readMessage
                    }
                    else if(previousMessagesArray.length > initialMessagePayload[targetUser.userName].messages.length){
                            for(let index = previousMessagesArray.length - 1 ; index > (previousMessagesArray.length - 1) - initialMessagePayload[targetUser.userName].messages.length; index--){
                                let currentMessage = previousMessagesArray[index] 
                                let leftOverMessage = {
                                    content : currentMessage.content,
                                    content_received : currentMessage.content_received,
                                    content_seen : currentMessage.content_seen,
                                    sending_user : currentMessage.sending_user,
                                    receiving_user : currentMessage.receiving_user,
                                    delivery_date : currentMessage.delivery_date,
                                    delivery_time : currentMessage.delivery_time
                                }
                                if(currentMessage.attachment !== undefined){
                                    leftOverMessage.attachment_url = `http://localhost:5000/chats/media/${currentMessage.attachment.file_name}`
                                    leftOverMessage.attachment_type = currentMessage.attachment.file_type
                                }
    
                                leftingMessages.push(leftOverMessage)
                            }
                            initialMessagePayload[targetUser.userName].messages = [...initialMessagePayload[targetUser.userName].messages, ...leftingMessages] 
                    }

                }

                else if(initialMessagePayload[targetUser.userName].messages.length > 15){
                    console.log('more than 15 unread messages')
                }
            }
            console.log(initialMessagePayload)
            res.json({first_load : initialMessagePayload})
        })
    }

})


router.get('/media/:imageFileName',router_external_protection,(req,res)=>{
    let imageToSearch = req.params.imageFileName

    PrivateChat.findOne({'template.messages.attachment.file_name' : imageToSearch}, 'template.messages.$' ,(error, message)=>{
        let targetMessage = message.template.messages[0]
        let requestingKey = obtainPublicKey(req)

        if(requestingKey === targetMessage.sending_user || requestingKey === targetMessage.receiving_user){
            let file = fs.createReadStream(path.join(process.cwd() + `/server/media/${targetMessage.sending_user}/sent/images/${imageToSearch}.jpg`))
            file.pipe(res)
        }

    })
     
})

module.exports = router
