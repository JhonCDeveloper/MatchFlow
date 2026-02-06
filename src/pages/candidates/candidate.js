const API_URL = "http://localhost:3000";
const local = JSON.parse(localStorage.getItem("user"));

if(!local){
  window.location.href = '../login.html';
}

//Info the user
const nameUser = document.getElementById("nameProfile");
if(nameUser){
  nameUser.textContent = local.name;
}

// ✅ Cargar estado inicial de Open to Work
document.addEventListener("DOMContentLoaded", () => {
  loadOpenToWorkStatus();
  loadJobOffers();
});

//button Home
document.getElementById("btnHome").addEventListener("click", () => {
  document.getElementById("home").scrollIntoView({
    behavior: "smooth"
  });
});
//button offers Work
document.getElementById("btnWork").addEventListener("click", () => {
  document.getElementById("work").scrollIntoView({
    behavior: "smooth"
  });
});
//button Matches
document.getElementById("btnMatches").addEventListener("click", () => {
  document.getElementById("matches").scrollIntoView({
    behavior: "smooth"
  });
});
//button reservations
document.getElementById("btnReservations").addEventListener("click", () => {
  document.getElementById("reservations").scrollIntoView({
    behavior: "smooth"
  });
});


//Evento de toggle para Open to Work
const checkActive = document.getElementById("check");
const containerOfertas = document.querySelector(".container-ofertas");

checkActive.addEventListener("change", async function () {
  const newOpenToWorkStatus = checkActive.checked;
  
  try {
    // ✅ Actualizar el estado de openToWork en la base de datos
    const response = await fetch(`${API_URL}/users/${local.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ openToWork: newOpenToWorkStatus })
    });

    if (!response.ok) {
      throw new Error("Failed to update Open to Work status");
    }

    // ✅ Actualizar localStorage
    const updatedUser = { ...local, openToWork: newOpenToWorkStatus };
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // ✅ Mostrar/cargar ofertas según estado
    if (newOpenToWorkStatus) {
      await loadJobOffers();
      containerOfertas.style.display = "block";
    } else {
      containerOfertas.style.display = "none";
      containerOfertas.innerHTML = "";
    }

    console.log(`Open to Work status updated: ${newOpenToWorkStatus}`);
  } catch (error) {
    console.error("Error updating Open to Work status:", error);
    checkActive.checked = !newOpenToWorkStatus; // Revert toggle on error
    alert("Error updating status. Please try again.");
  }
});

// ✅ NUEVA: Cargar estado de Open to Work
async function loadOpenToWorkStatus() {
  try {
    checkActive.checked = local.openToWork || false;
    if (checkActive.checked) {
      containerOfertas.style.display = "block";
    } else {
      containerOfertas.style.display = "none";
    }
  } catch (error) {
    console.error("Error loading Open to Work status:", error);
  }
}

// ✅ NUEVA: Cargar ofertas reales desde db.json
async function loadJobOffers() {
  try {
    const response = await fetch(`${API_URL}/jobs`);
    const jobs = await response.json();

    containerOfertas.innerHTML = "";

    if (jobs.length === 0) {
      containerOfertas.innerHTML = `<p class="text-muted">No offers available right now.</p>`;
      return;
    }

    jobs.forEach(job => {
      const card = document.createElement("div");
      card.className = "card mb-2";
      card.innerHTML = `
        <div class="card-body d-flex justify-content-between align-items-center">
          <div>
            <h3 class="card-title">${job.title}</h3>
            <p class="card-text">${job.description}</p>
          </div>
          <div>
            <p style="color: #cbd5e1">Company: ${job.companyId}</p>
            <p>Status: ${job.status}</p>
          </div>
          <div>
            <button class="btn btn-bg" onclick="viewJobDetails(${job.id})">See Details</button>
          </div>
        </div>
      `;
      containerOfertas.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading job offers:", error);
    containerOfertas.innerHTML = `<p class="text-danger">Error loading offers.</p>`;
  }
}

// ✅ NUEVA: Ver detalles de una oferta
function viewJobDetails(jobId) {
  alert(`Job Details Modal would open for Job ID: ${jobId}`);
  // TODO: Implement modal to show full job details
}




      

