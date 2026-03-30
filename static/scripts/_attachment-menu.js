// Imports
import {isNotFaulty} from './_support'
import {previewableFilesArray, sendMessageButton} from './_room'
import Swiper from './swiper-bundle.esm.browser.min'
let filePickerTrigger = document.getElementById('file-picker-trigger')
let filePickerContainer = document.querySelector('.file-picker-container')
let attachmentFileOptionModel = document.querySelector('.file-options-model')
let filechooser = document.getElementById("file-chooser")
let attachmentModelEntries = Array.from(document.querySelectorAll('.selectable-options-container'))
let attachmentModelExpansion = false


let emojiPanel = document.querySelector('.emoji-panel')
let emojiPanelExpansion = false
let emojiPanelTrigger = document.querySelector('.emoji-panel-trigger')




isNotFaulty(filePickerTrigger) && filePickerTrigger.addEventListener("click", (e) => {
    let tooltip = document.querySelector(`#${filePickerTrigger.id} .general-tool-tip`)
    if (!attachmentModelExpansion) {
        tooltip.style.display = 'none'
        attachmentFileOptionModel.style.visibility = "visible"
        attachmentFileOptionModel.style.bottom = "60px"
        attachmentFileOptionModel.style.opacity = "1"    
        attachmentModelExpansion = true
    }
    else{
        tooltip.style.display = 'flex'
        attachmentFileOptionModel.style.bottom = "0px"
        attachmentFileOptionModel.style.opacity = "0"
        setTimeout(() => {
            if (attachmentFileOptionModel.style.opacity == "0") {
                attachmentFileOptionModel.style.visibility = "hidden"
            }
        }, 200);
        attachmentModelExpansion = false
    }
})




isNotFaulty(emojiPanelTrigger) && emojiPanelTrigger.addEventListener("click", (e) => {
    let tooltip = document.querySelector(`#${emojiPanelTrigger.id} .general-tool-tip`)
    if (!emojiPanelExpansion) {
        tooltip.style.display = 'none'
        emojiPanel.style.visibility = "visible"
        emojiPanel.style.bottom = "60px"
        emojiPanel.style.opacity = "1"    
        emojiPanelExpansion = true
    }
    else{
        tooltip.style.display = 'flex'
        emojiPanel.style.bottom = "0px"
        emojiPanel.style.opacity = "0"
        setTimeout(() => {
            if (emojiPanel.style.opacity == "0") {
                emojiPanel.style.visibility = "hidden"
            }
        }, 200);
        emojiPanelExpansion = false
    }
})









if (isNotFaulty(attachmentModelEntries)) {
    attachmentModelEntries.filter(item => {
        if (item.getAttribute('data-af') !== '') {
            item.addEventListener('click', (e) => {
                
                let acceptableFormats = item.getAttribute('data-af')
                filechooser.setAttribute('accept', acceptableFormats)
                filechooser.click()
            })
        }
        else {
            // Implement location fetching
        }
    })
}



export function renderFilesInPreviewModel(preview) {
    
    //? Make Sure The Value Passed is an Array
    

        //? Implement Swiper Later
        let previewModelContainer = document.querySelector('.preview-model-container')
        previewModelContainer.classList.add('preview-model-show')
        let exitButton = document.querySelector('.preview-model-container .exit-btn-container')
        let slidesHolder = document.querySelector('.preview-model-body .swiper-wrapper')
        let confirmAttachmentButton = document.querySelector('.preview-model-body .secondary-action-block .secondary-send-btn')
        let additionalMessageInput = Array.from(document.querySelectorAll('.additional-message-input'))
        let arrayOfFakePlaceholder = Array.from(document.querySelectorAll('.input-fake-placeholder'))
        
        
        
        let temp = document.createElement('div')
        temp.className = 'swiper-slide'
        temp.innerHTML = `
        <div class="preview-image-container">
            <img class="preview-image" src=${preview} alt="">
            </div>
            <div class="additional-message-wrapper">
                <div class="input-fake-placeholder">Write Something . . . .</div>
                <div contenteditable='true' class="nobars additional-message-input"></div>
        </div>`
        slidesHolder.appendChild(temp)
        

        
    
        console.log(slidesHolder)
        let previewCarousel = new Swiper('.preview-model-body', {
            loop : false,
            navigation : {
                nextEl : '.swiper-button-next',
                prevEl : ".swiper-button-prev"
            }
        })

        exitButton.addEventListener('click', ()=>{
            previewModelContainer.classList.remove('preview-model-show')
            previewableFilesArray.previews = []
            // console.log(previewableFilesArray)
            slidesHolder.innerHTML = ''
            previewCarousel.destroy()
            // previewableFilesArray = []
        })


        additionalMessageInput.forEach((item, index) => {
            item.addEventListener('click',()=>{
                arrayOfFakePlaceholder[index].style.opacity = '0'
                arrayOfFakePlaceholder[index].style.pointerEvents = 'none'
            })
        })


        confirmAttachmentButton.addEventListener('click', (e)=> {
            // let actionButton = document.getElementById('send-msg')
            // console.log(actionButton)
            // actionButton.click()
            exitButton.click()
            e.preventDefault()
            e.stopPropagation()
            console.log('bitch')
        })

        
            


        
            // previewModelBody.appendChild(imagefile)
            // }
            // previewModelContainer.addEventListener('click', (e) => {
                //     document.body.removeChild(e.target)
                // })
            
        }



//? When Mouse Click Somewhere Other than FilePickerModel

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('chat-place')) {
        close_drawer()
    }
    else if (!e.target.classList.contains('file-options-model') && e.target.id != 'file-picker-trigger' && attachmentModelExpansion)  {
        let tooltip;
        if (filePickerTrigger && attachmentFileOptionModel) {
            console.log(e.target)
            tooltip = document.querySelector(`#${filePickerTrigger.id} .general-tool-tip`)
            tooltip.style.display = 'flex'
            attachmentFileOptionModel.style.bottom = "0px"
            attachmentFileOptionModel.style.opacity = "0"
            setTimeout(() => {
                if (attachmentFileOptionModel.style.opacity == "0") {
                    attachmentFileOptionModel.style.visibility = "hidden"
                }
            }, 200);
            attachmentModelExpansion = false
        }
    }
    else if (!e.target.classList.contains('emoji-panel') && e.target.id != 'emoji-panel-trigger' && emojiPanelExpansion)  {
        console.log('better hide emoji panel')
        let tooltip;
        if (emojiPanelTrigger && emojiPanel) {
            console.log(emojiPanelExpansion)
            tooltip = document.querySelector(`#${emojiPanelTrigger.id} .general-tool-tip`)
            tooltip.style.display = 'flex'
            emojiPanel.style.bottom = "0px"
            emojiPanel.style.opacity = "0"
            setTimeout(() => {
                if (emojiPanel.style.opacity == "0") {
                    emojiPanel.style.visibility = "hidden"
                }
            }, 200);
            emojiPanelExpansion = false
        }
    }
})

