import Cropper from '/node_modules/cropperjs/dist/cropper'
import {isNotFaulty} from './_support'
import DOMPurify from '../node_modules/dompurify/dist/purify';
const PortNumber = 5000
const profileURL = `http://localhost:${PortNumber}/profile`

// console.log(Compress)
export const initializeAvatarUpload = ()=>{
    const avatarUploader = document.querySelector('.avatar-holder .edit-button-holder .upload-avatar-btn')
    const avatarUploaderTrigger = document.querySelector('.avatar-holder .edit-button-holder .upload-avatar-btn #avatar-upload-input')
    const removeAvatar = document.querySelector('.delete-avatar-btn')
    let cropperIsOpen = false
    if(isNotFaulty(removeAvatar)){
        removeAvatar.addEventListener('click',(e)=>{
            console.log('Here I go')
            e.preventDefault()
            fetch(profileURL + '/deleteUserAvater', {
                method : 'POST'
            })
            .then(res => {
                if(res.status === 200){
                   let avatarImage = document.querySelector('.profile-editor .profile-data .avatar-container .avatar-holder .avatar-circle #user-avatar')
                   avatarImage.setAttribute('src', '')
                }
            })
            
            
        })
    }
    if(isNotFaulty(avatarUploader) && isNotFaulty(avatarUploaderTrigger)){
        avatarUploader.addEventListener('click' , () => {
            avatarUploaderTrigger.click()
        })


        if(!cropperIsOpen){
            avatarUploaderTrigger.addEventListener('change', (event)=>{
                cropperIsOpen = true;
                const choosedFiles = event.target.files
                if(choosedFiles && choosedFiles.length > 0){
                    // In case of Single file Option
                    let selectedAvatar = choosedFiles[0]
            
                    const avatarImageReader = new FileReader()
                    
                    const cropperModelHolder = document.querySelector('.cropper-model-holder')
                    cropperModelHolder.classList.add('cropper-model-show')
            
                    const avatarImageContainer = document.querySelector('.cropper-model-show .cropping-area img')
            
                    avatarImageReader.readAsDataURL(selectedAvatar)
            
                    avatarImageReader.onload = function(){
                        let croppedImage;
                        avatarImageContainer.setAttribute('src', this.result)
            
                        const cropperInstance = new Cropper(avatarImageContainer , {
                            aspectRatio : 1, viewMode : 3, guides : true, preview : '.cropper-model .side-area .preview',
                        })
            
                        const avatarUploadButton = document.querySelector('.cropper-model-action-box #avatar-upload-btn')
                        const abortUploadButton = document.querySelector('.cropper-model-action-box .abort-upload-btn')
                        
                        
                        
                        abortUploadButton.addEventListener('click' , ()=>{
                            cropperInstance.destroy()
                            selectedAvatar = null
                            cropperModelHolder.classList.remove('cropper-model-show')
                            avatarImageContainer.setAttribute('src', '')
                            cropperIsOpen = false
                        })
            
            
                        avatarUploadButton.addEventListener('click',(e) => {
                            cropperIsOpen = false
                            avatarUploadButton.value = 'Uploading...'
                            avatarUploadButton.disabled = true;
                            avatarUploadButton.style.background = 'gray'
                            // Declaring Crop Size
                            croppedImage = cropperInstance.getCroppedCanvas({
                                width : 400, height : 400
                            })
                            // Getting Cropped Image to show in a div
                            croppedImage.toBlob(croppedAvatar => {
                                const croppedAvatarReader = new FileReader()
                                croppedAvatarReader.readAsDataURL(croppedAvatar)
                                croppedAvatarReader.onload = () => {
                                    
                                    const avatarUploadStream = new FormData()
                                    avatarUploadStream.append('cropped-avatar-image' , croppedAvatar , selectedAvatar.name)
                                    
                                    const avatarUploadRequest = fetch(profileURL + '/uploadAvatar' , {
                                        method : "POST",
                                        body : avatarUploadStream
                                    })
                                    .then(res => {
                                        // Releasing Popup
                                        if(res.status === 201){
                                            cropperModelHolder.classList.remove("cropper-model-show")
                                            avatarUploadButton.disabled = false
                                            cropperInstance.destroy()
                                            avatarUploadButton.value = 'Crop & Upload'
                                            avatarUploadButton.style.background = '#7070ff'
                                        }
                                        
            
                                        const userAvatarImage = document.querySelector('.profile-editor .profile-data .avatar-container .avatar-holder .avatar-circle #user-avatar')
                                        
                                        if(isNotFaulty(userAvatarImage)) {
                                            
                                            fetch(profileURL + '/getUserAvatar' , {
                                                method : "GET"
                                            })
                                            .then(async (response) => {
                                                return await response.blob()        
                                            })
                                            .then((imageAsBlob) => {
                                                if(typeof (window.FileReader) !='undefined'){
                                                    const bolbReader = new FileReader()
                                                    bolbReader.readAsDataURL(imageAsBlob)
                                                    bolbReader.onload = (e) => { userAvatarImage.src = e.target.result }
                                                    
                                                }
                                                else{
                                                    const imageObjectURL = URL.createObjectURL(imageAsBlob)
                                                    userAvatarImage.src = imageObjectURL
                                                    // URL.revokeObjectURL(imageObjectURL)
                                                }                                            
                                            })
                                            .catch(err => {
                                                console.log(err)
                                            })
                                        }
                                    })
                                }
                            })   
                        })
                    }  
                }
                else {
                    cropperIsOpen = false
                }
            })
        }
    }
}
            
            

