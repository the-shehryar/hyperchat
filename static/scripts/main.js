// Existence Check
import DOMPurify from '/node_modules/dompurify/dist/purify.es.js'

import {isNotFaulty, reverseInputAnimation,runInputAnimation} from './_support'
import {initializeRippleEffect} from './_ripples'
import Cropper from '/node_modules/cropperjs/dist/cropper'
import {initializeAvatarUpload} from './_avatar-upload'
import {loadSuggestionList} from './_feed-holder'
import {runSideExplorer} from './_side-explorer'
import {initializeNewChatModel, fetchTargetData} from './_chat-actions'
import { enableProfileEditing, loadUserDetails } from './_profileUpdate'
import {insertConversationTile,retriveChatTiles, userConversationsList} from './_conversation-tiles'
import {showClientMessage, showOpponentMessage} from './_message-ui'
import MouseParallax from './_mouse-parallax'
import './_recovery'
import  './_login'
// import LocomotiveScroll from '/node_modules/locomotive-scroll/dist/locomotive-scroll.esm.js'

import { clearSockets, createSocket, messageHandler,  profileBarClose,  profileBarOpen,  setupUserView,  } from './_room'
import './_attachment-menu'


const PortNumber = 5000
const signupForm = document.querySelector(".formcontainer .signupform")
const loginForm = document.querySelector(".formcontainer .loginform")
const feedHolder = document.querySelector("#feed-holder")



const logoutBtn = document.querySelector('.profiledata-content-wrapper .action-block .userexit-btn ')
const editProfileBtn = document.querySelector('.expansion-container .profiledata-content-wrapper .action-block .editor-btn')


const coverInput = document.getElementById('cover-upload')
const uploadOptionBtn = document.querySelector('.cover-photo .edit-image .upload-btn')





const chatUI = document.querySelector('.chat-ui-wrapper .chat .chat-room')


// Initializing WEBSOCKET


// Identifying The Icons
let expanding_icons_list = [];
const dashboard_icons_list = Array.from(document.querySelectorAll('.action-icons a'));
let expansion_container = document.querySelector('.expansion-container');
let expansion = false;
let open_route = ''



// Refinary Function For Detecting Falsy Values



        
        function render_stored_data(selector) {
            let drawer_content_wrapper = document.createElement('div')
            let dp_wrapper = document.createElement('div')
            
            
            dp_wrapper.classList.add('profile-picture-wrapper')
            // drawer_content_wrapper.classList.add(`${selector}-content-wrapper`)
            
            
            // drawer_content_wrapper.appendChild(dp_wrapper)
            
            return drawer_content_wrapper
        }
        
        function open_drawer(selector, parent) {
            if (typeof selector === 'string') {
                expanding_icons_list.forEach(item => {
                    let search_param = item.getAttribute('data-route')
                    if (search_param === selector) {
                        let target = document.querySelector(`.${selector}-content-wrapper`)
                        target.style.opacity = '1' 
                        target.style.display = 'block'
                        expansion = true
                        expansion_container.style.transform = 'translateX(0%)'
                    }
                    else {
                        let single_item = document.querySelector(`.${search_param}-content-wrapper`)
                        single_item.style.display = "none"
                    }
                })
            }
        }
        function close_drawer(selector) {
            expansion = false
            if (selector) {
                let target = document.querySelector(`.${selector}-content-wrapper`)
                target.style.opacity = '0' 
            }
            expansion_container.style.transform = 'translateX(-100%)'
        }
        
      
    
    
    
    
    
// Bringing Latest Message Into View And Focusing Input

   
// Friends List Tiles Entry

// Client's Own Message Struture


// Function To Handle User Previous Messages 
// To Make Sure The Rendering Of Messages Whether Are Related To Client Or Opponent








    if(isNotFaulty(uploadOptionBtn) && isNotFaulty(coverInput)){
        uploadOptionBtn.addEventListener('click' , () => {
            coverInput.click()
        })
    }

    // On Every Document Loading

    window.addEventListener('load', async () => {

        

        let ultimateWrapper = document.querySelector('#ultimate-wrapper')
        if(isNotFaulty(ultimateWrapper)){
            console.log('locomotive should run')
            const scroll = new LocomotiveScroll({
                el : element,
                smooth : true,
                multiplier : .8,
                // direction : 'horizontal',
                touchMultiplier : 1.8,
                firefoxMultiplier : 40,
                initPosition : {
                    x :100,
                    y : 0
                }
            });
            console.log('locomotive initialzed')
        }

        // console.log(document.querySelectorAll('div').children);

        let refetchMessages = localStorage. getItem('refetch-messages')
        let sessionPersistanceCheck = localStorage.getItem('sessional-messages')
        

        if(isNotFaulty(sessionPersistanceCheck)){
            console.log(`This is the session Persistance ${sessionPersistanceCheck}`)
            let parsedSession = JSON.parse(sessionPersistanceCheck)

            if(isNotFaulty(parsedSession) && parsedSession.length > 0){

                let reRenderables = []
                
                let reRenderingTiles = parsedSession.map(item => {
                    if(item.messages.length > 0){
                        reRenderables.push(item)
                    }else {
                        // remove tile
                        let currentTiles = Array.from(document.querySelectorAll('.conversations-list .conversation-tile'))
                        currentTiles.forEach((tile,index,array)=>{
                            if(tile.getAttribute('userkey') === item.getAttribute('userkey')){
                                array[index].remove()
                            }
                        })
                    }
                })
                console.log(reRenderables)
                if(reRenderables === null || reRenderables === undefined){
                    reRenderables = []
                }
            
                if(isNotFaulty(reRenderables) && reRenderables.length < 1){
                    localStorage.setItem('sessional-messages', JSON.stringify([]))

                }else {
                    localStorage.setItem('sessional-messages', JSON.stringify(reRenderables))
                    
                    let persisatantChatKeys = reRenderables.map(item =>{
                        return item.key
                    })
                    refetchMessages = true
                    localStorage.setItem('refetchMessages', true)
                }
            }


        }else {
            console.log('since session is empty')
        }


        if(isNotFaulty(refetchMessages)){
            console.log()
            
            fetch(`http://localhost:5000/chats/connectedAccounts?rpk=${JSON.parse(localStorage.getItem('up-details')).publicKey}`)
            .then(res => {return res.json()})
            .then(async(first_load) => {
                localStorage.setItem('connected_accounts', JSON.stringify(first_load))
            })
            retriveChatTiles()
            localStorage.setItem('refetch-messages', false)
        }
        else {
            // check for empty tiles using sessional messages
            let tiles = Array.from(document.querySelectorAll('.conversation-tile'))
        }
        let confettisection = document.querySelector('.confettisection')
        
        //^ Signup and Login Page Parallax Effect

        if(isNotFaulty(confettisection)){
            document.addEventListener('mousemove', MouseParallax)
        }

        const chat = document.querySelector('.chat')

        if(isNotFaulty(chat)){
            setupUserView()
            
            fetch(`http://localhost:5000/chats/connectedAccounts?rpk=${JSON.parse(localStorage.getItem('up-details')).publicKey}`)
            .then(res => {return res.json()})
            .then(async(first_load) => {
                localStorage.setItem('connected_accounts', JSON.stringify(first_load))
            })
            .finally(()=> {
                retriveChatTiles()
                // location.reload()
            })
        }
        localStorage.setItem('currentSessionalActivities', JSON.stringify({
            unfollowed : [],
            followed : [],
            blocked : [],
            unblocked : [],
        }))
        runSideExplorer()
        initializeRippleEffect()
        initializeAvatarUpload()
        initializeNewChatModel()
        



        if(isNotFaulty(feedHolder)){
            loadSuggestionList()
        }

        //? To Clear All Previous Websocket Connections
        clearSockets()
        
        let logiinId = document.querySelector('#loginForm')
        let signupId = document.querySelector('#signupForm')
        let chatSplash = document.getElementById('chat-splash-section')
        let profileBar = document.querySelector('.chat-room-header .name-block')

        if(profileBar){
            let activeProfileBar = false 
            profileBar.addEventListener('click', () => {
                if(!activeProfileBar){
                    profileBarOpen()
                    activeProfileBar = true
                }else {
                    profileBarClose()
                    activeProfileBar = false
                }
            })
        }
        
        //? If user is in a chat room with a target

        if(window.location.search !== ''){
        //^ Getting Current Target
            let target = JSON.parse(localStorage.getItem('target-details'))
        //^ Getting the client
            let client = JSON.parse(localStorage.getItem('up-details'))
        //^ Changing the chat area
            chatSplash.style.display = 'none'
        //^ Fetching data revelant to target 
            fetchTargetData()
        //^ How many messages have been fetched
            let messageFetchingCursor;
        //^ First load of data which include portion of all previous chat
            let firstFetch
        //^ parsed form of first load
            let bearer;
            
            if(localStorage.getItem('connected_accounts') !== 'undefined'){
                bearer = JSON.parse(localStorage.getItem('connected_accounts'))
            }else {
                bearer = null
            }
        

            if(isNotFaulty(bearer)){
                firstFetch = bearer.first_load
            }
            //^ Process of rendering the messages of current user


            if(isNotFaulty(firstFetch)){
                
                for ( let user in firstFetch) {
                    let potentialKey = firstFetch[user].metadata.publicKey

                    if(potentialKey === target.publicKey){

                        let renderedMessagesLength = firstFetch[user].messages.length
                        messageFetchingCursor = renderedMessagesLength;
    
                        let availableMessages = firstFetch[user].messages
    
                        for(let index=0; index < availableMessages.length; index++){
            
                            let messageItem = availableMessages[index]
                            messageHandler(client.publicKey, target.publicKey, messageItem)
                        }
                        

    
                        if((availableMessages.length - 1) < 15) {

                            fetchPrivateConversations(messageFetchingCursor)
                        }
                        firstFetch = null
                    }
                    else {
                        messageFetchingCursor = 0;
                    }
                }
            }


    //^ Already rendered tiles 

            let preRenderedTiles = Array.from(document.querySelectorAll('.conversation-tile'));

    //^ List of new tiles to be rendered 

            let renderList = []

    //^ Mapping through already available tiles 
    
            let renderNewTile = false;
    
            preRenderedTiles.map((tile, index, array) => {
            //? By default the tile is consider as a new render 

            //^ It checks if any of the  already renders tiles is related to current target 

            //^ if yes then

                if (tile.getAttribute('userkey') == target.publicKey){
                    renderNewTile = false;
                }

            //^ if no then
                
                else {
                
                //^ Then you need to check, to whom it relates 
                    let arrayOfConnectedAcc;
                    
                    if(localStorage.getItem('connected_accounts') !== 'undefined'){
                        arrayOfConnectedAcc = JSON.parse(localStorage.getItem('connected_accounts'))
                        
                        
                    }else {
                        arrayOfConnectedAcc = null
                    }
                    

                    let firstFetched = arrayOfConnectedAcc.first_load

                //^ Deciding the tile to be rendered 

                    for(let key in firstFetched){
                        
                        if(firstFetch[key] === tile.getAttribute('userkey')){
                            renderList.push(firstFetch[key])
                        }
                    }

                //^ Session tracking 

                    // try{

                    //     // let sessionTrack = async ()=>{

                    //     //     if(localStorage.getItem('sessional-messages') !== 'undefined' && localStorage.getItem('sessional-messages') !== undefined){
                    //     //         return JSON.parse(localStorage.getItem('sessional-messages'))
                    //     //     }else {
                    //     //         return null
                    //     //     }
    
                    //     // }
                    //     // console.log(`logged ${sessionTrack}`)
                    //     // if(isNotFaulty(sessionTrack)){
                    //     //     sessionTrack.map(item => {
                    //     //         if(item.messages.length > 0){
                    //     //             console.log(item.key)
                    //     //         }
                    //     //     })
                    //     // }

                    // }catch(error) {
                    //     console.log('wasnot parsed')
                    //     console.log(error)
                    // }


                }
                
            })
            if(renderNewTile) {

                insertConversationTile({
                    metadata : {
                        name : target.name,
                        publicKey : target.publicKey
                    },
                    messages : [{
                        content : ""
                    }]
                })
                
                let sessionalMessagesRecord = localStorage.getItem('sessional-messages')

                if(sessionalMessagesRecord !== 'undefined'){
                    let record = JSON.parse(sessionalMessagesRecord)
                    record = [...record, {
                        name : target.name,
                        key : target.publicKey,
                        messages : []
                    }]
                    localStorage.setItem('sessional-messages', JSON.stringify(record))

                }else{
                    localStorage.setItem('sessional-messages', JSON.stringify([{
                        name : target.name,
                        key : target.publicKey,
                        messages : []
                    }]))
                }
                renderNewTile = false
            }
            console.log(preRenderedTiles)
            console.log(renderList)


            createSocket()
            retriveChatTiles()
            
    }


        if(isNotFaulty(document.querySelector('.profile-editor'))){
            enableProfileEditing()
        }

        // loadUserDetails()
        let fieldContainers = document.querySelectorAll('.field-container')
        let fieldsArray = []
        



        if(isNotFaulty(fieldContainers)){
            for(let i = 0; i < fieldContainers.length; i++){
                fieldsArray.push(fieldContainers[i])
            }
        }
        
        fieldsArray.forEach(item => {
            
            let fieldChilds = item.children
            let isChildernAvailable = isNotFaulty(fieldChilds)
            
            if(isChildernAvailable){
                
                let targetLabel = fieldChilds[0]
                let targetInput = fieldChilds[1]
                window.addEventListener('unload',()=>{
                    reverseInputAnimation(targetLabel)
                })
                // reverseInputAnimation(targetLabel)
                targetInput.addEventListener('click' , ()=>{
                    runInputAnimation(targetLabel)
                })
                
                targetInput.addEventListener('focusin' , ()=>{
                    runInputAnimation(targetLabel)
                })
                // targetInput.addEventListener('change', ()=>{
                //     runInputAnimation(targetLabel)
                // })
                targetInput.addEventListener('focusout' , (e)=>{
                    if(e.target.value.length <= 0){
                        reverseInputAnimation(targetLabel)
                    }
                })
            }
            
            
        })
        
        
        
        function fetchPrivateConversations (cursor) {

            if (isNotFaulty(chat) && isNotFaulty(localStorage.getItem('up-details'))) {
                let headerNameSpace =  document.querySelector('.chat-room-header .profile-redirection-button .profile-overview .profile-name-value-container')
                headerNameSpace.innerHTML = localStorage.getItem('targetName')
                const userPublicKey = JSON.parse(localStorage.getItem('up-details')).publicKey
                const targetUserPublicKey = localStorage.getItem('current-target')
                
                
                createSocket()
                //? On Demand OR Scroll Message Fetching
                chatUI.addEventListener('scroll' , (event) => {
                    if(chatUI.scrollTop == 0){
                        fetch(`http://localhost:${PortNumber}/privateConversation/?userPublicKey=${userPublicKey}&targetUserPublicKey=${targetUserPublicKey}&nfmr=${cursor}` , 
                        { method : "GET" }
                        ).then(res => {  return res.json();})
                        .then(data => {
                            if(data.error){
                                console.log(data.error);
                            }
                            else {
                                console.log(data[0].serverSentMessageCount);
                                cursor = data[0].serverSentMessageCount
                                for (let index = 0; index <= data[0].messages.length - 1 ; index++) {
                                    const message = data[0].messages[index]
        
                                    messageHandler(data[0].userPublicKey, data[0].targetUserPublicKey, message, 'prepend')
                                }
                                
                            }
                        })
                    }
                })
            }
        }


        //! Loading Service Worker
        
                
        //! This data needs to be cached for later user as well
        
    })
    
    
    const target_profile = document.querySelector('.custom-profile-data')
    const target_dp = document.querySelector('.custom-profile-data .dp-container img')
    const display_name = document.querySelector('.general-info .info-header-tile .focus-bar .display-name')
    const user_name = document.querySelector('.general-info .info-header-tile .focus-bar .username-container')
    const message_launcher = document.querySelector(".custom-profile-data .btn-dash .message-launcher")
    
    
     
    //? If it is the chat page then {Make it more secure}
    
    //! Remove 

    
    
    //? Target Profile Page then
        if(isNotFaulty(target_profile)){
        fetch(`http://localhost:${PortNumber}/users/data?u=${localStorage.getItem('targetUserPublicKey')}` , {
            method : "GET"
        })
        .then(async res => {
            return await res.json();
        })
        .then((data) => {
            console.log(data);
            let { error, publicKey, name, fname, lname, followers, following } = data;
            
            if (error) {
                console.log(error);
            }
            else if (!isNotFaulty(error)) {
                
                console.log('Working Hoe');
                localStorage.setItem('targetName', name)
                target_dp.src = `http://localhost:${PortNumber}/users/data/userDisplayImage/${localStorage.getItem('targetUserPublicKey')}`
                display_name.innerText = `${fname} ${lname}`
                user_name.innerText = `@${name}`
                if(isNotFaulty(message_launcher)){
                    message_launcher.addEventListener('click', ()=>{
                        window.location.href = `http://localhost:${PortNumber}/chats/${localStorage.getItem('targetUserPublicKey')}`
                    })
                    }
                }
                else {
                    console.log("No Response Made")
                }
            })
            }
        
        const timeline = document.querySelector('.feed-wrapper .timeline .sugesstion-list')
        
        if(isNotFaulty(timeline)){
            fetch(`http://localhost:${PortNumber}/getallusers` , {
                method : "GET",
                
            }).then((res) => {
                return res.json()
            })
            .then((data)=>{
                // console.log(data)
                data.users.forEach((item, index) => {
                    // console.log(item)
                    const card = document.createElement('div')
                    const userDp = document.createElement('div')
                    const cardTitle = document.createElement('div')
                    const dpCon = document.createElement('div')
                    const followBtn = document.createElement('div')
                    const user_image = document.createElement('img')
                    card.classList.add('card')
                    userDp.classList.add('user-dp')
                    dpCon.classList.add('dp-container')
                    cardTitle.classList.add('username')
                    followBtn.classList.add('follow-btn')
                    
                    card.appendChild(userDp)
                    userDp.appendChild(dpCon)
                    dpCon.appendChild(user_image)
                    card.appendChild(cardTitle)
                    card.appendChild(followBtn)
                    followBtn.innerHTML = 'Follow'
                    cardTitle.innerHTML = item.userName
                    timeline.appendChild(card)
                    
                    // fetch(`http://localhost:${PortNumber}/users/data/userDisplayImage/${item._id}`, {
                        //     method : "GET"
                        // }).then(res => {
                            //     console.log(res);
                            // })
                            
                            user_image.src = `http://localhost:${PortNumber}/users/data/userDisplayImage/${item.identifier.publicKey}`
                            userDp.addEventListener('click' , (e)=>{
                                localStorage.setItem('targetUserPublicKey', item.identifier.publicKey)
                                window.location.href = `http://localhost:${PortNumber}/users/?u=${item.identifier.publicKey}`
                            })
                            
                            followBtn.addEventListener('click' , (e)=>{
                                
                                fetch(`http://localhost:${PortNumber}/actions/?qan=follow&rpk=${window.localStorage.getItem('loggedUserPublicKey')}&tpk=${window.localStorage.getItem('targetUserPublicKey')}`, {
                                    method : "PUT"
                                })
                                .then((res)=>{
                                    return res.json()
                                })
                                .then(data => {
                                    console.log(data)
                                })
                                .catch(err => {console.log(err)})
                            })
                        })
                    })
                    
            }
            // })
            
            

if(isNotFaulty(signupForm)){
    let signupBtn = document.querySelector('#registeration')
    let listedInputs = Array.from(document.querySelectorAll('input'))
    let previewBtns = Array.from(document.querySelectorAll('.icon-space'))
    let isHidden = true

    previewBtns.forEach(btn => {
        btn.addEventListener('click',(e)=>{
            let directParent = Array.from(e.target.parentElement.children)
            let directChilds = Array.from(e.target.children[0].children)
            if(isHidden){
                directChilds[0].classList.remove('active-icon')
                directChilds[1].classList.add('active-icon')
                directParent[1].setAttribute('type', 'text')
                isHidden = false
            }
            else {
                directChilds[1].classList.remove('active-icon')
                directChilds[0].classList.add('active-icon')
                directParent[1].setAttribute('type', 'password')
                isHidden = true
            }

        })
    })

    listedInputs.forEach(item =>{ 
        item.addEventListener('focusin' , (e)=>{
            e.target.addEventListener('keyup' , (e)=>{
                if(e.keyCode === 13){
                    signupBtn.click()
                }
            })
        })
    })

    if(isNotFaulty(signupBtn)){
        let allow = true
        signupBtn.addEventListener('click' , (e) => {
    
            e.preventDefault()
            let username = document.querySelector('#username').value
            let firstname = document.querySelector("#firstname").value
            let lastname = document.querySelector("#lastname").value
            let email = document.querySelector('#email').value
            let password = document.querySelector("#password").value
            let confirmpassword = document.querySelector('#confirmpassword').value
            let dob = document.querySelector('#dob').value

            let errors = []
            // Perform Client Side Validation
            if(isNotFaulty(firstname) && isNotFaulty(lastname) && isNotFaulty(username) && isNotFaulty(email) && isNotFaulty(password) &&isNotFaulty(confirmpassword) && isNotFaulty(dob)){
                
                let db = dob.split('-')
                let dateObject = {
                    day : parseInt(Math.floor(db[0])),
                    month : parseInt(Math.floor(db[1])),
                    year : parseInt(Math.floor(db[2]))
                }
                let currentYear = new Date().getFullYear()
                let currentMonth = new Date().getMonth()
                
                
                //^ Processing Day of the Date
                if(dateObject.day !== NaN && dateObject.month !== NaN && dateObject.year !== NaN){
                    let evendaysArray = [1,3,5,7,8,10,12]
                    
                    let dayLimit;
                    
                    evendaysArray.map(number =>{   
                        if(number === dateObject.month){
                            dayLimit = 31
                        }
                    })

                    if(dayLimit === undefined){
                        if(dateObject.month === 2){
                            dayLimit = 28
                        }
                        else if(dateObject.month > 12){
                            dayLimit = 0
                        }
                        else {
                            dayLimit = 30
                        }
                    }

                    
                    if(db.length === 3 && dateObject.day <= dayLimit && dateObject.day > 0 && dateObject.month > 0 && dateObject.month <= 12 && dateObject.year > 1950 && dateObject.year <= 2200){
        
                        let yearGap = currentYear - dateObject.year
                        let monthGap = currentMonth - dateObject.month
                        
                        if(yearGap < 80 && yearGap > 14){

                            if(monthGap >= 0){
                                console.log('What is the Here22')
                                
                                if(email){ 
                                    let trimmed = email.split('@')

                                    if(trimmed.length > 1){

                                        let formdData = {

                                            firstname : firstname.trim(),
                                            lastname : lastname.trim(),
                                            username  : username.trim(),
                                            email : email.trim(),
                                            password : password.trim(),
                                            confirmpassword : confirmpassword.trim(),
                                            dob : dob.trim()

                                        }
                                        
                                        fetch(`http://localhost:${PortNumber}/signup`, {
                                            method : "POST",
                                            body : JSON.stringify(formdData),
                                            headers : {
                                                "Content-Type" : "application/json",
                                                "Accept" : "application/json"
                                            },
                                            // redirect : 'follow'
                                        })
                                        .then((res)=>{
                                            return res.json()
                                        })
                                        .then(({redirection,failedValidation})=>{
                                            if(failedValidation){
                                                let faultedValues = [] 
                                                
                                                
                                                failedValidation.forEach(input => {
                                                    let incomingObject = input
                                                    let faultyInput = document.getElementById(`${incomingObject.param}`)

                                                    
                                                    faultyInput.style.borderBottom = '2px solid red'

                                                    faultyInput.addEventListener('input', (e)=>{
                                                        e.target.style.borderBottom = '2px solid #14101066'
                                                    })

                                                    
                                                    if(incomingObject.param === 'email'){
                                                        faultedValues.push(`Please enter a valid email`)
                                                    }else if(incomingObject.param === 'password'){
                                                        faultedValues.push(`${incomingObject.param} is not matching`)
                                                        
                                                    }
                                                    else if(incomingObject.param === 'confirmpassword'){
                                                        // faultedValues.push(`${incomingObject.param} is not matching`)
                                                        
                                                    }else {
                                                        faultedValues.push(`${incomingObject.param} must contain more than 4 characters`)
                                                    }
                                                    
                                                })

                                                


                                                
                                                errors = faultedValues 

                                                if(errors.length > 0){
                                                    let errorBox =  document.querySelector('.error-box')
                                                    if(errorBox.children.length > 0){
                                                        errorBox.innerHTML = ''
                                                    }
                                                    errors.forEach(err => {
                                                        let errorDialog = document.createElement('div')
                                                        errorDialog.classList.add("error-dialog")
                                                        errorDialog.innerText = err
                                                        errorBox.appendChild(errorDialog);
                                                        
                                                    })
                                                    console.log(errors)
                                                }
                                            }
                                            else if (redirection){
                                                window.location.href = redirection
                                            }
                                        })
                                    }
                                
                                }
        
                            }
                            else if (yearGap === 14 && monthGap < 0) {
                                // Create Error
                                errors.push("You're too young to use this application.")
                                
                            }
                            else if (yearGap === 80 && monthGap > 0) {
                                // Create Error
                                errors.push("You're too elder to use this application.")
                            }
                        }
                        else {
                            errors.push('Your age is not acceptable for this application.')
                        }
                    }
                    else {
                        let leftYear = currentYear - dateObject.year
                        let errorMessage = ''
                        
                        if(dateObject.day > dayLimit || dateObject.day < 1){
                            errorMessage = errorMessage + `${dayLimit === 0 ? `Day limit doesn't exist; Write Number between 1 to 31` : `Day limit is between 1 and ${dayLimit}`} `
                            errors.push(errorMessage)
                        }
                        if(dateObject.month > 12 || dateObject.month < 1){
                            errorMessage = 'Month Must Exist Between 1 To 12 '
                            errors.push(errorMessage)
                        }
                        
                        
                        if(leftYear > 80){
                            errorMessage = 'Age Above 80 Is Not Accepted '
                            errors.push(errorMessage)
                        }
                        else if(leftYear < 14 && leftYear > 0){
                            errorMessage = "Age Below 14 Is Not Accepted "
                            errors.push(errorMessage)
                        }else if(dateObject.year > currentYear){
                            errorMessage = "Birth year does not exist"
                            errors.push(errorMessage)
                        }
                        if(email.split('@').length < 2 && email.split('@')[1] === ''){
                            errorMessage = "Email is invalid"
                            errors.push(errorMessage)
                        }

                        if(db.length < 3){
                            errors.push('Please Use The Valid Date Format: Use Number in this format dd-mm-yyyy ')
                        }
                        
                    }
                }else {
                    errors.push("Date of birth is invalid : Passed Values are not in numbers")
                }


                
            
                // fetch(`http://localhost:${PortNumber}/signup` , {
                //     method : "POST",
                //     body : JSON.stringify(formdData),
                //     headers : {
                //         "Content-Type" : "application/json",
                //         "Accept" : "application/json"
                //     },
                //     redirect : 'follow'
                // })
                // .then((res)=>{
                //     return res.json()
                // })
                // .then(({redirection,failedValidation}) => {
                //     if(redirection){
                //         window.location.href = redirection
                //     }
                //     else {
                //         let errormsg;
                //         if(failedValidation){
                //             let errorBox =  document.querySelector('.error-box')
                //             let errorDialog = document.createElement('div') 
                //             errormsg = 'Please properly fill the form.'
                //             errorDialog.classList.add("error-dialog")
                //             errorDialog.innerText = errormsg
                            
                //             if(errorBox.children.length > 0){
                //                 errorBox.innerHTML = ''
                //                 errorBox.appendChild(errorDialog);
                //             }
                //             else {
                //                 errorBox.appendChild(errorDialog);
                //             }

                //             failedValidation.map(item => {
                //                 let inputId = item.param
                //                 let targetInput = document.getElementById(inputId)
                //                 targetInput.style.borderBottom = '2px sold red'
                //                 targetInput.addEventListener('click',()=>{
                //                     targetInput.style.borderBottom = '2px solid #14101066'
                //                 })
                //             })
                //         }
                //     }
                // })
                
            }
            else {
                let errorBox =  document.querySelector('.error-box')
                    let errorDialog = document.createElement('div') 
                    errorDialog.classList.add("error-dialog")
                    errorDialog.innerText = 'Please Fill All Inputs'
                    
                    if(errorBox.children.length > 0){
                        errorBox.innerHTML = ''
                        errorBox.appendChild(errorDialog);
                    }
                    else {
                        errorBox.appendChild(errorDialog);
                    }
                
                let inputToCheck = Array.from(document.querySelectorAll('.text-input-md'))
                console.log(inputToCheck)
                let faultyInputs = inputToCheck.filter((item) => {
                    if(item.value.length < 1){
                        return item.id
                    }
                })
                faultyInputs.forEach(item => {
                    item.style.borderColor = 'red'
                    
                    item.addEventListener('focus', ()=>{
                        item.style.borderColor = '#14101066'
                        if(isNotFaulty(errorBox)){
                            errorBox.innerHTML = ''
                        }
                    })
                })

            }
            

            if(errors.length > 0){
                let errorBox =  document.querySelector('.error-box')
                if(errorBox.children.length > 0){
                    errorBox.innerHTML = ''
                }
                errors.forEach(err => {
                    let errorDialog = document.createElement('div')
                    errorDialog.classList.add("error-dialog")
                    errorDialog.innerText = err
                    errorBox.appendChild(errorDialog);
                    
                })
            }
        })
    }


}





if(isNotFaulty(logoutBtn)){
    logoutBtn.addEventListener('click' , (e) => {
        localStorage.removeItem('loggedUserPublicKey')
        localStorage.removeItem('loggedUserName')
        localStorage.clear()
        // fetch(`http://localhost:${PortNumber}/logout` , {
        //     method : "GET",
        //     redirect : 'follow',
        //     headers : {
        //         'Content-Type' : "application/json"
        //     }
        // }).then((res) => {
        //     if(res.status === 302){
        //         // window.location.href = res.redirectionEndPoint
        //     }
        //     else {
        //         res.json()
        //     }
        // })
        // .then((data) => {
        //     if(isNotFaulty(data)){
        //         console.log(data)
        //     }
        // })
        // .catch(err => {
        //     console.log(err)
        // })
    })
}

if (isNotFaulty(editProfileBtn)) {
    editProfileBtn.addEventListener('click', () => {
        window.location.href = `http://localhost:${PortNumber}/profile`
    })
    
}


// Buliding a live or realtime response stream

// let realTimeStream =  new EventSource('/livestream')
// realTimeStream.addEventListener('change', (e) => {
//     try {
//         console.log(e.data);
//     } catch (error) {
//         console.log(error);
//     }
// })
