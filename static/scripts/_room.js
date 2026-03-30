import {showClientMessage, showOpponentMessage} from './_message-ui'
import {isNotFaulty,getDateAndTime,cookieFinder} from './_support'
import {renderFilesInPreviewModel} from './_attachment-menu'
import DOMPurify from '/node_modules/dompurify/dist/purify.es.js'




export let messageTransporter = {
    cursor : 0
}; 



let filechooser = document.getElementById("file-chooser")
export let previewableFilesArray = {
    previews : []
}
let socket;
const chatUI = document.querySelector('.chat-ui-wrapper .chat .chat-room')
let allowTransmission = false
export const sendMessageButton = document.getElementById("send-msg")
export const secondarySendButton = document.querySelector('.secondary-send-btn')
const writeMessageInput = document.getElementById('write-msg-input')


const chat = document.querySelector('.chat')

export function messageHandler(passedClientPublicKey, passedTargetUserPublicKey, passedMessage , direction='append'){
    
    const MessageToRender = {
        DATA : DOMPurify.sanitize(passedMessage.content),
        DATE_TIME : {
            DATE : passedMessage.delivery_date,
            TIME : passedMessage.delivery_time
        },
        ATTACHMENT : {
            TYPE : passedMessage.attachment_type ,
            CONTENT : passedMessage.attachment_url
        }
    }
    
    //? Checks for faulty values before processing
    
    if(isNotFaulty(passedClientPublicKey) && isNotFaulty(passedTargetUserPublicKey) && isNotFaulty(passedMessage)){
        
        
        if(passedClientPublicKey !== passedMessage.sending_user){
                MessageToRender.SENDER_NAME = "Unknown"
                showOpponentMessage(MessageToRender,direction)
        }
        else{
            showClientMessage(MessageToRender,direction)
        }
    }
    
}


export function createSocket() {


    //? This function fires when user initiate a chat.
    console.log(socket)
    if(socket === null || socket === undefined){
        let socketTarget = '';
        if ( isNotFaulty( localStorage.getItem('current-socket') ) ){
            socketTarget = localStorage.getItem('current-socket')
        }
        console.log(socketTarget)
        socket = new WebSocket(`ws://localhost:5000/?socketTarget=${socketTarget}`)
        socket.onopen = ()=>{
            console.log(socket)
        }

        //? When Target User Send Message to Client

        socket.onmessage = (socketIncomingMessage) => {
            let targetName;
            if ( isNotFaulty( localStorage.getItem('target-details') ) ){
                
            }
            //* As message on socket is in String TYPE and in function which is being called passed parameter is treated as JSON data 
            //* That is why parameter is Parsed Beforehand
            showOpponentMessage(JSON.parse(socketIncomingMessage.data),'append')
            setupUserView()
            updateRenderCount()
        }
        socket.onerror = (err) => {console.log(err)}
        socket.onclose = ()=>{socket =  null;}
        
    }
    else {
        return socket; 
    }
}

export function clearSockets (){
    if(socket){
        socket.onclose = socket.onerror = socket.onopen = null
        socket.close()
        // Create Socket Function Was Removed From Here
    }
}

function updateRenderCount(){
    let renderedMessages = Array.from(document.querySelector('.chat-room').children).length
    messageTransporter.cursor = renderedMessages
}


function sendMessageOverSocket (data){
    if (socket.readyState === 1) {
        socket.send(JSON.stringify(data))
        showClientMessage(data)
        updateRenderCount()
    }else{
        setTimeout(() => {
            sendMessageOverSocket(data)
        } , 2000)
    }
}

export function setupUserView (){
    writeMessageInput.focus()
    chatUI.scrollTop = chatUI.scrollHeight - chatUI.clientHeight 
}


if(isNotFaulty(sendMessageButton)) {
    writeMessageInput.addEventListener('input', (e) => {
        if (e.target.innerText.length > 0) {
            allowTransmission = true
        }
        else {
            allowTransmission = false
            console.log('Write something')
        }
    })
}


if (isNotFaulty(filechooser)) {
    filechooser.addEventListener('change', (e) => {
        
        //? Files selected by users

        let selectedFilesArray = Array.from(e.target.files)
        
        selectedFilesArray.filter(item => {
            if(item.type === 'image/jpeg' || item.type === 'image/jpg' || item.type === 'image/png'){
                let reader = new FileReader()
                reader.readAsDataURL(item)

                //? Once Image is ready, adding into previewList
                reader.onload = function () {
                renderFilesInPreviewModel(this.result)
                previewableFilesArray.previews.push(this.result)
            }
            }
        })
        //? Rendering Preview List

        
    })
}



function developMessage (){
    if (socket) {
        let message ={
            DATA : DOMPurify.sanitize(writeMessageInput.innerText),
            DATE_TIME : getDateAndTime(),
            SENDER_NAME: JSON.parse(localStorage.getItem("up-details")).userName,
            USER_KEY: JSON.parse(localStorage.getItem('up-details')).publicKey,
            TARGET_USER: localStorage.getItem('current-target'),
            ATTACHMENT : {
                TYPE : 'text',
                CONTENT : ''
            }
        }
        
            
        
        if (previewableFilesArray.previews.length > 0) {
            console.log(previewableFilesArray.previews)
            let messageInSlide = Array.from(document.querySelectorAll('.preview-model-body .swiper-wrapper .swiper-slide .additional-message-wrapper .additional-message-input'))
            previewableFilesArray.previews.forEach((image,index) => {

                console.log(messageInSlide[index].innerText)
                
                message = { 
                    DATA : DOMPurify.sanitize(messageInSlide[index].innerText),
                    DATE_TIME : getDateAndTime(),
                    SENDER_NAME: JSON.parse(localStorage.getItem("up-details")).userName,
                    USER_KEY: JSON.parse(localStorage.getItem('up-details')).publicKey,
                    TARGET_USER: localStorage.getItem('current-target'), 
                    ATTACHMENT: {
                        TYPE: "image",
                        CONTENT : image
                    }
                }
                
                // let refetchCheck = JSON.parse(localStorage.getItem('refetch-messages'))
                localStorage.setItem('refetch-messages',true)
                sendMessageOverSocket(message)
                writeMessageInput.innerText = ''
                setupUserView();
            })
            // console.log(message)
        }
        else {
            if(allowTransmission){
                localStorage.setItem('refetch-messages',true)
                
                
                sendMessageOverSocket(message)
                setupUserView();
                writeMessageInput.innerText = ''
            }
        }
            
        return message
    }
}



function registerMessage(message){
    let sessionalMessagesRecord;
    if(localStorage.getItem('sessional-messages') !== 'undefined' && localStorage.getItem('sessional-messages') !== undefined) {
        sessionalMessagesRecord = JSON.parse(localStorage.getItem('sessional-messages'))
    }else {
        sessionalMessagesRecord = null
    }

    if(isNotFaulty(sessionalMessagesRecord) && sessionalMessagesRecord.length > 0){

        let newSession;
        let updatedSession;
        sessionalMessagesRecord.map((messageInstance, index, reSavedArray) => {
            
            if(messageInstance.key === localStorage.getItem('current-target')){
                messageInstance.messages.push(message)
                updatedSession = sessionalMessagesRecord

            }else {
                
                updatedSession = [...sessionalMessagesRecord,  {
                    key : localStorage.getItem('current-target'),
                    messages : [message]
                }]

            }
        })
        localStorage.setItem('sessional-messages', updatedSession )

    }
    else {

        let sessionalMessagesRecord = [];

        let sessionMessage = {
            key : localStorage.getItem('current-target'),
            messages : [message]
        }
    
        sessionalMessagesRecord.push(sessionMessage)
        
        let newSession = sessionalMessagesRecord
                             
        localStorage.setItem('sessional-messages', JSON.stringify(newSession))

    }
    
}

    function updateLastMessage(message){
        let conversationList = document.querySelector('.chat-room-left-sidebar .conversations-list')
        let targetUserKey;
        
        
        if(isNotFaulty(conversationList)){
            
            if(isNotFaulty(message.DATA)){
                
                targetUserKey = message.TARGET_USER
                let tilesArray = Array.from(conversationList.children)
        
                tilesArray.forEach(tile => {
        
                    let key = tile.getAttribute('userKey')
                    
                    if(key === targetUserKey){
                        let lastMessage = tile.children[1].children[1]
                        lastMessage.innerText = message.DATA
                    }

                })

            }
        }
    }

    isNotFaulty(sendMessageButton) && sendMessageButton.addEventListener('click' , async (e) => {
        let msg = developMessage()
        registerMessage(msg)
        updateLastMessage(msg)
        
    })
    isNotFaulty(secondarySendButton) && secondarySendButton.addEventListener('click' , async (e) => {
        let msg = developMessage()
        registerMessage(msg)
    })



    if (!isNotFaulty(chat)) {
        if (socket && socket !== null) {
            socket.close()
        }
    }




    export function profileBarOpen (){
        let sidebar = document.querySelector('#targetSidebar')
        sidebar.style.transform = 'translateX(0px)'
    }   
    export function profileBarClose (){
        let sidebar = document.querySelector('#targetSidebar')
        sidebar.style.transform = 'translateX(400px)'
    }   







