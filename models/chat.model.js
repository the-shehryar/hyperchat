const mongoose = require('mongoose')
const Chat = mongoose.Schema({
    template : {
        users: { type: Array },
        global_settings: {
            
        },
        local_settings: {

        },
        messages : [{
            sending_user : String,
            receiving_user : String,
            content_received : Boolean,
            content_seen: Boolean,
            starred: { type: Boolean, default: false },
            attached_flags : [{type : String}],
            content: String,
            attachment: {
                file_name: { type: String },
                file_type : {type : String}
            },
            delivery_date : String,
            delivery_time: String,
            isDeleted: Boolean,
            self_deletion_by : [{type : String}],
            deleted_for : [{type : String}]
        }]
    }
})
module.exports = {
    PrivateChat: mongoose.model('private-chats', Chat),
    GroupChat : mongoose.model('group-chats', Chat)
}