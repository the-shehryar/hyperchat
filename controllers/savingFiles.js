const fs  = require('fs')
const crypto = require('crypto')
const path = require('path')
 
function saveAsFile(FILETYPE,FILENAME,FILE,SENDER){

    let baseString = FILE.split(';base64,').pop()
    let pathToSave = path.join(process.cwd() + `/server/media/${SENDER}/sent/${FILETYPE}s`) 
    

    //? IMAGE Saving Logic 


    if(!fs.existsSync(pathToSave)){
        
        fs.mkdirSync(pathToSave, {
            recursive : true
        })
                    
        fs.writeFile(`${pathToSave}/${FILENAME}.jpg`, baseString, { encoding: 'base64' }, (error) => {
            if (error) {
                console.log(error)
            }
            else {
                console.log('A JPG file is created')
            }
        })
        
    }
    else {
        
        fs.writeFile(`${pathToSave}/${FILENAME}.jpg`, baseString, { encoding: 'base64' }, (error) => {
            if (error) {
                console.log(error)
            }
            else {
                console.log('A JPG file is created')
            }
        })
        
    }


}


module.exports = {
    saveAsFile
}