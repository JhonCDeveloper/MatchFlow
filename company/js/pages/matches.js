const API_URL = "http://localhost:3000";
const STATES = ["pending", "contacted", "interview", "hired", "rejected"];

document.addEventListener("DOMContentLoaded", () => {
  loadMatches();
});

/* ===============================
   🔄 Cargar todos los matches
================================= */
async function loadMatches() {
  try {
    const res = await fetch(`${API_URL}/matches?companyId=1`);
    const matches = await res.json();

    renderPipeline(matches);
  } catch (error) {
    console.error("Error loading matches:", error);
  }
}

/* ===============================
   🧱 Construir columnas del pipeline
================================= */
function renderPipeline(matches) {
  const container = document.getElementById("pipeline-container");
  container.innerHTML = "";

  STATES.forEach(state => {
    const column = document.createElement("div");
    column.className = "bg-background-card p-4 rounded-xl shadow-card min-h-[200px]";

    column.innerHTML = `
      <h4 class="font-semibold mb-4 capitalize flex justify-between items-center">
        ${state}
        <span class="text-xs text-text-muted" id="count-${state}">0</span>
      </h4>
      <div class="space-y-3" id="column-${state}"></div>
    `;

    container.appendChild(column);
  });

  matches.forEach(match => renderMatchCard(match));
}

/* ===============================
   👤 Render tarjeta de match
================================= */
async function renderMatchCard(match) {
  try {
    const column = document.getElementById(`column-${match.status}`);
    const counter = document.getElementById(`count-${match.status}`);

    const candidate = await fetch(`${API_URL}/candidates/${match.candidateId}`).then(r => r.json());
    const job = await fetch(`${API_URL}/jobs/${match.jobId}`).then(r => r.json());

    const candidateName = candidate.name || candidate.fullName || "Unknown Candidate";
    const jobTitle = job.title || job.position || "Unknown Job";

    const card = document.createElement("div");
    card.className = "bg-background-app p-3 rounded-lg shadow-sm";

    card.innerHTML = `
      <p class="font-semibold">${candidateName}</p>
      <p class="text-text-muted text-sm">${jobTitle}</p>

      <div class="flex gap-2 mt-3 flex-wrap">
        ${getActions(match)}
      </div>
    `;

    column.appendChild(card);
    counter.textContent = Number(counter.textContent) + 1;

  } catch (error) {
    console.error("Error rendering match:", error);
  }
}


/* ===============================
   🎯 Botones según estado
================================= */
function getActions(match) {
  switch (match.status) {
    case "pending":
      return `
        <button onclick="updateMatch(${match.id}, 'contacted')" 
          class="px-2 py-1 bg-brand text-white rounded text-xs hover:opacity-90">
          Contact
        </button>
      `;

    case "contacted":
      return `
        <button onclick="updateMatch(${match.id}, 'interview')" 
          class="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:opacity-90">
          Schedule Interview
        </button>
      `;

    case "interview":
      return `
        <button onclick="updateMatch(${match.id}, 'hired')" 
          class="px-2 py-1 bg-green-600 text-white rounded text-xs hover:opacity-90">
          Hire
        </button>
        <button onclick="updateMatch(${match.id}, 'rejected')" 
          class="px-2 py-1 bg-red-600 text-white rounded text-xs hover:opacity-90">
          Reject
        </button>
      `;

    default:
      return `<span class="text-xs text-text-muted">No actions</span>`;
  }
}

/* ===============================
   🔄 Actualizar estado del match
================================= */
async function updateMatch(matchId, newStatus) {
  try {
    await fetch(`${API_URL}/matches/${matchId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    });

    loadMatches(); // Recargar pipeline
  } catch (error) {
    console.error("Error updating match:", error);
  }
}
