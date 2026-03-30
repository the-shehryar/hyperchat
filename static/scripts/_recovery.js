import {isNotFaulty,getDateAndTime,cookieFinder} from './_support'
import DOMPurify from '/node_modules/dompurify/dist/purify.es.js'
let recoveryMain = document.getElementById('recovery-main')
let recoveryInput = document.querySelector('.field-container #recovery-email')
let recoverySubmitBtn = document.getElementById('submit-recovery-btn')
let errorHolder = document.getElementById('recovery-error-holder')


let resetWrapper = document.getElementById('reset-main')
let resetSubmitBtn = document.getElementById('submit-reset-btn')
let newPasswordInput = document.getElementById('new-password')
let confirmPasswordInput = document.getElementById('new-password-confirm')
let resetErrorHolder = document.querySelector('#reset-error-holder')


let previewBtns = Array.from(document.querySelectorAll('.icon-space'))
let isHidden = true

if(isNotFaulty(previewBtns)){
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
}

if(isNotFaulty(recoverySubmitBtn) && isNotFaulty(recoveryInput)){
    recoverySubmitBtn.addEventListener('click',(e)=>{
            if(recoveryInput.value.length > 0){
                let formData = {
                    recovery_email : DOMPurify.sanitize(recoveryInput.value),
                }
                
                fetch('http://localhost:5000/actions/recovery', {
                    method : 'POST',
                    body : JSON.stringify(formData),
                    headers : { 
                        'Content-Type' : ' application/json',
                        'Accept': "application/json, text/plain"
                    }
                })
                .then(res => {
                    return res.json()
                })
                .then(data => {
                    if(data.success){
                        let confirmationWrapper = document.createElement('div')
                        confirmationWrapper.classList.add('confirmation-wrapper')
                        confirmationWrapper.innerHTML = ` <h1 class="main-success-heading">Password reset link has been  sent to your email address.</h1>
                        <div id="confirmation-icon-holder">
                            <img src="../assets/images/mini-images/Confirm-Tick.svg" alt="">
                        </div>
                        <p>Haven't received the mail yet ?? <a href="">Resend</a></p>`
                        recoveryMain.appendChild(confirmationWrapper)
                    }
                    else {
                        let error = document.createElement('div')
                        error.innerHTML = data.error

                        if(errorHolder.children.length > 0){
                            errorHolder.innerHTML = ''
                            errorHolder.appendChild(error)
                        }
                        else {
                            
                            errorHolder.appendChild(error)
                        }
                        
                    }
                })
            }
    })
    
    recoveryInput.addEventListener('input', (e)=>{
        errorHolder.innerHTML = ''
    })

}


if(isNotFaulty(resetWrapper)){

    if(newPasswordInput.value.length > 0 && confirmPasswordInput.value.length > 0){
        
        resetSubmitBtn.addEventListener('click', ()=>{
        
            let formData = {
                password : DOMPurify.sanitize(newPasswordInput.value),
                confirmPassword : DOMPurify.sanitize(confirmPasswordInput.value)
            }
            if(formData.confirmPassword === formData.password){
                fetch(`${window.location.href}`,{
                    method : 'POST',
                    body : JSON.stringify(formData),
                    headers : {
                        'Content-Type' : "application/json"
                    }
                })            
            }
            else {
                let resetError = document.createElement('div')
                resetError.classList.add('reset-error')
                resetError.textContent = 'Your password does not match.'
    
            
                if(resetErrorHolder.children.length > 0){
                    resetErrorHolder.innerHTML = ''
                    resetErrorHolder.appendChild(resetError)
                }
                else {
                    resetErrorHolder.appendChild(resetError)
                }
            }
    
        })
    
    }

    newPasswordInput.addEventListener('input',()=>{resetErrorHolder.innerHTML = ''})
    confirmPasswordInput.addEventListener('input',()=>{resetErrorHolder.innerHTML = ''})    
    
}
