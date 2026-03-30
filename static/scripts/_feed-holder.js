const userProfileURL = 'http://localhost:5000/users/'
const followingURL = 'http://localhost:5000/follow'

// let suggestion = [
//     {
//         publicKey : "abc",
//         username : "emma_queen",
//         profileImge : "../assets/images/bg-images/pexels-mnm-zameer-3308588.jpg"
//     },
//     {
//         publicKey : "abc",
//         username : "david_osborn",
//         profileImge : "../assets/images/bg-images/pexels-tuesday-temptation-3780104.jpg"
//     },
//     {
//         publicKey : "abc",
//         username : "juile_endereson",
//         profileImge : "../assets/images/bg-images/pexels-johannes-plenio-1103970.jpg"
//     },
//     {
//         publicKey : "abc",
//         username : "jacob_cullen",
//         profileImge : "../assets/images/bg-images/pexels-karolina-grabowska-4040652.jpg"
//     },
// ]




export const loadSuggestionList = async ()=>{
    let suggestion = await fetch('http://localhost:5000/feed/random-suggestion-list')
                        .then(
                            res => {
                                if(res.status === 200){
                                    console.log(res);
                                    return res.json()
                                }
                            }
                        )
                        .then(({follow_suggestions}) => {
                            
                            return follow_suggestions
                        })
    


    suggestion.forEach(item =>{
        let connectionBasedClass = 'sc-follow-button'
        let connectionBasedText = 'sc-follow-button'
        if(item.followedByClient){
            connectionBasedClass = 'sc-following-button'
            connectionBasedText = 'Following'
        }else {
            connectionBasedClass = 'sc-follow-button'
            connectionBasedText = 'Follow'
        }

        let sugesstionList = document.querySelector('.suggestion-list-container .suggestion-list')
        let suggestionCard = document.createElement('div')
        suggestionCard.classList.add('suggestion-card')
        // suggestionCard.setAttribute('data-profile-url', `${userProfileURL}/?u=${item.identifier.publicKey}`)
        suggestionCard.innerHTML = 
        `
        <div class="profile-pic-container">
            <div class="profile-circle">
            <img src='http://localhost:5000/users/public/media?upk=${item.identifier.publicKey}&type=image' alt="profile-picture">
            </div>
        </div>

        <div class="profile-username">${item.userName}</div>

        <div class="suggestion-card-buttons">
            <div class="${connectionBasedClass}" data-public-key='${item.identifier.publicKey}'>${connectionBasedText}</div>

        </div>
        `
        sugesstionList.appendChild(suggestionCard)
    })

    let profileLinks = Array.from( document.querySelectorAll('.suggestion-list .suggestion-card .profile-pic-container .profile-circle'))
    let followLinks = Array.from( document.querySelectorAll('.suggestion-list .suggestion-card .suggestion-card-buttons .sc-follow-button')) 
    let messageLinks = Array.from( document.querySelectorAll('.suggestion-list .suggestion-card .suggestion-card-buttons .sc-message-button')) 

    // profileLinks.forEach(link => {
    //     link.addEventListener('click',(event)=>{
    //         console.log(event.target)
    //         window.location.href = userProfileURL
    //     })
    // })
    
    followLinks.forEach(followBtn => {
        followBtn.addEventListener('click',(event)=>{
            event.target.style.backgroundColor = 'transparent'
            event.target.style.border = '1px solid #d6d6d6'
            event.target.innerHTML = `
                <ul class="loading-bars">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            ` 
            if(event.target.classList.contains('sc-following-button')){
                
                fetch(`http://localhost:5000/actions?qan=unfollow&tpk=${event.target.getAttribute('data-public-key')}`,{
                    method : "PUT"
                })
                
                let sessionalActivities = JSON.parse(localStorage.getItem('currentSessionalActivities'))
                let followingIndex = null;
                sessionalActivities.followed.map(user,index,array => {
                    if(user == event.target.getAttribute('data-public-key') ){
                        followingIndex = index
                    }else {
                        followingIndex = null 
                    }
                })
                if(isNotFaulty(followingIndex)){
                    sessionalActivities.followed.splice(followingIndex)
                    sessionalActivities.unfollowed.push(event.target.getAttribute('data-public-key'))
                    localStorage.setItem("currentSessionalActivities", sessionalActivities)
                }else {
                    sessionalActivities.unfollowed.push(event.target.getAttribute('data-public-key'))
                    localStorage.setItem("currentSessionalActivities", sessionalActivities)
                }
                event.target.classList.remove('sc-following-button')
                event.target.innerHTML = 'Follow'
            }
            else {
                
                fetch(`http://localhost:5000/actions?qan=follow&tpk=${event.target.getAttribute('data-public-key')}`,{
                    method : "PUT"
                })
                .then(data => {
                    return data.json()
                })
                .then(({requestStatus,success}) => {
                    if(requestStatus === 'completed' && success === true){
                        event.target.classList.add('sc-following-button')
                        event.target.innerHTML = 'Following'
                    }
                    else if(requestStatus === 'pending' && success === true ){
                        event.target.classList.add('sc-requesting-button')
                        event.target.innerHTML = 'Requested'    
                    }
                })
            }
        })
    })
}