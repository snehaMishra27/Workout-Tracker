
document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("themeToggle");
    const savedTheme = localStorage.getItem("theme");

    // ✅ Apply theme on load
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
      if (toggle) toggle.checked = true;
    } else {
      document.body.classList.remove("dark-mode");
    }
    if (toggle) {
      toggle.checked = savedTheme === "dark";

      toggle.addEventListener("change", () => {
        if (toggle.checked) {
          document.body.classList.add("dark-mode");
          localStorage.setItem("theme", "dark");
        } else {
          document.body.classList.remove("dark-mode");
          localStorage.setItem("theme", "light");
        }
      });
    }

  
  
  
  // === Toast Function ===
  function showToast(message, duration = 3000) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 100);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 500);
    }, duration);
  }

  // === Toast on Form Submit ===
  const forms = document.querySelectorAll("form");
  forms.forEach(form => {
    form.addEventListener("submit", () => {
      setTimeout(() => {
        showToast("✅ Submitted successfully!");
      }, 100);
    });
  });

  // === BMI Calculator ===
  const bmiBtn = document.getElementById("calculateBMI");
  if (bmiBtn) {
    bmiBtn.addEventListener("click", () => {
      const heightInput = document.getElementById("height");
      const weightInput = document.getElementById("weight");
      const bmiResult = document.getElementById("bmiResult");

      if (!heightInput || !weightInput || !bmiResult) return;

      const height = parseFloat(heightInput.value) / 100;
      const weight = parseFloat(weightInput.value);

      if (height && weight) {
        const bmi = (weight / (height * height)).toFixed(1);
        bmiResult.textContent = `Your BMI is ${bmi}`;
        showToast(`💪 BMI Calculated: ${bmi}`);
      } else {
        showToast("❗ Please enter valid height and weight");
      }
    });
  }

  // === Chart: Workout Bar Chart ===
  const workoutCanvas = document.getElementById("workoutChart");
  if (workoutCanvas) {
    fetch("/dashboard/chart-data", { credentials: "include" })
      .then(res => res.json())
      .then(({ labels, data }) => {
        new Chart(workoutCanvas, {
          type: "bar",
          data: {
            labels: labels,
            datasets: [{
              label: "Workout Duration (min)",
              data: data,
              backgroundColor: "#6c63ff",
              borderRadius: 12
            }]
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: "Workout Duration (Last 7 Days)"
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: { stepSize: 10 }
              }
            }
          }
        });
      })
      .catch(err => {
        console.error("❌ Chart Data Error:", err);
      });
  }

  // === Dashboard Summary Cards ===
  fetch("/dashboard/summary", { credentials: "include" })
    .then((res) => {
      if (res.status === 401) {
        window.location.href = "/login.html";
        throw new Error("Unauthorized – redirecting to login");
      }
      if (!res.ok) throw new Error("Dashboard load failed");
      return res.json();
    })
    .then((data) => {
      const caloriesVal = document.getElementById("caloriesValue");
      const sleepVal = document.getElementById("sleepValue");
      const workoutCount = document.getElementById("workoutCount");
      const goalBar = document.getElementById("goalProgressBar");

      if (caloriesVal) caloriesVal.innerText = `${data.caloriesBurned} kcal`;
      if (sleepVal) sleepVal.innerText = `${data.avgSleep.toFixed(1)} hrs`;
      if (workoutCount) workoutCount.innerText = data.workoutCount;
      if (goalBar) goalBar.style.width = `${data.goalProgress}%`;
    })
    .catch((err) => {
      console.error("❌ Dashboard Load Failed:", err);
    });

  // === Health Metrics Chart (Line Graph) ===
  const metricsCanvas = document.getElementById("metricsChart2");
  if (metricsCanvas) {
    fetch("/dashboard/metrics-trend", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        new Chart(metricsCanvas, {
          type: "line",
          data: {
            labels: data.labels,
            datasets: [
              {
                label: "Weight (kg)",
                data: data.weightData,
                borderColor: "#00c9a7",
                backgroundColor: "rgba(0,201,167,0.2)",
                tension: 0.4,
                fill: true
              },
              {
                label: "Heart Rate (bpm)",
                data: data.heartRateData,
                borderColor: "#ff6b6b",
                backgroundColor: "rgba(255,107,107,0.2)",
                tension: 0.4,
                fill: true,
                spanGaps: true
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: "Health Metrics Over Time (Last 4 Weeks)"
              }
            },
            scales: {
              y: { beginAtZero: false }
            }
          }
        });
      })
      .catch(err => {
        console.error("❌ Metrics Trend Chart Error:", err);
      });
  }

  // === Weekly Goals Section ===
  fetch("/dashboard/weekly-goals", { credentials: "include" })
    .then(res => res.json())
    .then(data => {
      const goalDivs = document.querySelectorAll("#goals .goal");
      if (goalDivs.length >= 2) {
        const workoutLabel = goalDivs[0].querySelector("label");
        const workoutBar = goalDivs[0].querySelector(".progress-bar");
        const sleepLabel = goalDivs[1].querySelector("label");
        const sleepBar = goalDivs[1].querySelector(".progress-bar");

        if (workoutLabel) workoutLabel.innerText = `💪 Workouts (${data.totalWorkoutDays}/5)`;
        if (workoutBar) workoutBar.style.width = `${data.workoutProgress}%`;

        if (sleepLabel) sleepLabel.innerText = `💤 Sleep (${data.sleepDays}/7 days)`;
        if (sleepBar) sleepBar.style.width = `${data.sleepProgress}%`;
      }
    })
    .catch(err => {
      console.error("❌ Weekly Goals Load Error:", err);
    });

  console.log("✅ dashboard.js loaded successfully!");
});
