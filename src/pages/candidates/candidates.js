const API_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
  loadCandidates();
  setupSearch();
});

/* ===============================
   🔍 Cargar candidatos disponibles
================================= */
async function loadCandidates(filters = {}) {
  try {
    let url = `${API_URL}/candidates?openToWork=true`;

    const res = await fetch(url);
    let candidates = await res.json();

    // Filtros frontend
    if (filters.role) {
      candidates = candidates.filter(c =>
        c.role.toLowerCase().includes(filters.role.toLowerCase())
      );
    }

    if (filters.location) {
      candidates = candidates.filter(c =>
        c.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    renderCandidates(candidates);

  } catch (error) {
    console.error("Error loading candidates:", error);
  }
}

/* ===============================
   🧱 Renderizar tarjetas
================================= */
function renderCandidates(candidates) {
  const container = document.getElementById("candidates-container");
  const counter = document.getElementById("candidates-count");

  container.innerHTML = "";
  counter.textContent = `${candidates.length} candidates found`;

  if (candidates.length === 0) {
    container.innerHTML = `<div class="text-text-muted text-sm">No candidates match your filters.</div>`;
    return;
  }

  candidates.forEach(candidate => {
    const name = candidate.name || candidate.fullName || "N/A";
    const role = candidate.role || candidate.profession || "N/A";
    const location = candidate.location || candidate.city || "N/A";

    const card = document.createElement("div");
    card.className = "bg-background-app p-4 rounded-lg flex justify-between items-center";

    card.innerHTML = `
      <div>
        <p class="font-semibold">${name}</p>
        <p class="text-text-muted text-sm">${role} • ${location}</p>
        <span class="text-green-500 text-xs font-medium mt-1 inline-block">
          Open to Work
        </span>
      </div>

      <div class="flex gap-2">
        <button onclick="viewCandidate(${candidate.id})"
          class="px-3 py-1 bg-background-card rounded text-sm">
          View Profile
        </button>

        <button onclick="createMatch(${candidate.id})"
          class="px-3 py-1 bg-brand text-white rounded text-sm">
          Create Match
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

/* ===============================
   🔎 Configurar búsqueda
================================= */
function setupSearch() {
  document.getElementById("btn-search").addEventListener("click", () => {
    const role = document.getElementById("filter-role").value.trim();
    const location = document.getElementById("filter-location").value.trim();

    loadCandidates({ role, location });
  });
}

/* ===============================
   👁 Ver perfil (placeholder)
================================= */
function viewCandidate(id) {
  alert("Open candidate profile modal here → Candidate ID: " + id);
}

/* ===============================
   🤝 Crear Match
================================= */
function createMatch(candidateId) {
  const jobId = prompt("Enter Job ID to match with:");

  if (!jobId) return;

  fetch(`${API_URL}/matches`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      companyId: 1,
      jobId: Number(jobId),
      candidateId: candidateId,
      status: "pending"
    })
  })
  .then(() => {
    alert("Match created successfully!");
  })
  .catch(err => console.error("Error creating match:", err));
}
