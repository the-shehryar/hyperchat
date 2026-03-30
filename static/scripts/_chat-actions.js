import {isNotFaulty} from './_support'
import {generateFriendTile} from './_friend-model-tile'
const chatModelContainer = document.querySelector('#new-chat-model-container')
const chatModel = document.querySelector('#new-chat-model-container .new-chat-model')
const listHolder = document.querySelector('.new-chat-model #model-friend-list')
const closeModelButton = document.querySelector('#new-chat-model-container  #close-chat-model-button')
const createChatButtons = Array.from(document.querySelectorAll('.new-chat-button'))

const baseURL = 'http://localhost:5000'

export const initializeNewChatModel = ()=>{
    
    if(isNotFaulty(chatModelContainer) && isNotFaulty(createChatButtons)){    

        createChatButtons.forEach(button =>{
            button.addEventListener('click',(e)=>{
                chatModelContainer.style.backgroundColor = '#413f3f3b'
                chatModelContainer.style.pointerEvents = 'all'
                chatModel.classList.add('show-chat-model')

                fetch(`${baseURL}/actions/getFriends`)
                    .then(res => res.json())                
                    .then(({friends}) => {
                        friends.forEach(friend => { generateFriendTile(friend) })
                    })                
            })
        })
        
        closeModelButton.addEventListener('click', ()=>{

            chatModelContainer.style.backgroundColor = 'transparent'
            chatModel.classList.remove('show-chat-model')
            chatModelContainer.style.pointerEvents = 'none'
            listHolder.innerHTML = ''
            
        })
    }
}

export const fetchTargetData = ()=>{
    return new Promise((resolve ,reject)=> {
        let target = localStorage.getItem('current-target')

        fetch(`http://localhost:5000/users/data?u=${target}`)
        .then(res => {
            return res.json()
        })
        .then(user_object => {
            
            let namePlaceHolder = document.querySelector('.chat-room-header .name-block .profile-overview .profile-name-value-container')
            let statePlaceHolder = document.querySelector('.chat-room-header .name-block .profile-overview .profile-current-status-indicator')
            let imagePlaceHolder = document.querySelector('.chat-room-header .name-block .profile-header-circle img')

            imagePlaceHolder.setAttribute('src', `http://localhost:5000/users/public/media?upk=${user_object.publicKey}&type=icon`)
            namePlaceHolder.innerHTML = `@${user_object.name}`
            resolve(localStorage.setItem('target-details', JSON.stringify(user_object)))

        })
    }) 
}