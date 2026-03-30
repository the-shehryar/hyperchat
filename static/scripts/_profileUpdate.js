import {isNotFaulty, runInputAnimation} from './_support'
import DOMPurify from '/node_modules/dompurify/dist/purify.es.js'

export let loadUserDetails = ()=>{
    let userkey = localStorage.getItem('loggedUserPublicKey')
    let generalInfo = fetch(`http://localhost:5000/profile/info?userkey=${userkey}`)
    .then((data)=> {
        return data.json()
    })
    .then(res => {
        localStorage.setItem('up-details', JSON.stringify(res))
    })
}





export function enableProfileEditing(){
    
    setupUserProfile()


    let editProfileButton = document.querySelector('.edit-profile-btn')
    let infoModelWrapper = document.querySelector('.information-update-model')
    let infoModelContainer = document.querySelector('.information-update-model .info-column-container')
    let cancelButton = document.querySelector('.information-update-model .info-column-container .info-column-01 .column-first-header #model-cancel-btn')
    let institutionPopUpBtn = document.querySelector('.information-update-model .info-column-container .info-column-02 .column-action')
    let institutionWrapper = document.querySelector('.information-update-model .info-column-container .info-column-02 .institutes-wrapper')
    let popUp = document.querySelector('.institution-submission-model')
    let popUpInput = document.querySelector('.institution-submission-model .submission-popup .field-container input')
    let Ins_PopUpCancelBtn = document.querySelector('.institution-submission-model .submission-popup .close-bar .close-icon-holder')
    let Ins_PopUpAddBtn = document.querySelector('.institution-submission-model .submission-popup .institution-btn-holder .add-institution-btn')
    let instituteDeleteBtnArray = Array.from(document.querySelectorAll('.institutes-wrapper .institute-name .deletion-icon-holder'))

    let Pas_PopUpCancelBtn = document.querySelector('.password-update-model .password-update-popup .close-bar .close-icon-holder')
    let passwordPopUp = document.querySelector('.password-update-model')
    let Pas_PopUpConfirmBtn = document.querySelector('.password-update-model .password-update-popup .password-btn-holder .confirm-password-btn')
    let changePasswordBtn = document.querySelector('.toolbar-action-btns .edit-password-btn')
    let isModelOpen = false

    editProfileButton.addEventListener('click',()=>{
        if(!isModelOpen){
            console.log('Edit Profile Clicked')
            infoModelWrapper.style.opacity = '1'
            infoModelWrapper.style.pointerEvents = 'all'
            infoModelContainer.style.opacity = '1'
            infoModelContainer.style.transform = 'scale(1)'
            isModelOpen = true
        }
    })
    cancelButton.addEventListener('click',()=>{
        if(isModelOpen){
            infoModelWrapper.style.opacity = '0'
            infoModelWrapper.style.pointerEvents = 'none'
            infoModelContainer.style.transform = 'scale(0)'
            infoModelContainer.style.opacity = '0'
            // infoModel.style.display = 'none'  
            isModelOpen = false
        }
    })
    changePasswordBtn.addEventListener('click',()=>{
        passwordPopUp.classList.add('active-password-update-model')
    })
    Pas_PopUpCancelBtn.addEventListener('click',()=>{
        passwordPopUp.classList.remove('active-password-update-model')
        
    })
    // Pas_PopUpConfirmBtn.addEventListener('click',()=>{
    //     let currentPassword = document.querySelector('#current-password-input').value
    //     let newPassword = document.querySelector('#new-password-input').value
    //     let confirmPassword = document.querySelector('#confirm-password-input').value

    //     let passwordUpdate = {
    //         currentPassword : DOMPurify.sanitize(currentPassword),
    //         newPassword : DOMPurify.sanitize(newPassword),
    //         confirmPassword : DOMPurify.sanitize(confirmPassword)
    //     }
    //     fetch('http://localhost:5000/actions/update/password',{
    //         method : 'POST',
    //         body : JSON.stringify(passwordUpdate),
    //         headers : { 
    //             'Content-Type' : "application/json"
    //         },
    //     })
    //     .then(res => {return res.json()})
    //     .then(({success})=> {
    //         if(success){
    //             window.location.href = '/login'
    //         }
    //     })
    // })
    // institutionPopUpBtn.addEventListener('click',(e)=>{
        
    //     let submissionModel = document.querySelector('.institution-submission-model')
    //     submissionModel.classList.add('active-submission-model')
    // })
    // Ins_PopUpCancelBtn.addEventListener('click',()=>{
    //     popUp.classList.remove('active-submission-model')
    //     popUpInput.value = ''
    // })
    // Ins_PopUpAddBtn.addEventListener('click',()=>{
        
    //     let institutionName = document.createElement('div')
    //     institutionName.classList.add('institute-name')
    //     institutionName.classList.add('nobars')

    //     institutionName.innerHTML = `<div class="text-holder nobars">
    //                                     ${popUpInput.value}
    //                                 </div>
    //                                 <div class="deletion-icon-holder">
    //                                     <img src="../assets/images/mini-images/delete-entry.svg" alt="" srcset="">
    //                                 </div>
    //                                         `

    //     if(isNotFaulty(popUpInput)){
    //         institutionWrapper.appendChild(institutionName)
    //         Ins_PopUpCancelBtn.click()
    //     }

    //     instituteDeleteBtnArray = Array.from(document.querySelectorAll('.institutes-wrapper .institute-name .deletion-icon-holder'))
    //         instituteDeleteBtnArray.forEach((btn,index) => {
    //             btn.removeEventListener('click',()=>{})
    //             btn.addEventListener('click',()=>{
    //                 let parentElement = Array.from(document.querySelector('.institutes-wrapper').children)
    //                 if(parentElement.length > 0){
    //                     console.log(index)
    //                     parentElement[index].remove()
    //                 }
    //             })
    //         })

    //     })
        
    //     instituteDeleteBtnArray.forEach((btn,index) => {
    //         btn.addEventListener('click',(event)=>{
    //             let parentElement = Array.from(document.querySelector('.institutes-wrapper').children)
    //             if(parentElement.length > 0){
    //             console.log(parentElement[index])
    //             if(index == 0){
    //                 parentElement[0].remove()
                    
    //             }
    //             else{
    //                 parentElement[index].remove()
    //             }
                
    //         }
    //     })
    // })
}



// let autocomplete
// const profileLocation = document.getElementById('profile-location')
// function initAutoComplete(){
//     autocomplete = new google.maps.places.Autocomplete(profileLocation, {
//         types : ['establishments'],
//         componentRestrictions  : {"country" : ['PK']},
//         fields : ['place_ids', 'geometry', 'name']
//     })
//     autocomplete.addListener('place_changed', () => {
//         let place = searchBox.getPlaces()[0]
//         if(place){
//             console.log(place)
//         } 
//     })
    
// }

// if(isNotFaulty(profileLocation)){
//     initAutoComplete()
// }








function setupUserProfile(){
    if(isNotFaulty(localStorage.getItem('up-details'))){
        let {userName, dob,firstName, lastName,otherDetails} = JSON.parse(localStorage.getItem('up-details'))

        //? Profile Info Holder
        let profileFullName = document.querySelector('.profile-info-holder #info-holder-col-1 #profile-fullName') 
        let profileUserName = document.querySelector('.profile-info-holder #info-holder-col-1 #profile-userName') 
        //? Profile Update Modal
        let username = document.getElementById('profile-username')
        let firstname = document.getElementById('profile-firstname')
        let lastname = document.getElementById('profile-lastname')
        let dobInForm = document.getElementById('profile-dob')
        let location = document.getElementById('profile-location')
        let updatingBtn = document.getElementById('save-changes-btn')
        
        //? Profile Info Holder  
        profileFullName.innerHTML = `${firstName} ${lastName}`
        profileUserName.innerHTML = `@${userName}`
        
        //? Profile Update Modal
        if(isNotFaulty(username)){
            username.value = userName
        }
        if(isNotFaulty(firstname)){
            firstname.value = firstName
        }
        if(isNotFaulty(lastname)){
            lastname.value = lastName
        }
        if(isNotFaulty(location)){
            location.value = otherDetails.city
        }
        if(isNotFaulty(dobInForm)){
            dobInForm.value = otherDetails.dob
        }

        // dobInForm.addEventListener('click',(e)=>{
        //     e.target.setAttribute('type', 'date')
        // })
        // dobInForm.addEventListener('focusin',(e)=>{
        //     e.target.setAttribute('type', 'date')
        // })
        // dobInForm.addEventListener('focusout',(e)=>{
        //     e.target.setAttribute('type', 'text')
        // })

        let informationFields = Array.from(document.querySelectorAll('.field-container'))
        informationFields.forEach(field => {
            let inlabel = field.children[0]
            let infield = field.children[1]

            if(infield.value.length > 0){
                runInputAnimation(inlabel)
            }
        })
        
        updatingBtn.addEventListener('click', ()=>{

            // let arrayWithID = ['profile-username', 'profile-firstname', 'profile-lastname', 'profile-dob', 'profile-location']
            let arrayOfInstituteName = Array.from(document.querySelectorAll('.institute-name'))
            let userDetailsObject = JSON.parse(localStorage.getItem('up-details'))
            let detailsKey = Object.keys(userDetailsObject)
            let lowerCaseKeys = []
            detailsKey.forEach( key => {
                key.toLowerCase()
            })

            let newDetails = {}
            let institutesArray = []
            informationFields.forEach(field => {
                let fieldInput = field.children[1]
                let detailKey = fieldInput.getAttribute('name')
                newDetails[detailKey] = fieldInput.value
            })
            if(isNotFaulty(arrayOfInstituteName)){
                arrayOfInstituteName.forEach(name => {
                    institutesArray.push(name)
                })
            }
            newDetails.institutionArray = institutesArray
            console.log('Fetch Request is running')
            fetch('http://localhost:5000/profile/update', {
                method : "POST",
                body : JSON.stringify(newDetails),
                headers : {
                    "Content-Type" : "application/json",
                    "Accept" : "application/json"
                },
            })
            .then((res) => {
                return res.json()
            })
            .then((data)=>{
                console.log(data)
                let cancelbtn = document.querySelector('.info-column-container .info-column-01 .column-first-header #model-cancel-btn')
                console.log(cancelbtn)
                cancelbtn.click()
                
            })
        })
        
    }
}

