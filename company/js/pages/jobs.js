const API_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", loadJobs);

async function loadJobs() {
  try {
    const res = await fetch(`${API_URL}/jobs?companyId=1`);
    const jobs = await res.json();
    renderJobs(jobs);
  } catch (err) {
    console.error("Error loading jobs:", err);
  }
}

function renderJobs(jobs) {
  const container = document.getElementById("jobs-container");
  const counter = document.getElementById("jobs-count");

  container.innerHTML = "";
  counter.textContent = `${jobs.length} jobs`;

  jobs.forEach(job => {
    const card = document.createElement("div");
    card.className = "bg-background-app p-4 rounded-lg flex justify-between items-center";

    card.innerHTML = `
      <div>
        <p class="font-semibold">${job.title || "Untitled Job"}</p>
        <p class="text-text-muted text-sm">${job.location || "Location N/A"}</p>
        <span class="text-xs ${job.status === "active" ? "text-green-500" : "text-red-500"} font-medium">
          ${job.status || "unknown"}
        </span>
      </div>

      <div class="flex gap-2">
        <button onclick="closeJob(${job.id})"
          class="px-3 py-1 bg-red-600 text-white rounded text-xs">Close</button>

        <button onclick="deleteJob(${job.id})"
          class="px-3 py-1 bg-gray-700 text-white rounded text-xs">Delete</button>
      </div>
    `;

    container.appendChild(card);
  });
}

async function closeJob(id) {
  await fetch(`${API_URL}/jobs/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "closed" })
  });
  loadJobs();
}

async function deleteJob(id) {
  if (!confirm("Delete this job?")) return;
  await fetch(`${API_URL}/jobs/${id}`, { method: "DELETE" });
  loadJobs();
}
