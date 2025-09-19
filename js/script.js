// ---------------- Daten ----------------
const profilepics = [];
for(let i=1;i<=6;i++) profilepics.push(`images/profilepic${i}.png`);

const imagesSelf = [];
for(let i=1;i<=6;i++) imagesSelf.push(`images/self_${i}.png`);

const imagesNeutral = [];
for(let i=1;i<=6;i++) imagesNeutral.push(`images/neutral_${i}.png`);

const cond = "i"; // "i" = Inclusion, "e" = Exclusion
const pic_mode = "1"; // "1" = Selfies, "2" = Neutral

// ---------------- LocalStorage Daten ----------------
let simData = JSON.parse(localStorage.getItem("simData")) || {};

// ---------------- Utils ----------------
function showScreen(n){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById("screen"+n).classList.add("active");
}

// ---------------- Screen 1 ----------------
const container = document.getElementById("profilepics-container");
let selectedProfile = profilepics[0];

profilepics.forEach(pic=>{
  const img = document.createElement("img");
  img.src = pic;
  if(pic===selectedProfile) img.classList.add("selected");
  img.onclick = ()=>{
    selectedProfile = pic;
    document.querySelectorAll("#profilepics-container img").forEach(i=>i.classList.remove("selected"));
    img.classList.add("selected");
  };
  container.appendChild(img);
});

function nextScreen1(){
  const username = document.getElementById("username").value.trim() || "user123";
  simData.username = username;
  simData.profilepic = selectedProfile;
  localStorage.setItem("simData", JSON.stringify(simData));
  showScreen(2);
  loadScreen2();
}

// ---------------- Screen 2 ----------------
function loadScreen2(){
  const container = document.getElementById("images-container");
  container.innerHTML="";
  const imgs = pic_mode==="1"? imagesSelf : imagesNeutral;
  simData.chosen_image = imgs[0];
  imgs.forEach(imgUrl=>{
    const img = document.createElement("img");
    img.src = imgUrl;
    if(imgUrl===simData.chosen_image) img.classList.add("selected");
    img.onclick = ()=>{
      simData.chosen_image = imgUrl;
      document.querySelectorAll("#images-container img").forEach(i=>i.classList.remove("selected"));
      img.classList.add("selected");
    };
    container.appendChild(img);
  });
  document.getElementById("screen2-title").innerText = pic_mode==="1"?"Wähle das Bild, das dir am ähnlichsten sieht.":"Wähle das Bild, das dir am besten gefällt.";
}

function nextScreen2(){
  localStorage.setItem("simData", JSON.stringify(simData));
  showScreen(3);
  document.getElementById("chosen-image-display").src = simData.chosen_image;
}

// ---------------- Screen 3 ----------------
function nextScreen3(){
  simData.caption = document.getElementById("caption").value || "";
  localStorage.setItem("simData", JSON.stringify(simData));
  showScreen(4);
  loadFeed();
}

// ---------------- Screen 4 ----------------
function loadFeed(){
  document.getElementById("feed-username").innerText = simData.username;
  document.getElementById("feed-profilepic").src = simData.profilepic;
  document.getElementById("feed-chosen").src = simData.chosen_image;
  document.getElementById("feed-caption").innerText = simData.caption;

  const commentsContainer = document.getElementById("comments-container");
  const allComments = ["wow 😍","Love this!","wie toll!!","sehr schön 😊"];
  commentsContainer.innerHTML="";
  allComments.forEach(c=>{
    const div = document.createElement("div");
    div.innerText=c;
    commentsContainer.appendChild(div);
  });

  // ---------------- Likes & Herz ----------------
  let likes = 0;
  let displayLikes = 0;
  const maxLikes = cond==="i"?1148:4;

  const heart = document.getElementById("heart");
  heart.onclick = ()=>{ heart.classList.toggle("fas"); heart.classList.toggle("far"); heart.style.color=heart.classList.contains("fas")?"red":"black"; };

  function updateLikes(){
    if(displayLikes<maxLikes){
      displayLikes+=Math.ceil((maxLikes-displayLikes)*0.05);
      if(displayLikes>maxLikes) displayLikes=maxLikes;
      document.getElementById("feed-likes").innerText=displayLikes+" Likes";
      setTimeout(updateLikes,1000);
    }
  }
  updateLikes();

  // ---------------- Notifications ----------------
  const notifications = document.getElementById("notifications");
  const msgs = cond==="i"?[
    "Dein Post kommt super an!",
    "Schon 500 Likes!",
    "Toll, du bist beliebt!",
    "1000 Likes erreicht!"
  ]:[
    "Dein Post kommt kaum an...",
    "Fast niemand sieht ihn.",
    "Wenige Likes bisher",
    "Vielleicht nochmal versuchen?"
  ];

  let shown=0;
  function showNextNotification(){
    if(shown<msgs.length){
      const div = document.createElement("div");
      div.className="toast show";
      div.innerText=msgs[shown++];
      notifications.appendChild(div);
      setTimeout(()=>{ div.classList.remove("show"); div.remove(); },4000);
      setTimeout(showNextNotification,5000);
    }
  }
  showNextNotification();
}
