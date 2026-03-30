const express = require("express")
const mongoose = require('mongoose')
const app = express()
const database = mongoose.connection
const router = express.Router()
const process = require('process')
const Grid = require('gridfs-stream')
let fs = require('fs')
let path = require('path')
let gfs;
const accountsCollection = require('../models/account')
let {router_internal_protection, router_external_protection} = require('../controllers/jwtAuth')
database.once('open' , ()=>{
    gfs = Grid(database.db , mongoose.mongo)
    gfs.collection('userDpImages')
    
})

router.get('/' , (req,res) => {
    
    router.use("/", express.static(process.cwd() + "/static"))
    res.sendFile(process.cwd() + "/static/customProfile.html")

    
  })
  
  router.get('/data', router_external_protection, (req,res)=>{
    let requestedUser = req.query.u
    console.log(requestedUser)
    mongoose.model('accounts')
    const userDetails = accountsCollection.findOne({ 'identifier.publicKey' : req.query.u }, (error, user) => {
    if (user) {
      let user_object = {
        publicKey : user.identifier.publicKey,
        name: user.userName,
        fname: user.firstName,
        lname: user.lastName,
        followers : user.followers.length,
        following : user.following.length
      }
      console.log(user_object);
      res.status(200).json(user_object)
    }
    else {
      console.log(error)
      res.status(404).json({error : "Looks Like Data You're Looking For Is Not Available"})
    }
  })
  
  })


router.get('/public/media', async (req,res)=>{

  let userPublicKey = req.query.upk
  let requestedLoadType = req.query.type

  let currentUser = await accountsCollection.findOne({ "identifier.publicKey" : userPublicKey }, (error, success) => {
      if (error) {
        return null;
      }
      else {
        return success;
      }  
  })

  let userKey = currentUser.identifier.publicKey
    
    try {
        if(currentUser !== null){

          let resizedFilePath = path.join(process.cwd() + `/server/accounts/${userKey}/avatar/resized/${userKey}-avatar.jpg`)
          let filePath = path.join(process.cwd() + `/server/accounts/${userKey}/avatar/${userKey}-avatar.jpg`)
          if(fs.existsSync(resizedFilePath)||fs.existsSync(filePath)){
            if(requestedLoadType === 'icon'){
              let file = fs.createReadStream(resizedFilePath)
              file.pipe(res)
          }
          else if( requestedLoadType === 'image') {
            let file = fs.createReadStream(filePath)
            file.pipe(res)
          }
        }
        else {
          res.status(404).json({error : "profile picture is not available"})
        }
        
      }
    }
    catch(error){
      res.json({error})
    }
})

module.exports = router