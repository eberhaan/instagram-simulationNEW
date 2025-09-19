// ---------------- Daten ----------------
// Profilepics (immer gleich)
const profilepics = Array.from({length:6},(_,i)=>`images/profilepic${i+1}.png`);

// Selfie- und Neutral-Bilder
const imagesSelf = Array.from({length:6},(_,i)=>`images/self_${i+1}.png`);
const imagesNeutral = Array.from({length:6},(_,i)=>`images/neutral_${i+1}.png`);

// Bedingungen
const cond = "i";      // "i" = Inklusion, "e" = Exklusion
const pic_mode = "1";  // "1" = Selfies, "2" = Neutrale Bilder

// Datenobjekt
let simData = JSON.parse(localStorage.getItem("simData")) || {};

// ---------------- Screens ----------------
function showScreen(n){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById("screen"+n).classList.add("active");
}

// ---------------- Screen 1 ----------------
let selectedProfile = profilepics[0];
const container1 = document.getElementById("profilepics-container");
container1.innerHTML = "";

profilepics.forEach(pic=>{
  const img=document.createElement("img");
  img.src=pic;
  if(pic===selectedProfile) img.classList.add("selected");
  img.onclick=()=>{
    selectedProfile=pic;
    document.querySelectorAll("#profilepics-container img").forEach(i=>i.classList.remove("selected"));
    img.classList.add("selected");
  };
  container1.appendChild(img);
});

function nextScreen1(){
  const username=document.getElementById("username").value.trim()||"user123";
  simData.username=username;
  simData.profilepic=selectedProfile;
  localStorage.setItem("simData",JSON.stringify(simData));
  showScreen(2); loadScreen2();
}

// ---------------- Screen 2 ----------------
function loadScreen2(){
  const container=document.getElementById("images-container");
  container.innerHTML="";
  
  // Dynamische Bildliste abhängig von pic_mode
  const imgs=pic_mode==="1"?imagesSelf:imagesNeutral;
  
  // Standard: erstes Bild vorselektieren
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

  // Titeltext je nach Bedingung
  document.getElementById("screen2-title").innerText=
    pic_mode==="1"
      ? "Wähle das Selfie, das dir am ähnlichsten sieht."
      : "Wähle das Bild, das dir am besten gefällt.";
}

function nextScreen2(){
  localStorage.setItem("simData",JSON.stringify(simData));
  showScreen(3);
  document.getElementById("chosen-image-display").src=simData.chosen_image;
}

// ---------------- Screen 3 ----------------
function nextScreen3(){
  simData.caption=document.getElementById("caption").value||"";
  localStorage.setItem("simData",JSON.stringify(simData));
  showScreen(4); loadFeed();
}

// ---------------- Screen 4 ----------------
function loadFeed(){
  document.getElementById("feed-username").innerText=simData.username;
  document.getElementById("feed-username-caption").innerText=simData.username;
  document.getElementById("feed-profilepic").src=simData.profilepic;
  document.getElementById("feed-chosen").src=simData.chosen_image;
  document.getElementById("feed-caption").innerText=simData.caption;

  // Kommentare
  const comments=["wow 😍","Love this!","wie toll!!","sehr schön 😊"];
  const cc=document.getElementById("comments-container");
  cc.innerHTML="";
  comments.forEach(c=>{
    const div=document.createElement("div");
    div.innerText=c; cc.appendChild(div);
  });

  // Herz + Likes
  const heart=document.getElementById("heart");
  heart.onclick=()=>{
    heart.classList.toggle("fa-regular");
    heart.classList.toggle("fa-solid");
    heart.style.color=heart.classList.contains("fa-solid")?"red":"black";
  };

  let likes=0;
  const maxLikes=cond==="i"?1148:4;
  function updateLikes(){
    if(likes<maxLikes){
      likes+=Math.ceil((maxLikes-likes)*0.05);
      if(likes>maxLikes) likes=maxLikes;
      document.getElementById("feed-likes").innerText=likes+" Likes";
      setTimeout(updateLikes,1000);
    }
  }
  updateLikes();

  // Notifications
  const notifications=document.getElementById("notifications");
  const msgs=cond==="i"?[
    "Dein Post geht viral! 🚀",
    "Schon 500 Likes! 🎉",
    "1000 Likes erreicht! 🔥",
    "Mega Beliebtheit! ❤️"
  ]:[
    "Dein Post wird kaum gesehen 😔",
    "Nur wenige Likes...",
    "Fast keine Interaktionen",
    "Vielleicht später nochmal posten?"
  ];
  let shown=0;
  function showNext(){
    if(shown<msgs.length){
      const div=document.createElement("div");
      div.className="toast show";
      div.innerText=msgs[shown++];
      notifications.appendChild(div);
      setTimeout(()=>{div.classList.remove("show");div.remove();},4000);
      setTimeout(showNext,5000);
    }
  }
  showNext();
}
