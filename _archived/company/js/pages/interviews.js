const API_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", loadInterviews);

async function loadInterviews() {
  try {
    const res = await fetch(`${API_URL}/interviews?companyId=1`);
    const interviews = await res.json();

    renderInterviews(interviews);
  } catch (err) {
    console.error("Error loading interviews:", err);
  }
}

async function renderInterviews(interviews) {
  const container = document.getElementById("interviews-container");
  const counter = document.getElementById("interview-count");

  container.innerHTML = "";
  counter.textContent = `${interviews.length} interviews`;

  for (const interview of interviews) {
    const candidate = await fetch(`${API_URL}/candidates/${interview.candidateId}`).then(r=>r.json());
    const job = await fetch(`${API_URL}/jobs/${interview.jobId}`).then(r=>r.json());

    const card = document.createElement("div");
    card.className = "bg-background-app p-4 rounded-lg flex justify-between items-center";

    card.innerHTML = `
      <div>
        <p class="font-semibold">${candidate.name || "Unknown Candidate"}</p>
        <p class="text-text-muted text-sm">${job.title || "Unknown Job"}</p>
        <p class="text-xs text-text-muted mt-1">${interview.date} at ${interview.time}</p>
      </div>

      <div class="flex gap-2">
        <button onclick="completeInterview(${interview.id})"
          class="px-3 py-1 bg-green-600 text-white rounded text-xs">Completed</button>

        <button onclick="cancelInterview(${interview.id})"
          class="px-3 py-1 bg-red-600 text-white rounded text-xs">Cancel</button>
      </div>
    `;

    container.appendChild(card);
  }
}

async function completeInterview(id) {
  await fetch(`${API_URL}/interviews/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "completed" })
  });
  loadInterviews();
}

async function cancelInterview(id) {
  await fetch(`${API_URL}/interviews/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "cancelled" })
  });
  loadInterviews();
}
