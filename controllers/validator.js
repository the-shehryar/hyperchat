let {check} = require('express-validator')
let AccountsCollection = require('../models/account')

let firstname = check('firstname', "First Name must contain 4 to 12 characters")
                .exists().trim().isLength({min : 4 , max : 12})

let lastname = check('lastname', "Last Name must contain 4 to 12 characters")
                .exists().trim().isLength({min : 4 , max : 12})

let username = check('username', "Username must contain 4 to 12 characters")
                .exists().trim().isLength({min : 4 , max : 12})

let password = check('password', "Password must contain 4 to 12 characters")
                .exists().trim().isLength({min : 4 , max : 12})

let confirmPassword = check('confirmpassword', "Password must contain 4 to 12 characters")
                .exists().trim().isLength({min : 4 , max : 12})
                
let email = check('email', "Please Enter A Valid Email")
                .exists().trim().isEmail().normalizeEmail()
                
    
module.exports = {
    signUpFormValidation : [firstname, lastname,username,email,password,confirmPassword]
} 