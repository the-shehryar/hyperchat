export const initializeRippleEffect = ()=>{
    let nativeButtons = Array.from(document.querySelectorAll('.native-button'))
    // console.log(nativeButtons)

    nativeButtons.forEach((item) => {
        item.addEventListener("click" , function(e){
            let xValue = e.clientX - e.target.offsetLeft
            let yValue = e.clientY - e.target.offsetTop

            let ripples = document.createElement('span')
            ripples.classList.add('ripples')
            ripples.style.left =  xValue + 'px'
            ripples.style.top = yValue + "px"
            this.appendChild(ripples)

            setTimeout(() => {
                    ripples.remove()
            }, 500);
        })
    })
}


