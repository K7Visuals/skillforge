let score = 0, currentQ = 0, lives = 3, player = "", avatar = "";
const leaderboard = [];

// Avatar options
const maleAvatars = [
  "https://api.dicebear.com/7.x/adventurer/png?seed=1",
  "https://api.dicebear.com/7.x/adventurer/png?seed=2",
  "https://api.dicebear.com/7.x/adventurer/png?seed=3",
  "https://api.dicebear.com/7.x/adventurer/png?seed=4"
];

const femaleAvatars = [
  "https://api.dicebear.com/7.x/adventurer/png?seed=5",
  "https://api.dicebear.com/7.x/adventurer/png?seed=6",
  "https://api.dicebear.com/7.x/adventurer/png?seed=7",
  "https://api.dicebear.com/7.x/adventurer/png?seed=8"
];

// Gender change → Show avatars
document.getElementById("gender").addEventListener("change", e => {
  const cont = document.getElementById("avatarContainer");
  cont.innerHTML = "";

  if (e.target.value === "male") {
    maleAvatars.forEach(url => addAvatar(url, cont));
  } else if (e.target.value === "female") {
    femaleAvatars.forEach(url => addAvatar(url, cont));
  }
});

// Add avatar selection
function addAvatar(url, cont) {
  let img = document.createElement("img");
  img.src = url;
  img.onclick = () => {
    document.querySelectorAll(".avatars img").forEach(i => i.classList.remove("selected"));
    img.classList.add("selected");
    avatar = url;
  };
  cont.appendChild(img);
}

// Questions
const questions = [
  { q: "Which one best describes the Money Measurement Concept?", options: { A: "All transactions recorded", B: "Only money-measurable transactions recorded", C: "Only historic cost", D: "Must convert currency" }, correct: "B" },
  { q: "Revenue recognition for annual subscription ₹1,20,000?", options: { A: "All immediately", B: "₹10,000 monthly", C: "Capital contribution", D: "Loan" }, correct: "B" },
  { q: "₹16,000 wages for installing machine?", options: { A: "Expense", B: "Capitalised with machine", C: "Drawings", D: "Prepaid" }, correct: "B" },
  { q: "Periodic inventory system means?", options: { A: "Continuous update", B: "By physical count at intervals", C: "No physical count", D: "Capitalise purchases" }, correct: "B" },
  { q: "Provision vs contingent liability?", options: { A: "Provision recognised, contingent disclosed", B: "Reverse", C: "Same", D: "Provision always larger" }, correct: "A" },
  { q: "Which increases cash book balance?", options: { A: "Insurance premium", B: "Subsidy credited by bank", C: "Stale cheque", D: "Under-cast ₹350" }, correct: "B" },
  { q: "Closing inventory (gross profit method) value?", options: { A: "₹4,80,000", B: "₹5,25,000", C: "₹5,50,000", D: "₹6,00,000" }, correct: "B" },
  { q: "Depreciation @10% on ₹2,00,000?", options: { A: "₹10,000", B: "₹20,000", C: "₹25,000", D: "₹40,000" }, correct: "B" },
  { q: "Bonus issue 2 for 5 on 6,75,000 shares?", options: { A: "1,35,000", B: "2,70,000", C: "3,37,500", D: "6,75,000" }, correct: "B" },
  { q: "When recognise dividend income?", options: { A: "When received", B: "When declared", C: "Year-end", D: "Purchase date" }, correct: "B" },
  { q: "Kabir pays immediately?", options: { A: "₹2,000", B: "₹2,240", C: "₹8,000", D: "₹10,240" }, correct: "B" },
  { q: "P’s goodwill share absorbed by Q?", options: { A: "₹2,500", B: "₹5,000", C: "₹7,500", D: "₹10,000" }, correct: "A" },
];

// Page handling
function showPage(id) {
  document.querySelectorAll(".page").forEach(p =>
    p.classList.remove("active", "bg1", "bg2", "bg3", "bg4", "bg5", "bg6", "bg7", "bg8", "bg9", "bg10", "bg11", "bg12")
  );
  document.getElementById(id).classList.add("active");
  document.getElementById("hud").classList.toggle("active", id === "quizPage");
}

// Start quiz
function startQuiz() {
  player = document.getElementById("playerName").value.trim();
  if (!player || !document.getElementById("playerEmail").value || !document.getElementById("playerPass").value || !avatar) {
    alert("Fill all fields");
    return;
  }

  score = 0;
  currentQ = 0;
  lives = 3;
  document.getElementById("hearts").innerHTML =
    "<i class='bx bxs-heart'></i><i class='bx bxs-heart'></i><i class='bx bxs-heart'></i>";

  showPage("quizPage");
  loadQuestion();
}

// Progress chart
let ctx = document.getElementById("progressChart").getContext("2d");
let progressChart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["Completed", "Remaining"],
    datasets: [{ data: [0, 100], backgroundColor: ["#00ffcc", "#444"] }]
  },
  options: {
    plugins: { legend: { display: false } },
    cutout: "70%"
  }
});

// Load question
function loadQuestion() {
  if (currentQ >= questions.length) { endQuiz(); return; }

  const q = questions[currentQ];
  const qp = document.getElementById("quizPage");

  qp.classList.add("bg" + (currentQ + 1));
  document.getElementById("question-number").innerText = `Q ${currentQ + 1}/${questions.length}`;
  document.getElementById("question").innerText = q.q;

  const opt = document.getElementById("options");
  opt.innerHTML = "";
  for (let k in q.options) {
    let b = document.createElement("button");
    b.innerText = `${k}) ${q.options[k]}`;
    b.onclick = () => checkAnswer(b, k);
    opt.appendChild(b);
  }

  document.getElementById("explanation").style.display = "none";

  let percent = Math.round((currentQ / questions.length) * 100);
  progressChart.data.datasets[0].data = [percent, 100 - percent];
  progressChart.update();
  document.getElementById("chartPercent").innerText = percent + "%";
}

// Check answer
function checkAnswer(btn, opt) {
  const q = questions[currentQ];
  if (opt === q.correct) {
    btn.classList.add("correct");
    score++;
  } else {
    btn.classList.add("wrong");
    lives--;
    updateHearts();
  }

  // Disable all options after selection
  document.querySelectorAll("#options button").forEach(b => b.disabled = true);
}

// Next question
function nextQ() {
  currentQ++;
  if (lives <= 0 || currentQ >= questions.length) { endQuiz(); return; }
  loadQuestion();
}

// Update lives
function updateHearts() {
  document.getElementById("hearts").innerHTML =
    "<i class='bx bxs-heart'></i>".repeat(lives);
}

// End quiz
function endQuiz() {
  document.getElementById("finalScore").innerText = `${player}'s Score: ${score}`;

  // Appreciation logic
  let percent = Math.round((score / questions.length) * 100);
  let msg = "";
  if (percent >= 90) msg = "Excellent! 🎉";
  else if (percent >= 70) msg = "Great job! 👍";
  else if (percent >= 50) msg = "Good effort! 🙂";
  else msg = "Keep trying! 💪";

  document.getElementById("appreciation").innerText = msg;

  leaderboard.push({ player, score });
  leaderboard.sort((a, b) => b.score - a.score);

  document.getElementById("leaderboard").innerHTML =
    leaderboard.map(l => `<li>${l.player} - ${l.score}</li>`).join("");

  showPage("scorePage");
}
