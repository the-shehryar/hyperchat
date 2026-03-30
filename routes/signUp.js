const express = require('express')
const router = express.Router()
const AccountsCollection = require('../models/account')
const bcrypt = require('bcrypt')
const process = require('process')
const crypto = require('crypto')
let {router_external_protection , router_internal_protection} = require('../controllers/jwtAuth')
const {validationResult} = require('express-validator')
const {signUpFormValidation} = require('../controllers/validator')



router.get('/' , router_internal_protection , (req,res) => {
    res.sendFile(process.cwd() + '/static/signup.html')
})

router.post('/', router_internal_protection, signUpFormValidation, async (req,res)=>{
    
    let validation = validationResult(req)
    if(!validation.isEmpty()){
        res.json({failedValidation : validation.errors})
    }
    else {
        if(req.body.email){
            AccountsCollection.findOne({email : req.body.email}, async (err,emailExists)=>{
                if(emailExists){
                    res,json({failedValidation : [{msg : 'Email is already register, use different email.', param : "email"}]})
                }
                else {
                    if(req.body.password === req.body.confirmpassword){
                        const hashedPassword = await bcrypt.hash(req.body.password,10)
                        const publicKey = crypto.randomBytes(30).toString('hex')
                        const privateKey = crypto.randomBytes(40).toString('hex')
                        let userDOB = req.body.dob
                        const newSignupUser = new AccountsCollection(
                            {
                                identifier: { publicKey, privateKey },
                                firstName: req.body.firstname,
                                lastName: req.body.lastname,
                                userName: req.body.username,
                                email : req.body.email,
                                password : hashedPassword,
                                otherDetails : {
                                    dob : userDOB ? userDOB : ''
                                }
                            }
                        )
                        try {
                            await newSignupUser.save()
                            res.status(201).json({redirection : '/login'})
                        } catch (error) {
                            console.log(error)
                            res.status(400).json({successMessage : "Bad Request"})
                        }
                    }else {
                        console.log('Password is not matched')
                        res.status(400).json({failedValidation : [{msg : 'Passwords are not matching', param : "password"}]})
                    }
                }
            })
        }
        
    }

})

    


module.exports = router