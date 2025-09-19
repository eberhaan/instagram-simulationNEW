// --- Daten ---
const profilepics = [
  "images/profilepic1.png","images/profilepic2.png","images/profilepic3.png",
  "images/profilepic4.png","images/profilepic5.png"
];

const imagesSelf = [
  "images/self_1.png","images/self_2.png","images/self_3.png"
];

const imagesNeutral = [
  "images/neutral_1.png","images/neutral_2.png","images/neutral_3.png"
];

const cond = "i"; // inclusion / e=exclusion
const pic_mode = "1"; // 1=selfies, 2=neutral

// --- LocalStorage helper ---
function saveData(key, value){ localStorage.setItem(key,value); }
function getData(key,defaultVal=""){ return localStorage.getItem(key)||defaultVal; }

// --- SCREEN 1 ---
function initScreen1(){
    const container = document.getElementById("profilepics-container");
    container.innerHTML="";
    let selectedProfile = profilepics[0];
    profilepics.forEach(pic=>{
        const img = document.createElement("img");
        img.src = pic;
        img.className = "profile-img";
        if(pic===selectedProfile) img.classList.add("selected");
        img.onclick = ()=>{
            selectedProfile = pic;
            document.querySelectorAll(".profile-img").forEach(i=>i.classList.remove("selected"));
            img.classList.add("selected");
        };
        container.appendChild(img);
    });

    document.getElementById("btn-screen1").onclick = ()=>{
        const username = document.getElementById("username").value || "user123";
        saveData("username",username);
        saveData("profilepic",selectedProfile);
        window.location.href = "select.html";
    };
}

// --- SCREEN 2 ---
function initScreen2(){
    const container = document.getElementById("images-container");
    container.innerHTML="";
    const imgs = pic_mode==="1"? imagesSelf : imagesNeutral;
    let selectedImage = imgs[0];
    imgs.forEach(pic=>{
        const img = document.createElement("img");
        img.src = pic;
        img.className = "selectable-img";
        if(pic===selectedImage) img.classList.add("selected");
        img.onclick = ()=>{
            selectedImage = pic;
            document.querySelectorAll(".selectable-img").forEach(i=>i.classList.remove("selected"));
            img.classList.add("selected");
        };
        container.appendChild(img);
    });

    document.getElementById("btn-screen2").onclick = ()=>{
        saveData("chosen_image",selectedImage);
        window.location.href = "post.html";
    };
}

// --- SCREEN 3 ---
function initScreen3(){
    document.getElementById("btn-screen3").onclick = ()=>{
        const caption = document.getElementById("caption").value || "";
        saveData("caption",caption);
        window.location.href = "feed.html";
    };
}

// --- SCREEN 4 ---
function initFeed(){
    const username = getData("username","user123");
    const profilepic = getData("profilepic","images/profilepic1.png");
    const chosen_image = getData("chosen_image",imagesSelf[0]);
    const caption = getData("caption","");

    document.getElementById("feed-username").innerText = username;
    document.getElementById("feed-profilepic").src = profilepic;
    document.getElementById("feed-chosen").src = chosen_image;
    document.getElementById("feed-caption").innerText = caption;

    // Likes und Kommentare
    let likes = 0;
    const maxLikes = cond==="i"?1148:4;
    const commentsList = cond==="i"?["wow 😍","Love this!","wie toll!!","sehr schön 😊"]:[];

    let displayLikes=0;
    const usernames = ["holymelon","sunsetvibes","pixelqueen","coffeeaddict","wanderlust"];
    let commentIndex=0;
    const commentSchedule=[30,60,90,120];

    const notifications_inclusion = [
        {msg:"Dein Post scheint gut anzukommen!", trigger:150},
        {msg:"Schon 500 Likes!", trigger:500},
        {msg:"Toll, du bist beliebt!", trigger:750},
        {msg:"Dein Post hat 1148 Likes!", trigger:1148}
    ];

    const notifications_exclusion = [
        {msg:"Dein Post kommt kaum an...", trigger:30},
        {msg:"Fast niemand liket den Post.", trigger:60},
        {msg:"Keine Aufmerksamkeit.", trigger:90},
        {msg:"Vielleicht probierst du es nochmal?", trigger:110}
    ];

    let shownNotifications = new Set();
    let tick=0;

    function showToast(msg){
        const toast = document.createElement('div');
        toast.className = "toast show";
        toast.innerText = msg;
        document.body.appendChild(toast);
        setTimeout(()=>toast.remove(),4000);
    }

    function updateFeed(){
        tick++;

        // Likes steigern
        if(cond==="i"){
            let step = Math.ceil((tick*0.05)**1.3);
            likes += step;
        } else {
            likes = Math.min(tick,4);
        }
        if(likes>maxLikes) likes=maxLikes;

        // sanfte Anzeige
        if(displayLikes<likes){
            displayLikes += Math.ceil((likes-displayLikes)*0.3);
            if(displayLikes>likes) displayLikes=likes;
            document.getElementById("likes").innerText = displayLikes+" Likes";
        }

        // Kommentare
        if(commentIndex<commentsList.length && tick>=commentSchedule[commentIndex]){
            const div = document.createElement("div");
            div.className="comment";
            const user = usernames[Math.floor(Math.random()*usernames.length)];
            div.innerHTML=`<strong>${user}:</strong> ${commentsList[commentIndex]}`;
            document.getElementById("comments").appendChild(div);
            commentIndex++;
        }

        // Notifications
        if(cond==="i"){
            notifications_inclusion.forEach(n=>{
                if(likes>=n.trigger && !shownNotifications.has(n.msg)){
                    showToast(n.msg);
                    shownNotifications.add(n.msg);
                }
            });
        } else {
            notifications_exclusion.forEach(n=>{
                if(tick>=n.trigger && !shownNotifications.has(n.msg)){
                    showToast(n.msg);
                    shownNotifications.add(n.msg);
                }
            });
        }

        if(displayLikes<maxLikes) setTimeout(updateFeed,1000);
    }
    updateFeed();
}
