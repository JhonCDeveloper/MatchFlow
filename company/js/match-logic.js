const API_URL = "http://localhost:3000";


// MATCHES


/**
 * Crear un nuevo match (solo empresas)
 * Un match asocia: empresa + oferta + candidato
 */
async function createMatch(companyId, jobId, candidateId) {
  try {
    // Validar que el candidato no esté ya reservado por otra empresa para otra oferta
    const existingReservations = await fetch(`${API_URL}/reservations?candidateId=${candidateId}&isActive=true`).then(r => r.json());

    // Verificar si hay reserva activa de OTRA empresa
    const otherCompanyReservation = existingReservations.find(
      res => res.companyId !== companyId
    );

    if (otherCompanyReservation) {
      alert("Este candidato ya está reservado por otra empresa");
      return null;
    }

    // Validar que el candidato esté disponible (Open to Work)
    const candidate = await fetch(`${API_URL}/candidates/${candidateId}`).then(r => r.json());
    if (!candidate || candidate.openToWork !== true) {
      alert("Este candidato no está disponible (Open to Work inactivo)");
      return null;
    }

    // Evitar matches duplicados para la misma empresa + oferta + candidato
    const existingMatches = await fetch(`${API_URL}/matches?companyId=${companyId}&jobId=${jobId}&candidateId=${candidateId}`).then(r => r.json());
    if (existingMatches.length > 0) {
      alert("Ya existe un match para esta empresa, oferta y candidato");
      return existingMatches[0];
    }

    // Crear el match con estado inicial "pending"
    const match = {
      companyId: companyId,
      jobId: jobId,
      candidateId: candidateId,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    const response = await fetch(`${API_URL}/matches`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(match)
    });

    const createdMatch = await response.json();

    // Automáticamente crear la reserva
    await createReservation(companyId, jobId, candidateId);

    return createdMatch;

  } catch (error) {
    console.error("Error creating match:", error);
    return null;
  }
}

/**
 * Actualizar el estado de un match
 * Flujo secuencial: pending → contacted → interview → hired/discarded
 */
async function updateMatchStatus(matchId, newStatus) {
  try {
    // Validar que el estado sea válido
    const validStatuses = ["pending", "contacted", "interview", "hired", "discarded"];

    if (!validStatuses.includes(newStatus)) {
      console.error("Estado inválido:", newStatus);
      return null;
    }

    // Obtener el match actual
    const match = await fetch(`${API_URL}/matches/${matchId}`).then(r => r.json());

    // Validar transición de estado (flujo secuencial)
    const statusFlow = {
      "pending": ["contacted", "discarded"],
      "contacted": ["interview", "discarded"],
      "interview": ["hired", "discarded"],
      "hired": [],
      "discarded": []
    };

    const allowedNextStatuses = statusFlow[match.status];

    if (!allowedNextStatuses.includes(newStatus)) {
      console.error(`No se puede cambiar de ${match.status} a ${newStatus}`);
      return null;
    }

    // Actualizar el estado
    const response = await fetch(`${API_URL}/matches/${matchId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    });

    const updatedMatch = await response.json();

    // Si el match pasa a "discarded" o "hired", liberar la reserva
    if (newStatus === "discarded" || newStatus === "hired") {
      await releaseReservation(match.companyId, match.jobId, match.candidateId);
    }

    return updatedMatch;

  } catch (error) {
    console.error("Error updating match status:", error);
    return null;
  }
}

/**
 * Obtener todos los matches de una empresa
 */
async function getCompanyMatches(companyId) {
  try {
    const response = await fetch(`${API_URL}/matches?companyId=${companyId}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching company matches:", error);
    return [];
  }
}

/**
 * Obtener matches de una oferta específica
 */
async function getJobMatches(jobId) {
  try {
    const response = await fetch(`${API_URL}/matches?jobId=${jobId}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching job matches:", error);
    return [];
  }
}


// LÓGICA DE RESERVAS


/**
 * Crear una reserva de candidato para una oferta
 * Bloquea al candidato para que no pueda ser reservado por otras empresas
 */
async function createReservation(companyId, jobId, candidateId) {
  try {
    // Verificar si ya existe una reserva activa de OTRA empresa
    const existingReservations = await fetch(
      `${API_URL}/reservations?candidateId=${candidateId}&isActive=true`
    ).then(r => r.json());

    const otherCompanyReservation = existingReservations.find(
      res => res.companyId !== companyId
    );

    if (otherCompanyReservation) {
      console.error("Candidato ya reservado por otra empresa");
      return null;
    }

    // Verificar si esta empresa ya tiene una reserva activa para este candidato y oferta
    const myReservation = existingReservations.find(
      res => res.companyId === companyId && res.jobId === jobId
    );

    if (myReservation) {
      console.log("Ya existe una reserva activa para esta combinación");
      return myReservation;
    }

    // Crear nueva reserva
    const reservation = {
      companyId: companyId,
      jobId: jobId,
      candidateId: candidateId,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    const response = await fetch(`${API_URL}/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reservation)
    });

    return await response.json();

  } catch (error) {
    console.error("Error creating reservation:", error);
    return null;
  }
}

/**
 * Liberar una reserva (desbloquear candidato)
 */
async function releaseReservation(companyId, jobId, candidateId) {
  try {
    // Buscar la reserva activa
    const reservations = await fetch(
      `${API_URL}/reservations?companyId=${companyId}&jobId=${jobId}&candidateId=${candidateId}&isActive=true`
    ).then(r => r.json());

    if (reservations.length === 0) {
      console.log("No hay reserva activa para liberar");
      return null;
    }

    const reservation = reservations[0];

    // Marcar la reserva como inactiva
    const response = await fetch(`${API_URL}/reservations/${reservation.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: false })
    });

    return await response.json();

  } catch (error) {
    console.error("Error releasing reservation:", error);
    return null;
  }
}

/**
 * Verificar si un candidato está reservado
 * Retorna: null si está libre, o el objeto de la reserva activa
 */
async function checkCandidateReservation(candidateId) {
  try {
    const reservations = await fetch(
      `${API_URL}/reservations?candidateId=${candidateId}&isActive=true`
    ).then(r => r.json());

    return reservations.length > 0 ? reservations[0] : null;

  } catch (error) {
    console.error("Error checking reservation:", error);
    return null;
  }
}

/**
 * Obtener todas las reservas activas de una empresa
 */
async function getCompanyReservations(companyId) {
  try {
    const response = await fetch(
      `${API_URL}/reservations?companyId=${companyId}&isActive=true`
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching company reservations:", error);
    return [];
  }
}



async function renderMatches(companyId) {
  const matches = await getCompanyMatches(companyId);
  const container = document.getElementById("matches-list");

  if (!container) return;

  container.innerHTML = "";

  if (matches.length === 0) {
    container.innerHTML = '<p class="text-text-muted">No hay matches todavía</p>';
    return;
  }

  // Obtener información adicional de candidatos y jobs
  const candidates = await fetch(`${API_URL}/candidates`).then(r => r.json());
  const jobs = await fetch(`${API_URL}/jobs`).then(r => r.json());

  matches.forEach(match => {
    const candidate = candidates.find(c => c.id === match.candidateId);
    const job = jobs.find(j => j.id === match.jobId);

    if (!candidate || !job) return;

    const matchCard = document.createElement("div");
    matchCard.className = "bg-background-app p-4 rounded-lg";

    // Color según estado
    const statusColors = {
      "pending": "text-gray-400",
      "contacted": "text-blue-400",
      "interview": "text-yellow-400",
      "hired": "text-green-400",
      "discarded": "text-red-400"
    };

    matchCard.innerHTML = `
      <div class="flex justify-between items-center">
        <div>
          <p class="font-medium">${candidate.name}</p>
          <p class="text-text-muted text-sm">${job.title}</p>
          <p class="${statusColors[match.status]} text-sm font-medium mt-1">
            ${match.status.toUpperCase()}
          </p>
        </div>
        <div class="flex gap-2">
          ${getMatchActionButtons(match)}
        </div>
      </div>
    `;

    container.appendChild(matchCard);
  });
}

/**
 * Generar botones de acción según el estado del match
 */
function getMatchActionButtons(match) {
  const buttons = [];

  // Flujo: pending → contacted → interview → hired/discarded
  if (match.status === "pending") {
    buttons.push(`
      <button onclick="advanceMatch(${match.id}, 'contacted')" 
        class="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm">
        Contactar
      </button>
    `);
  }

  if (match.status === "contacted") {
    buttons.push(`
      <button onclick="advanceMatch(${match.id}, 'interview')" 
        class="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-sm">
        Agendar Entrevista
      </button>
    `);
  }

  if (match.status === "interview") {
    buttons.push(`
      <button onclick="advanceMatch(${match.id}, 'hired')" 
        class="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm">
        Contratar
      </button>
    `);
  }

  // Botón descartar disponible en pending, contacted, interview
  if (["pending", "contacted", "interview"].includes(match.status)) {
    buttons.push(`
      <button onclick="advanceMatch(${match.id}, 'discarded')" 
        class="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm">
        Descartar
      </button>
    `);
  }

  return buttons.join("");
}

/**
 * Avanzar el estado de un match
 */
async function advanceMatch(matchId, newStatus) {
  const updated = await updateMatchStatus(matchId, newStatus);

  if (updated) {
    // Recargar la vista
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      renderMatches(user.id);
    }
  }
}

/**
 * Crear un nuevo match desde la UI
 */
async function createNewMatch(jobId, candidateId) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("No hay usuario logueado");
    return;
  }

  const match = await createMatch(user.id, jobId, candidateId);

  if (match) {
    alert("Match creado exitosamente");
    renderMatches(user.id);
  } else {
    alert("No se pudo crear el match. Revisa la consola del navegador y asegúrate de que el servidor (json-server) esté corriendo en http://localhost:3000");
  }
}

/**
 * Mostrar indicador visual si un candidato está reservado
 */
async function showReservationStatus(candidateId) {
  const reservation = await checkCandidateReservation(candidateId);

  const statusElement = document.getElementById(`reservation-status-${candidateId}`);

  if (!statusElement) return;

  if (reservation) {
    const companies = await fetch(`${API_URL}/companies`).then(r => r.json());
    const company = companies.find(c => c.id === reservation.companyId);

    statusElement.innerHTML = `
      <span class="text-red-400 text-xs">
        Reservado por ${company ? company.name : "otra empresa"}
      </span>
    `;
  } else {
    statusElement.innerHTML = `
      <span class="text-green-400 text-xs">
        ✓ Disponible
      </span>
    `;
  }
}
