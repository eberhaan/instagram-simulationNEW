// Speichern in localStorage
function saveData(key, value) {
  localStorage.setItem(key, value);
}

// Lesen aus localStorage
function loadData(key) {
  return localStorage.getItem(key);
}

// Profilbild-Auswahl
function selectProfile(img, name) {
  document.querySelectorAll('.profile-img').forEach(el => el.classList.remove('selected'));
  img.classList.add('selected');
  saveData('profilepic', name);
}

// Bild-Auswahl
function selectImage(img, name) {
  document.querySelectorAll('.img-choice').forEach(el => el.classList.remove('selected'));
  img.classList.add('selected');
  saveData('chosen_image', name);
}

// Likes + Feed Logik
function startFeed() {
  const username = loadData('username') || "user123";
  const profilepic = loadData('profilepic') || "profilepic1.png";
  const chosen = loadData('chosen_image') || "self_1.png";
  const caption = loadData('caption') || "";
  const condition = loadData('condition') || "inclusion";

  document.getElementById('feed-username').innerText = username;
  document.getElementById('feed-profilepic').src = "images/" + profilepic;
  document.getElementById('feed-image').src = "images/" + chosen;
  document.getElementById('feed-caption').innerText = caption;

  let likes = 0;
  let displayLikes = 0;
  const maxLikes = (condition === "inclusion") ? 1148 : 4;
  const allComments = (condition === "inclusion")
    ? ["wow 😍", "Love this!", "wie toll!!", "sehr schön 😊"]
    : [];
  const commentSchedule = [30, 45, 60, 80, 100, 120];
  let commentIndex = 0;
  const usernames = ["holymelon","sunsetvibes","pixelqueen","coffeeaddict","wanderlust","moonlight","tinycloud","dreamer","starlord","glitterbug"];

  function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = "toast";
    toast.innerText = msg;
    document.getElementById('toast-container').appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 500);
    }, 4000);
  }

  function updateFeed(tick) {
    if (condition === "inclusion") {
      let step = Math.ceil(Math.pow(tick * 0.03, 1.4) * (0.5 + Math.random()));
      likes += step;
    } else {
      if (tick === 10) likes = 1;
      if (tick === 50) likes = 2;
      if (tick === 80) likes = 3;
      if (tick === 100) likes = 4;
    }
    if (likes > maxLikes) likes = maxLikes;

    if (displayLikes < likes) {
      displayLikes += Math.ceil((likes - displayLikes) * 0.3);
      if (displayLikes > likes) displayLikes = likes;
      document.getElementById('likes').innerText = displayLikes + " Likes";

      const heart = document.getElementById("heart");
      heart.classList.add("fa-solid","heart-animate");
      heart.classList.remove("fa-regular");
      setTimeout(() => heart.classList.remove("heart-animate"), 300);
    }

    if (commentIndex < allComments.length && tick >= commentSchedule[commentIndex]) {
      const div = document.createElement('div');
      div.classList.add('comment');
      const user = usernames[Math.floor(Math.random() * usernames.length)];
      div.innerHTML = "<strong>" + user + ":</strong> " + allComments[commentIndex];
      document.getElementById('comments').appendChild(div);
      commentIndex++;
    }

    if (displayLikes < maxLikes) {
      setTimeout(() => updateFeed(tick + 1), 1000);
    }
  }

  updateFeed(0);
}
