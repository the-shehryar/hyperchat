import { fetchTargetData } from './_chat-actions'
import { insertConversationTile } from './_conversation-tiles'
import DOMPurify from '/node_modules/dompurify/dist/purify.es.js'


let PortNumber = 5000 
let model = document.querySelector('#model-friend-list')

export let generateFriendTile = ({username, publickey,url})=> {
    
    let imagesource = `http://localhost:${PortNumber}/users/public/media?upk=${publickey}&type=icon`
    let tileBody = document.createElement('div')
    let tileImageHolder = document.createElement('div') 
    let imageCircle = document.createElement('div')
    let image = document.createElement('img')
    let tileDetails = document.createElement('div')
    let userNameHolder = document.createElement('div')

    

    tileBody.classList.add('model-friend-tile')
    tileImageHolder.classList.add('friend-tile-image')
    imageCircle.classList.add('friend-tile-image-circle')
    tileDetails.classList.add('friend-tile-details')
    userNameHolder.classList.add('username-holder')

    tileBody.setAttribute('data-identifier', publickey)
    tileBody.setAttribute('socket-url', url)
    image.setAttribute('src', imagesource)
    userNameHolder.innerHTML = DOMPurify.sanitize(username)


    model.appendChild(tileBody)
    tileBody.appendChild(tileImageHolder)
    tileImageHolder.appendChild(imageCircle)
    imageCircle.appendChild(image)
    tileBody.appendChild(tileDetails)
    tileDetails.appendChild(userNameHolder)
    console.log('worked till here')
    tileBody.addEventListener('click', (e) => {
        localStorage.setItem('current-target', e.target.getAttribute('data-identifier'))
        localStorage.setItem('current-socket', e.target.getAttribute('socket-url'))
        fetchTargetData()
        window.location.href = `http://localhost:${PortNumber}/chats?user=${e.target.getAttribute('data-identifier')}`
        // chatSplash.style.display = 'none'
    })
}