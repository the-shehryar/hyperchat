function isNotFaulty(element){
    if(element !== null && element !== undefined && element !== 'undefined' && element !== 'null' && element !== '' && element !== NaN && element !== 0){
        return true
    }
    else {
        return false
    }
}



function getDateAndTime(){
    let today = new Date()
    
    let DTObject = {
        DATE : today.toLocaleString('en-AU', {day : "numeric", month : 'numeric', year : "numeric", timeZone : "UTC"}),
        TIME : today.toLocaleString('en-US' , { hour : "numeric", minute : "numeric", hour12 : true})
    }
    return DTObject;
    
}


function cookieFinder(keyword) {
    document.cookie.split(';').forEach(entry => {
        let entry_name = entry.split('=')[0]
        let entry_value = entry.split('=')[1]
        if (entry_name === keyword) {
            return entry_value
        }
    })
}


function runInputAnimation(label,top=-10,left=5,fontsize=.8){
    label.style.fontSize = `${fontsize}rem`
    label.style.top = `${top}px`
    label.style.left = `${left}px`
    label.style.color = 'rgba(0, 0, 255, 0.702)'

}

function reverseInputAnimation(label,top=20,left=5,fontsize=.8){
    label.style.fontSize = `${fontsize}rem`
    label.style.top = `${top}px`
    label.style.left = `${left}px`
    label.style.color = 'rgba(0, 0, 0, 0.588)'
}

module.exports = {
    isNotFaulty, getDateAndTime, cookieFinder, runInputAnimation, reverseInputAnimation
}