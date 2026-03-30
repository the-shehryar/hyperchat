import { isNotFaulty } from "./_support"
import DOMPurify from '/node_modules/dompurify/dist/purify.es.js'
const loginForm = document.querySelector(".formcontainer .loginform")
const PortNumber = 5000

if(isNotFaulty(loginForm)){
    let loginBtn = document.querySelector('#loginBtn')
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
            e.target.addEventListener('keydown' , (e)=>{
                if(e.key == 'Enter' || e.keyCode === 13){
                    loginBtn.click()
                }
            })
        })
        item.addEventListener("input", (e) => {
            //? Write it Better
            let targetBoxIndex = item.parentElement.childElementCount - 1
            if (item.parentElement.children[targetBoxIndex].classList.contains('error-dialog')) {
                item.parentElement.removeChild(item.parentElement.lastChild)
            }
            item.style.borderBottom = "#14101066 2px solid"
        })
    })

    if(isNotFaulty(loginBtn)){
        loginBtn.addEventListener('click' , (e) => {
            e.preventDefault()
            console.log('ClientSide : User Requesting Enterance')
            let username = document.querySelector('#username').value
            let password = document.querySelector("#password").value

            let formdData = {
                username : DOMPurify.sanitize(username),
                password : DOMPurify.sanitize(password) 
            }
            fetch(`http://localhost:${PortNumber}/login`, {
                method : 'POST',
                body : JSON.stringify(formdData),
                headers : {
                    "Content-Type" : "application/json",
                    "Accept" : "application/json, text/plain"
                },
                redirect : 'follow'
            })
            .then(res => res.json()) // Destructuring
                .then (({userInfo,redirectionEndPoint,error,faulty_input}) => {
                    
                if(redirectionEndPoint){
                        localStorage.setItem('up-details', JSON.stringify(userInfo))
                        
                        if(localStorage.getItem('up-details')){
                            fetch(`http://localhost:5000/chats/connectedAccounts?rpk=${JSON.parse(localStorage.getItem('up-details')).publicKey}`)
                                .then(res => {return res.json()})
                                .then(async(first_load) => {
                                    localStorage.setItem('connected_accounts', JSON.stringify(first_load))
                                })
                                .finally(()=> {
                                    window.location.href = redirectionEndPoint
                                })
                        }
                        // init()
                        // createSocket()
                        

                        
                }
                else if(error){
                    console.log(error)
                    let errorBox =  document.querySelector('.error-box')
                    let errorDialog = document.createElement('div') 
                    errorDialog.classList.add("error-dialog")
                    errorDialog.innerText = error
                    let associatedInput = document.querySelector(`#${faulty_input}`)
                    associatedInput.style.borderBottom = "red 2px solid"
                    if(errorBox.children.length > 0){
                        errorBox.innerHTML = ''
                        errorBox.appendChild(errorDialog);
                    }
                    else {
                        errorBox.appendChild(errorDialog);
                    }
                }
            })
            .catch(
                function (error) {
                    console.log("Request Error");
                    console.log(error)
                }
            )
        })
    }


}