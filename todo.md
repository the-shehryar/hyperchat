# Major Todo List

01- add picture sending ability in app !important ✔✔
02- Make side menu functional  ✔✔
--- Implement Webpack And BabelJS ✔✔
--- Implement Webpack DevServer     ===> Skipped
--- Implement a preview dailog      ===> Done
03- detect if client quit socket    ===> Done
04- server side input validation ✔✔
05- refresh token authentication
13- Clean server.js file ✔✔
06- email verification 
07- phone number verification
08- add document transfer support  
09- add multimedia transfer support
10- add audio recording support
11- add support for contact imports
12- protect all routes involved
14- implement online and offline indicators  
15- implement seen and read function
16- protection against overloading of sockets 
17- make svg icons equal
18- add audio calling over internet support
19- END TO END ENCRYPTION 
20- Text & Chat Channels
21- Video Call Support


### BUG Bounty LIST
Server messages are sometimes are not sent once two connection is working  Fixed ✔✔
On message Chat enviroment must get message in view it must show new message indication


Profile Picture is not uploading properly   Fixed ✔✔
Batch Following causes parallel save error   ==> 1: Client Side Delay 2: Server Side Fix    Fixed ✔✔ 
        ====> Currently Opting Client Side Fix   ===> rejected
        ====> After the temp fix I'll look for server side fix   ====> opted
Add Refresh Token & redis cache
fix getFriends route  ✔✔
implement sharp  ✔✔
allow only jpg files for upload ✔✔
Add localhost based picture caching ===> I'll have to read response as dataURL using FileReader API ---> Delayed
Show express-validator errors
In signup create a bday format ===> Delayed
global username record
Prevent Empty Form Submission
Add Mouse Parallax on login and signup page   ✔✔
implement emoji panel
fix picture preview  ✔✔
refetch of data on update
Keep track of user's session based activities   ===> Kind of done as it was not neccessary to being with !!✔✔
Create a public endpoint for profile images and icons   ===> Somehow that route is not responding  Fixed ✔✔
indication of following users in suggestion list    Fixed ✔✔
once reload and change in url empty chats should disappear Fixed ✔✔
once reload and change in url non-empty chats should appear 
Fix disappearing of sessional messages tile on reload &&& document messages of current session
<!-- Optional -->
lazy-load image   ==> Delayed
Fix Following rejection when others have your id in followers list ==> Delayed











====> First Fix Message Disappearing  ==> Working
====> Then Show Signup Errors and Universal Username DB     ====> Half-Done
====> Then Develop Homepage as per AdobeXD design    ===> Done
Try Fixing Live Message Error   Fixed
Try Fixing Faulty Image Based Message  Fixed
Implement Latest Message First At First Fetch   //Done
Add Google Places API For Choosing City And Stuff  // half done just need to pass card
Refix the fetching of previous chat //Fixed


Fix Signup Error Display    =====> Done
Add Age Restriction    ====> Done
Implement Compress Js on profile upload   ===> rejected
Try to implement seen fuction and made delivery via special messages on websockets ===> In work

====> Then Fix Unread Message Count     ===> Not Fixed




Sessional Messages become undefined
    -> Seesion Message Trigger at Incoming Message And Outgoing Message
    -> Make Sessional Messages As Array Of Messages and Add an identifer to get last message of each person on reload
    -> Onload if Sessional Messages length is greater than the 0 set refetch to true and refetch ConnectedAccounts and reset it
    -> Also render message in chatBox





<!--  -->

 <div class="preview-slider-container">
    <div class="glide__track" data-glide-el="track" >
        <ul class="glide__slides">
        </ul>
        <div class="action-block-area">
            <div class="glide__arrows" data-glide-el="controls">
                <div class="glide__arrows" data-glide-el="controls">
                    <div class="glide__arrow--prev action-btn previous-step" data-glide-dir="<">Back</div>
                    <div class="glide__arrow--next action-btn next-step" data-glide-dir=">">Next</div>
                </div>
            </div>
        </div>
    </div>
</div>




<!--? Detecting Long Pressed or Touch -->


var onlongtouch; 
var timer;
var touchduration = 500; //length of time we want the user to touch before we do something

touchstart() {
    timer = setTimeout(onlongtouch, touchduration); 
}

touchend() {

    //stops short touches from firing the event
    if (timer)
        clearTimeout(timer); // clearTimeout, not cleartimeout..
}

onlongtouch = function() { //do something };



<!--? Long Button Pressed  -->

(function(window, document, undefined){
    'use strict';
    var start;
    var end;
    var delta;
    var button = document.getElementById("button");

    button.addEventListener("mousedown", function(){
        start = new Date();
    });

    button.addEventListener("mouseup", function() {
        end = new Date();
        delta = end - start;
        if (delta > 0 && delta < 500) {
            alert("less than half second:");
        }
        if (delta > 1000) {
            alert("more than a second:");
        }
    });
})(window, document);