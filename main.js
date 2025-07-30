// ✅ Main.js loaded
console.log("✅ main.js loaded!");

// 🏋️ Fetch workouts and show in console
async function fetchWorkouts() {
  try {
    const res = await fetch("/workout/all");
    const data = await res.json();
    console.log("📦 Workouts:", data);

    // You can later render these in HTML
  } catch (err) {
    console.error("❌ Error fetching workouts", err);
  }
}

// 💪 Fetch metrics and show in console
async function fetchMetrics() {
  try {
    const res = await fetch("/metrics/all");
    const data = await res.json();
    console.log("📊 Metrics:", data);

    // You can later render these in HTML
  } catch (err) {
    console.error("❌ Error fetching metrics", err);
  }
}

// Automatically fetch data on dashboard pages
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  if (path.includes("workout.html")) {
    fetchWorkouts();
  }

  if (path.includes("metrics.html")) {
    fetchMetrics();
  }



});

// === Modal Popup Handling ===
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = "block";
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = "none";
}

// Close modal when clicking outside
window.addEventListener("click", (e) => {
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
});

