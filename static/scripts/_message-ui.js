const chatUI = document.querySelector('.chat-ui-wrapper .chat .chat-room')

    
// Client's Own Message Struture

export function showClientMessage (OUTGOING_MESSAGE,pastingDirection='append') {
    const userMessageWrapper = document.createElement('div')
    const userMessageBox = document.createElement('div')
    const userMessageName  = document.createElement('div')
    const messageData = document.createElement('div')
    const messageTimeStamp = document.createElement('div')
    
    userMessageWrapper.classList.add('user-message-wrapper')
    userMessageBox.classList.add('user-msg')
    messageData.classList.add('-msgdata')
    // userMessageName.classList.add('-username')
    messageTimeStamp.classList.add('-time')

    if(pastingDirection === 'append'){
        chatUI.appendChild(userMessageWrapper)
        console.log(userMessageWrapper)
        userMessageWrapper.classList.add('animate-user-message')
    }else {
        chatUI.prepend(userMessageWrapper)
    }
    
    if(OUTGOING_MESSAGE.ATTACHMENT.TYPE === 'image'){
        userMessageWrapper.classList.add('image-message')
        userMessageWrapper.appendChild(userMessageBox)
        const imageHodler = document.createElement('div')
        const sentImage = document.createElement('img')
        imageHodler.classList.add('image-holder')
        sentImage.setAttribute('src', OUTGOING_MESSAGE.ATTACHMENT.CONTENT)
        
        userMessageBox.appendChild(imageHodler)
        imageHodler.appendChild(sentImage)
        if(OUTGOING_MESSAGE.DATA === ''){
            userMessageBox.appendChild(messageData)
            userMessageBox.appendChild(messageTimeStamp)
            // userMessageName.innerHTML = 'YOU'
            messageData.style.margin = '0px 0px'
            messageData.style.padding = '0px'
            messageData.innerHTML = ""
            messageTimeStamp.innerHTML = OUTGOING_MESSAGE.DATE_TIME.TIME
        }else {
            userMessageBox.appendChild(messageData)
            userMessageBox.appendChild(messageTimeStamp)
            // userMessageName.innerHTML = 'YOU'
            messageData.style.margin = '5px 0px'
            messageData.style.padding = '10px'
            messageData.innerHTML = OUTGOING_MESSAGE.DATA
            messageTimeStamp.innerHTML = OUTGOING_MESSAGE.DATE_TIME.TIME
        }
    }
    else {
        userMessageWrapper.appendChild(userMessageBox)
        userMessageBox.appendChild(messageData)
        userMessageBox.appendChild(messageTimeStamp)
        // userMessageName.innerHTML = 'YOU'
        messageData.innerHTML = OUTGOING_MESSAGE.DATA
        messageTimeStamp.innerHTML = OUTGOING_MESSAGE.DATE_TIME.TIME
    }


}

// Opponent's Message Struture

export function showOpponentMessage(INCOMING_MESSAGE,pastingDirection){
const userMessageWrapper = document.createElement('div')
const userMessageBox = document.createElement('div')
const userMessageName  = document.createElement('div')
const messageData = document.createElement('div')
const messageTimeStamp = document.createElement('div')


userMessageWrapper.classList.add('opponent-message-wrapper')
userMessageBox.classList.add('opponent-msg')
messageData.classList.add('-msgdata')
// userMessageName.classList.add('sender-username')
messageTimeStamp.classList.add('sending-time')
if(pastingDirection === 'append'){
    chatUI.appendChild(userMessageWrapper)
}else {
    chatUI.prepend(userMessageWrapper)
}
if(INCOMING_MESSAGE.ATTACHMENT.TYPE === 'image'){
    userMessageWrapper.classList.add('image-message')
    userMessageWrapper.appendChild(userMessageBox)
    const imageHodler = document.createElement('div')
    const sentImage = document.createElement('img')
    imageHodler.classList.add('image-holder')
    sentImage.setAttribute('src', INCOMING_MESSAGE.ATTACHMENT.CONTENT ||INCOMING_MESSAGE.binary_attachment )
    
    userMessageBox.appendChild(imageHodler)
    imageHodler.appendChild(sentImage)
    if(INCOMING_MESSAGE.DATA === ''){
        userMessageBox.appendChild(messageData)
        userMessageBox.appendChild(messageTimeStamp)
        // userMessageName.innerHTML = 'YOU'
        messageData.style.margin = '0px 0px'
        messageData.style.padding = '0px'
        messageData.innerHTML = ""
        messageTimeStamp.innerHTML = INCOMING_MESSAGE.DATE_TIME.TIME
    }else {
        userMessageBox.appendChild(messageData)
        userMessageBox.appendChild(messageTimeStamp)
        // userMessageName.innerHTML = 'YOU'
        messageData.style.margin = '5px 0px'
        messageData.style.padding = '10px'
        messageData.innerHTML = INCOMING_MESSAGE.DATA
        messageTimeStamp.innerHTML = INCOMING_MESSAGE.DATE_TIME.TIME
    }
}
else {
    userMessageWrapper.appendChild(userMessageBox)
    userMessageBox.appendChild(messageData)
    userMessageBox.appendChild(messageTimeStamp)
    // userMessageName.innerHTML = 'YOU'
    messageData.innerHTML = INCOMING_MESSAGE.DATA
    messageTimeStamp.innerHTML = INCOMING_MESSAGE.DATE_TIME.TIME
}

}
