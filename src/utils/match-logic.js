const API_URL = window.API_URL;

// =======================
// MATCHES (SERVICIOS)
// =======================

async function createMatch(companyId, jobId, candidateId) {
  try {
    // 1) Reservas activas del candidato
    const existingReservations = await fetch(
      `${API_URL}/reservations?candidateId=${candidateId}&isActive=true`,
    ).then((r) => r.json());

    const otherCompanyReservation = existingReservations.find(
      (res) => String(res.companyId) !== String(companyId),
    );

    if (otherCompanyReservation) {
      alert("Este candidato ya está reservado por otra empresa");
      return null;
    }

    // 2) Validar que el candidato exista y esté OpenToWork
    const candidate = await fetch(`${API_URL}/users/${candidateId}`).then((r) =>
      r.json(),
    );

    if (!candidate || candidate.role !== "candidate") {
      alert("El usuario seleccionado no es un candidato válido");
      return null;
    }

    if (candidate.openToWork !== true) {
      alert("Este candidato no está disponible (OpenToWork inactivo)");
      return null;
    }

    // 3) Evitar duplicados
    const existingMatches = await fetch(
      `${API_URL}/matches?companyId=${companyId}&jobId=${jobId}&candidateId=${candidateId}`,
    ).then((r) => r.json());

    if (existingMatches.length > 0) {
      alert("Ya existe un match para esta empresa, oferta y candidato");
      return existingMatches[0];
    }

    // 4) Crear match
    const match = {
      companyId: String(companyId),
      jobId: String(jobId),
      candidateId: String(candidateId),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const response = await fetch(`${API_URL}/matches`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(match),
    });

    const createdMatch = await response.json();

    // 5) Crear reserva automáticamente
    await createReservation(companyId, jobId, candidateId);

    return createdMatch;
  } catch (error) {
    console.error("Error creating match:", error);
    return null;
  }
}

async function updateMatchStatus(matchId, newStatus) {
  try {
    const validStatuses = [
      "pending",
      "contacted",
      "interview",
      "hired",
      "discarded",
    ];

    if (!validStatuses.includes(newStatus)) {
      console.error("Estado inválido:", newStatus);
      return null;
    }

    const match = await fetch(`${API_URL}/matches/${matchId}`).then((r) =>
      r.json(),
    );

    const statusFlow = {
      pending: ["contacted", "discarded"],
      contacted: ["interview", "discarded"],
      interview: ["hired", "discarded"],
      hired: [],
      discarded: [],
    };

    const allowedNextStatuses = statusFlow[match.status] || [];

    if (!allowedNextStatuses.includes(newStatus)) {
      console.error(`No se puede cambiar de ${match.status} a ${newStatus}`);
      return null;
    }

    const response = await fetch(`${API_URL}/matches/${matchId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    const updatedMatch = await response.json();

    // liberar reserva si termina
    if (newStatus === "discarded" || newStatus === "hired") {
      await releaseReservation(match.companyId, match.jobId, match.candidateId);
    }

    return updatedMatch;
  } catch (error) {
    console.error("Error updating match status:", error);
    return null;
  }
}

async function getCompanyMatches(companyId) {
  try {
    const response = await fetch(`${API_URL}/matches?companyId=${companyId}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching company matches:", error);
    return [];
  }
}

async function getJobMatches(jobId) {
  try {
    const response = await fetch(`${API_URL}/matches?jobId=${jobId}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching job matches:", error);
    return [];
  }
}

// =======================
// RESERVAS (SERVICIOS)
// =======================

async function createReservation(companyId, jobId, candidateId) {
  try {
    const existingReservations = await fetch(
      `${API_URL}/reservations?candidateId=${candidateId}&isActive=true`,
    ).then((r) => r.json());

    const otherCompanyReservation = existingReservations.find(
      (res) => String(res.companyId) !== String(companyId),
    );

    if (otherCompanyReservation) return null;

    const myReservation = existingReservations.find(
      (res) =>
        String(res.companyId) === String(companyId) &&
        String(res.jobId) === String(jobId),
    );

    if (myReservation) return myReservation;

    const reservation = {
      companyId: String(companyId),
      jobId: String(jobId),
      candidateId: String(candidateId),
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    const response = await fetch(`${API_URL}/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reservation),
    });

    return await response.json();
  } catch (error) {
    console.error("Error creating reservation:", error);
    return null;
  }
}

async function releaseReservation(companyId, jobId, candidateId) {
  try {
    const reservations = await fetch(
      `${API_URL}/reservations?companyId=${companyId}&jobId=${jobId}&candidateId=${candidateId}&isActive=true`,
    ).then((r) => r.json());

    if (reservations.length === 0) return null;

    const reservation = reservations[0];

    const response = await fetch(`${API_URL}/reservations/${reservation.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: false }),
    });

    return await response.json();
  } catch (error) {
    console.error("Error releasing reservation:", error);
    return null;
  }
}

async function checkCandidateReservation(candidateId) {
  try {
    const reservations = await fetch(
      `${API_URL}/reservations?candidateId=${candidateId}&isActive=true`,
    ).then((r) => r.json());

    return reservations.length > 0 ? reservations[0] : null;
  } catch (error) {
    console.error("Error checking reservation:", error);
    return null;
  }
}

async function getCompanyReservations(companyId) {
  try {
    const response = await fetch(
      `${API_URL}/reservations?companyId=${companyId}&isActive=true`,
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching company reservations:", error);
    return [];
  }
}
