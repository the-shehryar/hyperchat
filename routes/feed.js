const express =  require('express')
const router = express.Router()
const process = require('process')
const mongoose = require('mongoose')

const {obtainPublicKey, router_external_protection} = require('../controllers/jwtAuth')



router.get('/',router_external_protection ,(req,res) => {
    res.sendFile(process.cwd() + '/static/feed.html')
})

router.get('/random-suggestion-list', router_external_protection ,async (req, res)=>{
    const clientPublicKey =  obtainPublicKey(req)

    if (clientPublicKey !== null) {
        const userAccounts = mongoose.model('accounts')
        const follow_suggestions = await userAccounts.find({'identifier.publicKey' : { $ne: clientPublicKey } }, (error, doc) => {
            if(error){
                res.status(505).json({error : "Internal Server Error : Accounts are not yet available"})
            }else {
                return doc
            }

        }).select('firstName lastName followers following userName chatables identifier.publicKey -_id')
        let filtered_suggestions = []
        
        follow_suggestions.map(item =>{
            // let tempObject = {
            //     firstName : item.firstName,
            //     lastName : item.lastName,
            //     userName : item.userName,
            //     following : item.following,
            //     followers : item.followers,
            //     identifier : {
            //         publicKey : item.identifier.publicKey
            //     }
            // }
            if(item.chatables.length > 0){
                item.chatables.map(user => {
                    if(user.key === clientPublicKey){
                        let tempObject = {
                            firstName : item.firstName,
                            lastName : item.lastName,
                            userName : item.userName,
                            following : item.following,
                            followers : item.followers,
                            identifier : {
                                publicKey : item.identifier.publicKey
                            },
                            followedByClient : true
                        }
                        // tempObject.followedByClient = true
                        let pushable = false
                        filtered_suggestions.filter(chatObject => {
                            if(chatObject.identifier.publicKey === tempObject.identifier.publicKey){
                                pushable = false
                                return
                            }
                            else {
                                pushable = true
                            }
                        })

                        if(pushable === true){
                            filtered_suggestions.push(tempObject)
                        }
                    }
                    else {
                        let tempObject = {
                            firstName : item.firstName,
                            lastName : item.lastName,
                            userName : item.userName,
                            following : item.following,
                            followers : item.followers,
                            identifier : {
                                publicKey : item.identifier.publicKey
                            },
                            followedByClient : false
                        }
                        let pushable = false
                        filtered_suggestions.filter(chatObject => {
                            if(chatObject.identifier.publicKey === tempObject.identifier.publicKey){
                                pushable = false
                                return
                            }
                            else {
                                pushable = true
                            }
                        })

                        if(pushable === true){
                            filtered_suggestions.push(tempObject)
                        }
                        // tempObject.followedByClient = false
                        // filtered_suggestions.push(tempObject)
                    }
                })
            }
            else if(item.chatables.length < 1 || item.chatables === undefined || item.chatables === null){
                let tempObject = {
                    firstName : item.firstName,
                    lastName : item.lastName,
                    userName : item.userName,
                    following : item.following,
                    followers : item.followers,
                    identifier : {
                        publicKey : item.identifier.publicKey
                    },
                    followedByClient : false
                }
                filtered_suggestions.push(tempObject)
            }
        })

    
        console.log(filtered_suggestions)
        console.log(follow_suggestions)
        res.header({
            'Content-Type' : "application/json"
        })
        res.json({follow_suggestions : follow_suggestions})
    }
})


module.exports = router