require('dotenv').config()
const process = require('process')

let {
    ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY
} = process.env

const express = require('express')

const router = express.Router()
const AccountsCollection = require('../models/account')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {router_external_protection , router_internal_protection} = require("../controllers/jwtAuth")
const {issueErrorAlert} = require("../controllers/error_alert")
const {check, validationResult} = require('express-validator')



router.get('/',  router_internal_protection, (req,res) => {
    res.sendFile(process.cwd() + '/static/login.html')
})

router.post('/' , router_internal_protection, [
    check('username' , 'Username must be 4 to 12 characters in length')
    .exists()
    .isLength({min : 4, max : 12}),

    check('password' , 'Password must be 4 to 12 characters in length')
    .exists()
    .isLength({min : 4, max : 12})
], async (req,res)=>{

    let formValidation = validationResult(req)
    if(formValidation.errors.length >= 1){
        console.log(formValidation.errors)
    }
    const userSearch = await AccountsCollection.findOne({userName : req.body.username}, (error,user) => {
        
        if(user){
            
            const matchPassword = bcrypt.compare(req.body.password, user.password, (err,data) => {
                if(data){
                    user.isActive = true
                    user.save()
                    // If password Matches Then Generate Token
                    // JWT Generation
                    
                    const token = jwt.sign(
                        {
                            name : user.userName,
                            identifier : user.identifier.publicKey
                        },
                        ACCESS_TOKEN_KEY,
                        {
                            expiresIn : "40m"
                        }
                        )
                        const refreshToken = jwt.sign(
                            {
                                name : user.userName,
                                identifier : user.identifier.publicKey
                            },
                            REFRESH_TOKEN_KEY,
                            {
                                expiresIn : "1d"
                            }
                            
                    )
                    let userInfo = {
                        firstName : user.firstName,
                        lastName : user.lastName,
                        publicKey : user.identifier.publicKey,
                        userName : user.userName,
                        otherDetails : user.otherDetails
                    }  
                    res.cookie('jwt', token, { httpOnly: true, maxAge: '600000' })
                    res.cookie('refreshjwt', refreshToken, { httpOnly: true, maxAge: '2000000' })
                    res.status(200).json({userInfo, redirectionEndPoint : '/profile'})
                    }
                    else if(!data){
                        issueErrorAlert(res,404,"Incorrect password","password")
                    }
                    else{
                        res.json({success : false})
                    }
                    
                })
                
            
        }
        else {
            issueErrorAlert(res,404,"User does not exists", "username")
        }
    })

    
})


module.exports = router