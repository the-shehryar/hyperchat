import { isNotFaulty } from "./_support"
export const runSideExplorer = ()=>{
    let menuItems = document.querySelectorAll('.menu-tile')
    let menuTilesArray = isNotFaulty(menuItems) && Array.from(menuItems)
                

    menuTilesArray.forEach((item, mainIndex, mainArray,) => {
                    
        if(isNotFaulty(item.getAttribute('data-tile-link')) && item.getAttribute('data-tile-link').includes(window.location.pathname)){
            item.children[0].classList.add('active-icon')
        }

        item.addEventListener('click', (event)=>{
            
            console.log(item)

            menuTilesArray.map((internalItem, index, currentArray)=>{
                // If user clicks on item and some other item active already
                if(internalItem !== item){
                    // internalItem.style.background = '#ffffff'
                    if(currentArray[index].children[0].classList.contains('active-icon')){
                        currentArray[index].children[0].classList.remove('active-icon')
                    }
                }
                // If user clicks on item
                else if(internalItem === item){
                    // internalItem.style.background = '#ebe8e8'

                    let routeName = internalItem.getAttribute("data-tile-link")
                    console.log(item)
                    // And item is not active already
                    if(!item.children[0].classList.contains('active-icon')){

                        
                        if(isNotFaulty(routeName)){
                            window.location.href = routeName
                            
                            // currentArray.map(icon => {
                            //     if(icon.getAttribute('data-tile-link') === routeName){
                            //         icon.children[0].classList.add('active-icon')
                            //         console.log(icon)

                            //     }
                            // })
                        }
                    }
                }
            })
            
        })

        //! Client Side Redirection
        // let routeName = item.getAttribute("data-tile-link")
        // if(isNotFaulty(routeName) && item.children[0].classList.contains('active-icon')){
            //     window.location.href = routeName
            // }
        if(item.children[0].classList.contains('active-icon')){
            // item.style.background = '#ebe8e8'
        }
        else {
            // item.style.background = '#ffffff'
        }    
    })
}