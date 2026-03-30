const mongoose = require('mongoose')
const AccountsSchema = new mongoose.Schema({
    identifier : {
        publicKey : {type : String, required : true, default : "No Value Passed Bitch" },
        privateKey : {type : String, required : false, default : "No Value Passed Bitch" }
    },
    userName : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    firstName : {type : String, required : true},
    lastName: { type: String, required: true },
    email : {type : String , required : true},
    otherDetails: {
        city : {type: String, default : ""},
        studyInstitutes : [{type : String}],
        dob : {type  : String, default : ""}
    },
    confirmed : {type : Boolean, required : true, default : false },
    lastSeen : {type : String , default : "xxx"},
    isActive: { type: Boolean, default : false},
    preferences : {
        securityType  : {type : String, required : true , default : 'public'}
    },
    notifications : [{
        initiator : {type : String , required : true},
        initiatorName  : {type: String, required : true},
        receiver : {type : String, required : true},
        requestedAction : {type : String, required : true},
        message : {type : String, required : true}
    }],
    requests : [{
        initiator : {type : String , required : true},
        initiatorName  : {type: String, required : true},
        receiver : {type : String, required : true},
        requestedAction : {type : String, required : true}
    }],
    chatables : [{type : mongoose.Schema.Types.Object}],
    followers : [{type : mongoose.Schema.Types.String}],
    following : [{type : mongoose.Schema.Types.String}]
})

module.exports = mongoose.model("accounts", AccountsSchema)