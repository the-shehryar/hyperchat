const express = require("express")
const router = express.Router()
const app = express()
const process = require('process')
const fs = require('fs')
const {
    router_external_protection,
    router_internal_protection
} = require("../controllers/jwtAuth");

router.get('/', router_external_protection, (req, res) => {
    
    res.sendFile(process.cwd() + '/static/dashboard.html')
})


router.post('/', router_external_protection , (req,res) => {

})



module.exports = router