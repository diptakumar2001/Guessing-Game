const imageData = {
  "cat.png": "animal", "dog.png": "animal", "elephant.png": "animal", "fish.png": "animal", "tiger.png": "animal",
  "lion.png": "animal", "bear.png": "animal", "giraffe.png": "animal", "zebra.png": "animal", "monkey.png": "animal",
  "horse.png": "animal", "kangaroo.png": "animal", "penguin.png": "animal", "owl.png": "animal", "frog.png": "animal",
  "eagle.png": "animal", "shark.png": "animal", "dolphin.png": "animal", "whale.png": "animal", "crab.png": "animal",

  "apple.png": "plant", "banana.png": "plant", "carrot.png": "plant", "rose.png": "plant", "tree.png": "plant",
  "leaf.png": "plant", "cactus.png": "plant", "flower.png": "plant", "mushroom.png": "plant", "grape.png": "plant",
  "pineapple.png": "plant", "coconut.png": "plant", "cherry.png": "plant", "lettuce.png": "plant", "spinach.png": "plant",
  "cabbage.png": "plant", "corn.png": "plant", "onion.png": "plant", "potato.png": "plant", "tomato.png": "plant",

  "car.png": "object", "hat.png": "object", "guitar.png": "object", "chair.png": "object", "phone.png": "object",
  "computer.png": "object", "keyboard.png": "object", "mouse.png": "object", "lamp.png": "object", "book.png": "object",
  "bottle.png": "object", "backpack.png": "object", "table.png": "object", "television.png": "object", "watch.png": "object",
  "camera.png": "object", "shoe.png": "object", "sock.png": "object", "cup.png": "object", "plate.png": "object",

  "clock.png": "object", "fridge.png": "object", "microwave.png": "object", "blender.png": "object", "hammer.png": "object",
  "wrench.png": "object", "screwdriver.png": "object", "bicycle.png": "object", "motorcycle.png": "object", "airplane.png": "object",
  "train.png": "object", "bus.png": "object", "truck.png": "object", "rocket.png": "object", "drone.png": "object",
  "fan.png": "object", "radio.png": "object", "wallet.png": "object", "pencil.png": "object", "pen.png": "object"
};
const imageFolder = "media/";
const allImages = Object.keys(imageData);
let remainingImages = [];
let recentImages = [];
let currentImage = "";
let selectedCategory = "all";
let playerName = localStorage.getItem("playerName") || "";
let difficulty = "medium";
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let attempts = 3;
let timerInterval;
let maxTime = 20;
let timeLeft = maxTime;




if (!localStorage.getItem("authToken")) {
  window.location.href = "login.html";
}

function startGame() {
  const difficultySelect = document.getElementById("difficulty");
  const categorySelect = document.getElementById("category");
  const welcome = document.getElementById("welcomeMessage");

  if (!difficultySelect || !categorySelect || !welcome) {
    alert("Missing HTML elements. Please check IDs.");
    return;
  }

  selectedCategory = categorySelect.value;
  difficulty = difficultySelect.value;
  maxTime = difficulty === "easy" ? 30 : difficulty === "hard" ? 10 : 20;

  welcome.textContent = `Welcome, ${playerName}! (Difficulty: ${difficulty.toUpperCase()}, Category: ${selectedCategory.toUpperCase()})`;
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameScreen").style.display = "block";
  document.getElementById("digitalTimer").style.display = "block";
  document.getElementById("highScore").textContent = highScore;
  document.getElementById("playerNameDisplay").textContent = playerName;


  if (selectedCategory === "all") {
    remainingImages = [...allImages];
  } else {
    remainingImages = allImages.filter(img => imageData[img] === selectedCategory);
  }

  if (remainingImages.length === 0) {
    alert("No images found for selected category.");
    return;
  }
  console.log("Remaining images:", remainingImages);

  getRandomImage();
}



document.getElementById("currentCategory").textContent = selectedCategory === "all" ? "Mixed" : selectedCategory;

function getRandomImage() {
  if (recentImages.length >= 10) recentImages = [];

  // Filter out recently used images to avoid repetition
  let availableImages = remainingImages.filter(image => !recentImages.includes(image));
  if (availableImages.length === 0) return gameWon();

  // Pick a new image randomly
  let randomIndex = Math.floor(Math.random() * availableImages.length);
  currentImage = availableImages[randomIndex];
  recentImages.push(currentImage);
  if (recentImages.length > 10) recentImages.shift();

  // Display the image
  const silhouette = document.getElementById("silhouette");
  silhouette.src = imageFolder + currentImage;

  // Clear inputs and UI
  document.getElementById("message").textContent = "";
  document.getElementById("guessInput").value = "";
  document.getElementById("guessInput").focus();
  document.getElementById("guessInput").disabled = false;
  document.getElementById("optionsContainer").innerHTML = "";
  document.getElementById("score").textContent = score;
  document.getElementById("attempts").textContent = attempts;

  // Update category label
  document.getElementById("currentCategory").textContent =
    selectedCategory === "all" ? "Mixed" : selectedCategory;

  // Reset attempts and timer
  attempts = 3;
  startTimer();
}


function checkGuess() {
  clearInterval(timerInterval);
  const userGuess = document.getElementById("guessInput").value.trim().toLowerCase();
  const correctAnswer = currentImage.split(".")[0];
  const message = document.getElementById("message");

  if (userGuess === "") {
    message.style.color = "orange";
    message.textContent = "Please enter a guess!";
    return;
  }

  if (userGuess === correctAnswer) {
    score += 10;
    document.getElementById("score").textContent = score;
    message.style.color = "green";
    message.textContent = "Correct! 🎉";

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
      document.getElementById("highScore").textContent = highScore;
    }

    setTimeout(getRandomImage, 1000);
  } else {
    attempts--;
    document.getElementById("attempts").textContent = attempts;
    message.style.color = "red";
    message.textContent = "Wrong guess! Try again.";
    if (attempts === 0) {
      setTimeout(gameOver, 500);
      return;
    }
    startTimer();
  }
}

function showHint() {
  const optionsContainer = document.getElementById("optionsContainer");
  optionsContainer.innerHTML = "";

  const correctAnswer = currentImage.split(".")[0];
  const allAnswers = allImages.map(img => img.split(".")[0]);
  const wrongAnswers = allAnswers.filter(word => word !== correctAnswer);
  const shuffledOptions = [...wrongAnswers.sort(() => 0.5 - Math.random()).slice(0, 3), correctAnswer]
    .sort(() => 0.5 - Math.random());

  document.getElementById("guessInput").disabled = true;

  shuffledOptions.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice.charAt(0).toUpperCase() + choice.slice(1);
    btn.onclick = () => handleOptionClick(choice);
    btn.classList.add("option-button");
    optionsContainer.appendChild(btn);
  });
}

function finishGame() {
  clearInterval(timerInterval); // Stop the timer

  // Submit score to backend
  fetch('http://localhost:5000/score', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    },
    body: JSON.stringify({ score })
  })
  .then(() => {
    // Fetch leaderboard
    return fetch('http://localhost:5000/leaderboard');
  })
  .then(res => res.json())
  .then(data => {
    const leaderboardHTML = data.leaderboard.map((entry, index) => {
      const place = index + 1;
      let trophy = "";
      if (place === 1) trophy = "🥇";
      else if (place === 2) trophy = "🥈";
      else if (place === 3) trophy = "🥉";

      const isCurrentUser = entry.name === localStorage.getItem("playerName");
      const nameDisplay = isCurrentUser
        ? `${localStorage.getItem("avatar") || ""} ${entry.name} 👤`
        : entry.name;

      return `
        <li class="${isCurrentUser ? 'current-user' : ''}">
          <span class="rank">${trophy || place + "."}</span>
          <span class="name">${nameDisplay}</span>
          <span class="score">${entry.score}</span>
        </li>
      `;
    }).join('');

    // Show leaderboard
    document.body.innerHTML = `
      <div class="game-over leaderboard">
        <h1>Game Finished!</h1>
        <p>Your Final Score: ${score}</p>
        <h2>🏆 Leaderboard</h2>
        <ol class="leaderboard-list">${leaderboardHTML}</ol>
        <button onclick="location.reload()">Play Again</button>
      </div>
    `;
  })
  .catch(err => {
    alert("Something went wrong finishing the game.");
    console.error(err);
  });
}

function handleOptionClick(selectedOption) {
  clearInterval(timerInterval);

  // Get the button that was clicked
  const clickedButton = Array.from(document.querySelectorAll('.option-button'))
    .find(btn => btn.textContent.toLowerCase() === selectedOption.toLowerCase());

  if (clickedButton) {
    clickedButton.classList.add("clicked");
    setTimeout(() => {
      clickedButton.classList.remove("clicked");
    }, 300); // duration must match the CSS animation
  }

  document.getElementById("guessInput").value = selectedOption;
  document.getElementById("guessInput").disabled = false;
  document.getElementById("optionsContainer").innerHTML = "";
  checkGuess();
}


function startTimer() {
  clearInterval(timerInterval);
  timeLeft = maxTime;
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      handleTimeout();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const timerDisplay = document.getElementById("digitalTimer");
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;

  if (timeLeft <= 5) {
    timerDisplay.style.backgroundColor = "#e74c3c";
    timerDisplay.classList.add("blinking");
  } else {
    timerDisplay.style.backgroundColor = "#d63031";
    timerDisplay.classList.remove("blinking");
  }
}

function handleTimeout() {
  const message = document.getElementById("message");
  attempts--;
  document.getElementById("attempts").textContent = attempts;
  message.style.color = "orange";
  message.textContent = "⏱ Time's up! You lost an attempt.";
  if (attempts === 0) {
    setTimeout(gameOver, 500);
  } else {
    setTimeout(getRandomImage, 1000);
  }
}

function gameOver() {
  fetch('http://localhost:5000/score', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    },
    body: JSON.stringify({ score })
  }).then(() => fetch('http://localhost:5000/top-scores', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    }
  }))
    .then(res => res.json())
    .then(data => {
      const scoreList = data.scores.map(s => `<li>${s}</li>`).join('');
      document.body.innerHTML = `
        <div class="game-over">
          <h1>Game Over!</h1>
          <p>Final Score: ${score}</p>
          <h2>Your Top 5 Scores</h2>
          <ol>${scoreList}</ol>
          <button onclick="location.reload()">Play Again</button>
        </div>
      `;
    });
}

function showLeaderboard() {
  const playerName = localStorage.getItem("playerName") || "";
  const avatar = localStorage.getItem("avatar") || "";

  fetch('http://localhost:5000/leaderboard')
    .then(res => res.json())
    .then(data => {
      const leaderboardList = document.getElementById("leaderboardList");
      leaderboardList.innerHTML = ""; // Clear existing content

      data.leaderboard.forEach((entry, index) => {
        const place = index + 1;
        let trophy = "";
        if (place === 1) trophy = "🥇";
        else if (place === 2) trophy = "🥈";
        else if (place === 3) trophy = "🥉";

        const isCurrentUser = entry.name === playerName;
        const nameDisplay = isCurrentUser
          ? `${avatar} ${entry.name} 👤`
          : entry.name;

        const li = document.createElement("li");
        li.className = isCurrentUser ? "current-user" : "";
        li.innerHTML = `
          <span class="rank">${trophy || place + "."}</span>
          <span class="name">${nameDisplay}</span>
          <span class="score">${entry.score}</span>
        `;
        leaderboardList.appendChild(li);
      });

      document.getElementById("leaderboardModal").style.display = "flex";
    });
}

function closeLeaderboard() {
  document.getElementById("leaderboardModal").style.display = "none";
}





function gameWon() {
  document.body.innerHTML = `
    <div class="game-over">
      <h1>You Won!</h1>
      <p>Final Score: ${score}</p>
      <p>High Score: ${highScore}</p>
      <button onclick="location.reload()">Play Again</button>
    </div>
  `;
}

function resetHighScore() {
  localStorage.removeItem("highScore");
  highScore = 0;
  document.getElementById("highScore").textContent = highScore;
  alert("High score has been reset!");
}

function confirmAccountDeletion() {
  if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) return;

  fetch('http://localhost:5000/delete-account', {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    }
  }).then(res => {
    if (res.ok) {
      // Show modal and delay redirect
      document.getElementById("deleteSuccessModal").style.display = "flex";
      localStorage.removeItem('authToken');
      localStorage.removeItem('playerName');

      setTimeout(() => {
        window.location.href = 'login.html'; // or 'signup.html' if you prefer
      }, 3000); // 3 seconds delay
    } else {
      alert("Error deleting account.");
    }
  });
}



function resetMyScores() {
  if (!confirm("Reset all your game scores?")) return;

  fetch('http://localhost:5000/reset-scores', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    }
  }).then(res => {
    if (res.ok) {
      alert("Your scores have been reset.");
    } else {
      alert("Failed to reset scores.");
    }
  });
}
