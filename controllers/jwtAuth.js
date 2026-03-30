const jwt = require('jsonwebtoken')
const process = require('process')

const {ACCESS_TOKEN_KEY} = process.env

module.exports.router_external_protection = (request, response, next) => {
    
    const token = request.cookies.jwt
    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_KEY, { complete: true }, (err, decodedToken) => {

            if (err) {
                console.log(err.message);
                response.redirect('/login')
            }
            else {
                next()
            }
        })
    }
    else {
        response.redirect('/login')
    }
}

module.exports.router_internal_protection = (request, response, next) => {
    const token = request.cookies.jwt
    if (!token) {
        next()
    }
    else {
        response.redirect('/chats')
    }

}

module.exports.verifyRequestingUser = (request) => {
    const token = request.cookies.jwt
    if (token) {
        jwt.verify(token, ACCESS_TOKEN_KEY,(error,decodedToken)=> {
            if(!error){
                return true
            }
            else {
                return false
            }
        })
    }
    else {
        console.log('Token is invalid or Not Available')
        return null
    }

}
module.exports.obtainPublicKey = (request) => {
    let identifier
    const token = request.cookies.jwt
    if (token) {
        jwt.verify(token, ACCESS_TOKEN_KEY,(error,decodedToken)=> {
            if(!error){
                identifier =  decodedToken.identifier
            }
            else {
                console.log('Token is invalid or Not Available')
                identifier =  null
            }
        })
    }
    else {
        identifier = null
    }

    return identifier
}
module.exports.obtainKeyFromCookie = (token) => {
    
    let identifier ;
    if (token) {
        jwt.verify(token, ACCESS_TOKEN_KEY,(error,decodedToken)=> {
            if(!error){
                identifier = decodedToken.identifier
            }
            else {
                console.log('Token is invalid or Not Available')
                identifier = null
            }
        })
    }
    else {
        identifier = null
    }
    return identifier

}

