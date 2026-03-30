require('dotenv').config()
const express = require("express")
const app = express()
const WebSocket = require('ws')
let jwt = require('jsonwebtoken')
let fs = require('fs')
let {PrivateChat, GroupChat} = require('./models/chat.model')
const { Lookup } = require('./controllers/cookie.finder')
let { saveAsFile } = require('./controllers/savingFiles')
const crypto = require('crypto')
let path = require('path')
let {parse} = require('url')
let {
    ACCESS_TOKEN_KEY
} =  process.env

let SocketConnectionHandler = (socket, req, SocketServer) =>{
    let socketPortionUrl = parse(req.url).query.split('=')[1]
    

    //? Validating Socket Connection


    let token_payload = jwt.verify(Lookup(req.headers.cookie, 'jwt'), ACCESS_TOKEN_KEY, (error, payload) => {
        if (error) {
            console.log(error)
        }
        else {
            return payload.identifier
        }
    })
    

    let refererPageTarget;

    console.log("Socket is connected");
    socket.chatRoom = {
        logged_user_public_key: token_payload,
        target_user_public_key : ""
    }
    
    //? PING And PONG Implementation   Will do it properly later
    // function heartbeat() {
    //     console.log('User has reponded with a pong');
    //     this.isAlive = true
    //     // console.log(this.isAlive)
    // }
    // socket.on('pong', heartbeat)


    // Check for died connections at regular intervals.
    
    // setInterval(function () {
    //     SocketServer.clients.forEach(function (connection) {
    //     //  Request the client to respond with pong. Client does this automatically.
    //         connection.isAlive = false;
    //         connection.ping();
    //     });
    // }, 10000);


    //? SETTING UP NOTIFICATION SYSTEM
    
    // const host_user = socket.chatRoom.socketClientID
    // const unReadMessages = PrivateChat.find({template : {
    //     users : {$in : {host_user}},
    //     messages : {content_received : true}
    // }} , (err, doc)=>{
        
    //     if(doc) {
    //         console.log(doc)
    //     }
    //     else {
    //         console.log(err)
    //     }
    // })
    
    


    function getDateAndTimeAtServer(){
        let today = new Date()
        
        let DTObject = {
            DATE : today.toLocaleString('en-AU', {day : "numeric", month : 'numeric', year : "numeric", timeZone : "UTC"}),
            TIME : today.toLocaleString('en-US' , { hour : "numeric", minute : "numeric", hour12 : true})
        }
        return DTObject;
        
    }

 
    socket.on('message', async (data) => {
        
        let binaryAttachment = false;
        let FILENAME = crypto.randomBytes(14).toString('hex')
        let {DATA,ATTACHMENT,TARGET_USER, DATE_TIME} = await JSON.parse(data)
        socket.chatRoom.target_user_public_key = TARGET_USER

        if (ATTACHMENT !== null && ATTACHMENT !== undefined || ATTACHMENT === '') {

            // ATTACHMENT going to contain some binary data under following key names
            // IMAGE. AUDIO, VIDEO, DOCUMENT etc
            // We would use REGEX to find extension of sent data
            // 

            
            if(ATTACHMENT.TYPE === 'image'){
                binaryAttachment = true
                saveAsFile(ATTACHMENT.TYPE,FILENAME,ATTACHMENT.CONTENT,socket.chatRoom.logged_user_public_key)
            }
        }
        let saveFlag = true
        SocketServer.clients.forEach( (client,index,clients) => {
            console.log('these are the current clients of socket')
            console.log(Array.from(clients).length)
                socket.on('close', () => {
                    console.log(`${socket.chatRoom.logged_user_public_key} has lost the connection`)
                })
                const linkedChatObject = PrivateChat.findOne({$and : [{'template.users' : {$in : socket.chatRoom.target_user_public_key}}, {'template.users' : {$in : socket.chatRoom.logged_user_public_key}}]}, async (err, messageDocument) => {
                    if(messageDocument){ 
                        
                        let messageInstance = {
                            sending_user : socket.chatRoom.logged_user_public_key,
                            receiving_user : socket.chatRoom.target_user_public_key,
                            content_received : false,
                            content_seen : false,
                            content : DATA,
                            delivery_date : getDateAndTimeAtServer().DATE,
                            delivery_time : getDateAndTimeAtServer().TIME
                        }


                        if(binaryAttachment){
                            messageInstance = {
                                ...messageInstance,
                                attachment: {file_name : FILENAME, file_type : ATTACHMENT.TYPE}
                            }
                            
                        }

                        
                        let appendedMessageObject = PrivateChat.findOne({_id : messageDocument._id}, async (err,chatObject)=>{
                            if(chatObject){
                                chatObject.template.messages.push(messageInstance)
                                let currentClientCount = Array.from(clients).length
                                // console.log(currentClientCount)

                            if(currentClientCount < 2){
                                await chatObject.save()
                                
                            }
                            else if(currentClientCount >= 2){
                                // console.log('crash might occur')
                                console.log('There are more than one client in socket')
                                // console.log(client)
                                
                                if(saveFlag){
                                    if(client !== socket){
                                        saveFlag = false
                                        await chatObject.save()
                                        if(socket.chatRoom.target_user_public_key === client.chatRoom.logged_user_public_key){
                                            client.send(data)
                                        }
                                    }
                                }
                                
                            }
                                try {
                                    if(client.chatRoom.logged_user_public_key  === socket.chatRoom.target_user_public_key){
                                        //* IMPLEMENT MESSAGE SEEN FUNCTION
                                      
                                    }
                                    else {
                                        // referenceMessage[referenceMessage.length - 1].content_received = false
                                        // updatedMessageDocument.save()
                                    }
                                    
                                } catch (error) {
                                    console.log(error)
                                }

                            }
                            else {
                                console.log(err)
                            }
                        })
                    }
                 
                    else if (!messageDocument) {
                        console.log('Message Document Is not there')
                        socket.chatRoom.target_user_public_key = TARGET_USER
                        let newMessage = new PrivateChat({
                            template : {
                                room : {
                                    url : '',
                                    participants : [
                                        
                                    ]
                                },
                                users: [socket.chatRoom.logged_user_public_key,socket.chatRoom.target_user_public_key],
                                messages : [{
                                    sending_user : socket.chatRoom.logged_user_public_key,
                                    receiving_user : socket.chatRoom.target_user_public_key,
                                    content_received : false,
                                    content_seen : false,
                                    content : DATA,
                                    delivery_date : DATE_TIME.DATE,
                                    delivery_time : DATE_TIME.TIME
                                }]
                            }
                        })

                        if(binaryAttachment){
                            newMessage = new PrivateChat({
                                template : {
                                    room : {
                                        url : '',
                                        participants : [
                                            
                                        ]
                                    },
                                    users: [socket.chatRoom.logged_user_public_key,socket.chatRoom.target_user_public_key],
                                    messages : [{
                                        sending_user : socket.chatRoom.logged_user_public_key,
                                        receiving_user : socket.chatRoom.target_user_public_key,
                                        content_received : false,
                                        content_seen : false,
                                        content : DATA,
                                        delivery_date : DATE_TIME.DATE,
                                        delivery_time : DATE_TIME.TIME,
                                        attachment: {file_name : FILENAME, file_type : ATTACHMENT.TYPE}
                                    }]
                                }
                            })
                            
                        }

                        try {
                            // if(socket.chatRoom.target_user_public_key === client.chatRoom.logged_user_public_key){}
                            if(client === socket){
                                console.log(socket.chatRoom.logged_user_public_key)
                                console.log(socket.chatRoom.target_user_public_key)
                                const savingMessage = await newMessage.save()
                                saveFlag = false
                            }
                            // if(client.readyState === WebSocket.OPEN){


                            //     if(currentClientCount < 2){
                            //         await chatObject.save()
                                    
                            //     }
                            //     else if(currentClientCount >= 2){
                            //         // console.log('crash might occur')
                            //         console.log('There are more than one client in socket')
                            //         // console.log(client)
                                    
                            //         if(saveFlag){
                            //             if(client !== socket){
                            //                 saveFlag = false
                            //                 await chatObject.save()
                            //                 if(socket.chatRoom.target_user_public_key === client.chatRoom.logged_user_public_key){
                            //                     client.send(data)
                            //                 }
                            //             }
                            //         }
                                    
                            //     }



                                if(client !== socket){
                                    if(socket.chatRoom.target_user_public_key === client.chatRoom.logged_user_public_key){
                                        client.send(data)
                                    }
                                }
                            // }
                        } catch (error) {
                            console.log(error)
                        }
                        
                    }
                    else if(err){
                        console.log(err)
                    }
                })
                
                

                // let tester = PrivateChat.find({$and : [{'template.users' : {$in : socket.chatRoom.target_user_public_key}}, {'template.users' : {$in : socket.chatRoom.logged_user_public_key}}]}, (error,doc) => {
                //     console.log(doc)
                // })

                // console.log(tester)
                
            
        })
    })




}

module.exports = {
    SocketConnectionHandler
}