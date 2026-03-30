const express = require('express')
const router = express.Router()

//? Getting Chat of user who is logged in
let AccountsCollection = require('../models/account')
let {PrivateChat} = require('../models/chat.model')

let messageFetchingLimit = 10;


function standardMessage(message){

    let developedMessage = {
        content : message.content,
        content_received : message.content_received,
        content_seen : message.content_seen,
        sending_user : message.sending_user,
        receiving_user : message.receiving_user,
        delivery_date : message.delivery_date,
        delivery_time : message.delivery_time,
    }

    if(message.attachment !== undefined){
        developedMessage.attachment_url = `http://localhost:5000/chats/media/${message.attachment.file_name}`
        developedMessage.attachment_type = message.attachment.file_type
    }

    return developedMessage;

}


router.get('/' , async (req, res) => {
    let targetUserName;
    // Here We Will Find Target User Name to whom the logged in user is talking 
    
    // AccountsCollection.findOne({identifier : {publicKey : req.query.targetUserPublicKey}} , (err,success) => {
    //     if(success){
    //         targetUserName = success.name
    //     }
    //     else {
    //         return null;
    //     }
    // })

    try {
        let {userName} = await AccountsCollection.findOne({'identifier.publicKey' : req.query.targetUserPublicKey})
        targetUserName = userName
      } catch (e) {
        targetUsername = null
      }

    console.log('target search')
    console.log(targetUserName)
    // Here we will find and send previous chats of these chatting users

    const previousChats = []
    let currentUserMessages = []
    PrivateChat.findOne({ $and : [{'template.users' :{$in : req.query.userPublicKey}} , {'template.users' : {$in : req.query.targetUserPublicKey}}]}, async (err,usersChatObject) => {
        // console.log(currentUserMessages)    
        // console.log(usersChatObject.template.messages)    
        if (usersChatObject) {
                const userPreviousChats = usersChatObject.template.messages
                let previousMessageCount = parseInt(req.query.nfmr)

                if(userPreviousChats.length > 0){
                
                    //? IF Messages Are Less Than fetchLimit 
                    if((userPreviousChats.length - previousMessageCount) <= messageFetchingLimit ){
                        console.log('messages are less than 10')
                        console.log(previousMessageCount)
                        for(let index = userPreviousChats.length - (previousMessageCount + 1) ; index >= 0; index--){
                            let message = standardMessage(userPreviousChats[index])
                            currentUserMessages.push(message)
                        
                        }
                    }
                    //? IF Messages are not available
                    
                    else if (userPreviousChats.length < 1 || userPreviousChats.length == -1){
                        res.json({messageCount : 0})
                    }
                    
                    //? Otherwise if Messages are available and more than or equals to 10
                    
                    else {
                        let numberOfMessages = userPreviousChats.length - 1
                        let messageLeftToShow = numberOfMessages - previousMessageCount
                        
                        if(messageLeftToShow <= 10){
                            
                            for (let index = messageLeftToShow; index >= 0; index--) {
                                let message = standardMessage(userPreviousChats[index])
                                currentUserMessages.push(message)
                            }
                        }
                        else {
                            // If messages are more than 10
                            console.log(messageLeftToShow - 10);
                            for (let index = messageLeftToShow; index > messageLeftToShow - 10; index--) {
                                let message = standardMessage(userPreviousChats[index])
                                currentUserMessages.push(message)
                            }
                        }
                    }

                previousChats.push({
                    userPublicKey : req.query.userPublicKey,
                    targetUserPublicKey : req.query.targetUserPublicKey,
                    targetName : targetUserName,
                    serverSentMessageCount : `${previousMessageCount + (currentUserMessages.length)}`,
                    messages : currentUserMessages
                })
                
                console.log(previousChats)
                res.json(previousChats)
                
            }
            else {
                res.json({error : "No Previous Messages Are Available"})

                }
            }
            else {
                console.log(err);
                res.status(404).json({ error: 'Messages Record Is Not Available'})
            }
    })
})
    
module.exports = router