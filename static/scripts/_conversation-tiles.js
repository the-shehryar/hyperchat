import { fetchTargetData } from './_chat-actions'
import {isNotFaulty} from './_support'
export const userConversationsList = document.querySelector('.chat-ui-wrapper .conversations-list')

export function insertConversationTile (chatObject){
    if(chatObject.messages.length > 0){
        const tile = document.createElement('div')
        tile.classList.add('conversation-tile')  
        tile.setAttribute('userKey', `${chatObject.metadata.publicKey}`)
        tile.innerHTML = `
        <div class="profile-circle">
            <img src='http://localhost:5000/users/public/media?upk=${chatObject.metadata.publicKey}&type=icon'></img>
        </div>
        <div class="information-block">
            <div class="name-placeholder">${chatObject.metadata.name}</div>
            <div class="last-message">${ isNotFaulty(chatObject.messages[chatObject.messages.length - 1].content) ? chatObject.messages[chatObject.messages.length - 1].content : '' }</div>
        </div>
        <div class="options-block">
        
        </div>
        `
        if(isNotFaulty(userConversationsList)){
            userConversationsList.appendChild(tile)
            
            tile.addEventListener('click', (e) => {
    
                localStorage.setItem('current-target', tile.getAttribute('userKey'))
                localStorage.setItem('current-socket', tile.getAttribute('userKey'))
                fetchTargetData()
                window.location.href = `http://localhost:5000/chats?user=${tile.getAttribute('userKey')}`
            })
        }
    

    }
}

export const retriveChatTiles= () => {
    console.log('renuilt the tile struvture')


    if(localStorage.getItem('connected_accounts')){
       let availableChats = JSON.parse(localStorage.getItem('connected_accounts')).first_load
       let target = JSON.parse(localStorage.getItem('target-details'))
       let preRenderedTiles = Array.from(document.querySelectorAll('.conversation-tile'));
       
       let renderNewTile = true;

       console.log(`${preRenderedTiles.length} are prerendered`)

       for (const item of Object.entries(availableChats)) {

        preRenderedTiles.map(tile => {                                                                     
            if(tile.getAttribute('userkey') == item[1].metadata.publicKey){
                renderNewTile = false;        
            }
            
        })
        
        



        if(renderNewTile){
            insertConversationTile(item[1])
        }
      }
    }

}


export const retriveSessionTiles = ()=>{
    
    if(localStorage.getItem('connected_accounts')){
        let availableChats = JSON.parse(localStorage.getItem('connected_accounts')).first_load
        let target = JSON.parse(localStorage.getItem('target-details'))
        let preRenderedTiles = Array.from(document.querySelectorAll('.conversation-tile'));
        
        let renderNewTile = true;
 
        console.log(`${preRenderedTiles.length} are prerendered`)
 
        for (const item of Object.entries(availableChats)) {
 
         preRenderedTiles.map(tile => {                                                                     
             if(tile.getAttribute('userkey') == item[1].metadata.publicKey){
                 renderNewTile = false;        
             }
             
         })
         
         
 
 
 
         if(renderNewTile){
             insertConversationTile(item[1])
         }
       }
     }
}