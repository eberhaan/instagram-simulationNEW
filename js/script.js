// ---------------- Data ----------------
const profilepics = Array.from({length:6},(_,i)=>`images/profilepic${i+1}.png`);
const imagesSelf = Array.from({length:6},(_,i)=>`images/self_${i+1}.png`);
const imagesNeutral = Array.from({length:6},(_,i)=>`images/neutral_${i+1}.png`);

let simData = JSON.parse(localStorage.getItem("simData")) || {};
const cond = "i";      // i=inclusion, e=exclusion
const pic_mode = "1";  // 1=selfies, 2=neutral

// ---------------- Screen 1 ----------------
function loadProfilePics(){
  const container=document.getElementById("profilepics-container");
  if(!container) return;
  let selected=profilepics[0];
  simData.profilepic=selected;
  profilepics.forEach(pic=>{
    const img=document.createElement("img");
    img.src=pic; img.className="profile-img";
    if(pic===selected) img.classList.add("selected");
    img.onclick=()=>{
      simData.profilepic=pic;
      document.querySelectorAll(".profile-img").forEach(i=>i.classList.remove("selected"));
      img.classList.add("selected");
    };
    container.appendChild(img);
  });
}
function saveUsernameProfile(e){
  e.preventDefault();
  simData.username=document.getElementById("username").value.trim()||"user123";
  localStorage.setItem("simData",JSON.stringify(simData));
  window.location.href="select.html";
}

// ---------------- Screen 2 ----------------
function loadSelectScreen(){
  const container=document.getElementById("images-container");
  if(!container) return;
  const imgs = pic_mode==="1"?imagesSelf:imagesNeutral;
  document.getElementById("select-title").innerText=
    pic_mode==="1"?"Wähle das Selfie, das dir am ähnlichsten sieht.":"Wähle das Bild, das dir am besten gefällt.";
  simData.chosen_image=imgs[0];
  imgs.forEach(url=>{
    const img=document.createElement("img");
    img.src=url;
    if(url===simData.chosen_image) img.classList.add("selected");
    img.onclick=()=>{
      simData.chosen_image=url;
      document.querySelectorAll("#images-container img").forEach(i=>i.classList.remove("selected"));
      img.classList.add("selected");
    };
    container.appendChild(img);
  });
}
function saveChosenImage(e){
  e.preventDefault();
  localStorage.setItem("simData",JSON.stringify(simData));
  window.location.href="post.html";
}

// ---------------- Screen 3 ----------------
function loadPostScreen(){
  if(!document.getElementById("chosen-image-display")) return;
  document.getElementById("chosen-image-display").src=simData.chosen_image;
}
function saveCaption(e){
  e.preventDefault();
  simData.caption=document.getElementById("caption").value||"";
  localStorage.setItem("simData",JSON.stringify(simData));
  window.location.href="feed.html";
}

// ---------------- Screen 4 ----------------
function loadFeed(){
  if(!document.getElementById("feed-username")) return;
  document.getElementById("feed-username").innerText=simData.username;
  document.getElementById("feed-username-caption").innerText=simData.username;
  document.getElementById("feed-profilepic").src=simData.profilepic;
  document.getElementById("feed-chosen").src=simData.chosen_image;
  document.getElementById("feed-caption").innerText=simData.caption;

  const comments=["wow 😍","Love this!","wie toll!!","sehr schön 😊"];
  const usernames=["holymelon","sunsetvibes","pixelqueen","coffeeaddict"];
  const cc=document.getElementById("comments-container");
  cc.innerHTML="";

  let likes=0;
  const maxLikes=cond==="i"?1148:4;
  const duration=120; // seconds
  let tick=0;

  function update(){
    tick++;
    // exponential likes
    if(cond==="i"){
      likes=Math.min(maxLikes, Math.floor(maxLikes*(1-Math.exp(-tick/30))));
    } else {
      if([30,60,90,110].includes(tick)) likes++;
    }
    document.getElementById("feed-likes").innerText=likes+" Likes";

    // add comments gradually
    if(tick%30===0 && comments.length){
      const comment=comments.shift();
      const user=usernames.shift()||"user";
      const div=document.createElement("div");
      div.innerHTML=`<strong>${user}:</strong> ${comment}`;
      cc.appendChild(div);
    }

    // notifications
    const notifContainer=document.getElementById("notifications");
    const notif=document.createElement("div");
    if(cond==="i"){
      if(likes===20) notif.innerText="Dein Post hat schon 20 Likes!";
      if(likes===100) notif.innerText="Schon 100 Likes erreicht!";
      if(likes===500) notif.innerText="Wow, 500 Likes!";
      if(likes===1000) notif.innerText="Mega, 1000 Likes!";
    } else {
      if(tick===30) notif.innerText="Dein Post hat kaum Likes...";
      if(tick===60) notif.innerText="Noch niemand kommentiert.";
      if(tick===90) notif.innerText="Sehr wenig Aufmerksamkeit.";
    }
    if(notif.innerText){
      notif.className="toast show";
      notifContainer.appendChild(notif);
      setTimeout(()=>{notif.classList.remove("show"); notif.remove();},4000);
    }

    if(tick<duration) setTimeout(update,1000);
  }
  update();

  // heart toggle
  const heart=document.getElementById("heart");
  heart.onclick=()=>{
    heart.classList.toggle("fa-solid");
    heart.classList.toggle("fa-regular");
    heart.style.color=heart.classList.contains("fa-solid")?"red":"black";
  };
}
