function isNotFaulty(element){
    if(element !== null && element !== undefined && element !== '' && element !== NaN && element !== 0){
        return true
    }
    else {
        return false
    }
}

module.exports  =  {
    isNotFaulty
}