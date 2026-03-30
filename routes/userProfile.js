const process = require("process")
require('dotenv').config()

let {
    DATABASE_URL, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY
} = process.env
const fs = require('fs')
const express = require("express")
const mongoose = require('mongoose')
const router = express.Router()
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
const MulterSharpResizer = require('multer-sharp-resizer')
const database = mongoose.connection
const path = require('path')
const crypto = require('crypto')
const Grid = require('gridfs-stream')
let gfs;
let AccountsCollection = require('../models/account')
let {router_external_protection, obtainPublicKey, obtainKeyFromCookie} = require("../controllers/jwtAuth")
let jwt = require('jsonwebtoken')
let sharp = require('sharp')
database.once('open' , ()=>{
    gfs = Grid(database.db , mongoose.mongo)
    
    console.log('Database Connected')
})

//? Multer Storage
// Server File System Upload

// const storage  = multer.diskStorage({
//     destination : process.cwd() + "/server/accounts/profileImage", 
//     filename  : (req, file, callback) => {
//         callback(null , file.fieldname + '123' + path.extname(file.originalname))
//     }
// })

//* GridFS Storage


function isNotFaulty(element){
    if(element !== null && element !== undefined && element !== '' && element !== NaN && element !== 0){
        return true
    }
    else {
        return false
    }
}




//? Multer Call Function 




router.get('/', router_external_protection, (req,res) => {
    
    res.sendFile(process.cwd() + "/static/profile.html")
})
router.get('/info', async (req,res)=>{
    let userKey = req.query.userkey
    let loggedUser = obtainKeyFromCookie(req.cookies.jwt)
    
    if(userKey === loggedUser){
        let userInfo = await AccountsCollection.findOne({'identifier.publicKey': userKey}, (error,user)=>{
            if(error){
                throw error
            }
        }).select('-_id userName firstName lastName followers following ')
    
        res.json({user : userInfo})
    }
    
})
router.get('/getUserAvatar', router_external_protection, (req, res) => {

    let userIdentifier = jwt.verify(req.cookies.jwt, ACCESS_TOKEN_KEY,(error, decodedToken)=>{
        if(!error){
            return decodedToken.identifier
        }
        else if(error){
            console.log(error)
            return null
        }
        
    })

    try {
        
        let targetPath = path.join(process.cwd() + `/server/accounts/${userIdentifier}/avatar/${userIdentifier}-avatar.jpg`)
        if(fs.existsSync(targetPath)){
            let file = fs.createReadStream( path.join(process.cwd() + `/server/accounts/${userIdentifier}/avatar/${userIdentifier}-avatar.jpg`))
            file.pipe(res)
        }
        else {
            // res.status(404)
            res.status(304).json({error : "couldn't read"})
            console.log('the issue is directory path')
        }
    }
    catch(error){
        
        console.log(error)
    }


// res.status(404).json({error : "fuck you"})

})

router.post('/uploadAvatar' , router_external_protection, (req,res) => {

    let targetPath = path.join(process.cwd() + `/server/accounts/`)
    
    console.log('entered upload avatar')
    if(!fs.existsSync(targetPath)){
        fs.mkdirSync(targetPath, {
            recursive : true
        })
    }

    
    let userIdentifier = obtainKeyFromCookie(req.cookies.jwt)
    
    const diskSingleUpload = multer.diskStorage({
        destination: process.cwd() + `/server/accounts/${userIdentifier}/avatar/`,
        filename: function (req, file, cb) {
                // let userPublicKey = obtainKeyFromCookie(req.cookies.jwt) 
            cb(null, userIdentifier + '-' + `avatar${path.extname(file.originalname)}`)
        }
    })

    const multerFilter = (req, file, cb) => {
        if (file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' ) {
            cb(null, true);
        } 
        else {
            cb("Only jpeg & jpg are allowed", false);
        }
    };
            
    const uploadToDiskStorage = multer({
        storage : diskSingleUpload,
        fileFilters : multerFilter
    }).single('cropped-avatar-image')
    
       
    // Used by multer .array() or .single
    // const filename = `gallery-${Date.now()}`;
        
    // Used by multer .fields and filename must be same object prop
    
    uploadToDiskStorage(req , res, async (err) => {
    if(err){
        res.status(500).json({error : err, message : "Something Went Wrong after database save"})
    }
    else{
        let dest = path.resolve(req.file.destination,'resized')
        if(!fs.existsSync(dest)){
            fs.mkdirSync(dest ,{
                recursive : true
            })
        }
        const { filename: image } = req.file;
        console.log(req.file.destination)
        await sharp(req.file.path)
                .resize(100, 100)
                .jpeg({ quality: 90 })
                .toFile(
                    path.resolve(req.file.destination,'resized',image)
                )
        res.status(201).json({message : "Avatar added successfully on disk space"})
    }
    })



})

router.post('/deleteUserAvater', router_external_protection, (req,res)=>{
    let userKey = obtainPublicKey(req)
    let deleting_file = path.join(process.cwd() + `/server/accounts/${userKey}/avatar/${userKey}-avatar.jpg`)

    try {
        if(fs.existsSync(deleting_file)){
            fs.unlinkSync(deleting_file)
            res.json({success : "Avatar removed successfully"})
        }
        else {
            res.json({error : "Avatar don't exists"})
        }
        
      } catch(error) {
        console.error(error)
      }

})

router.post('/update', router_external_protection , (req,res)=>{
    let userKey = obtainPublicKey(req)
    let {userName,institutionArray,firstName,lastName,location,dob} = req.body
    AccountsCollection.findOne({'identifier.publicKey' : userKey},(error,user)=>{
            user.userName  = isNotFaulty(userName) && userName
            user.firstName  = isNotFaulty(firstName) && firstName
            user.lastName  = isNotFaulty(lastName) && lastName
            user.otherDetails.city  = isNotFaulty(location) && location
            user.dob  = isNotFaulty(dob) && dob
            user.otherDetails.studyInstitutes  = isNotFaulty(institutionArray) && institutionArray

            user.save()
            console.log(user)
    })
    res.json({message : "Profile Information is updated."})
})

module.exports ={
    router: router,
    gfs : gfs
}

