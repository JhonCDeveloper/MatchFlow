const API_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    console.warn("No user found in localStorage");
    return;
  }

  loadMetrics(user.id);
});

async function loadMetrics(companyId) {
  try {
    const [jobsRes, applicationsRes, interviewsRes] = await Promise.all([
      fetch(`${API_URL}/jobs?companyId=${companyId}`),
      fetch(`${API_URL}/applications`),
      fetch(`${API_URL}/interviews?companyId=${companyId}&status=scheduled`)
    ]);

    const jobs = await jobsRes.json();
    const applications = await applicationsRes.json();
    const interviews = await interviewsRes.json();

    // Jobs
    const jobsEl = document.getElementById("metric-jobs");
    if (jobsEl) jobsEl.textContent = jobs.length;

    // Applicants
    const jobIds = jobs.map(job => job.id);
    const companyApplications = applications.filter(app =>
      jobIds.includes(app.jobId)
    );

    renderJobs(jobs, applications);
    renderCharts(jobs, applications);


    const appsEl = document.getElementById("metric-applicants");
    if (appsEl) appsEl.textContent = companyApplications.length;

    // Interviews
    const intEl = document.getElementById("metric-interviews");
    if (intEl) intEl.textContent = interviews.length;

  } catch (error) {
    console.error("Error loading metrics:", error);
  }
}

function renderJobs(jobs, applications) {
  const container = document.getElementById("jobs-list");
  if (!container) return;

  container.innerHTML = "";

  jobs.forEach(job => {
    const applicantsCount = applications.filter(app => app.jobId === job.id).length;

    const jobCard = document.createElement("div");
    jobCard.className = "flex justify-between items-center bg-background-app p-4 rounded-lg";

    jobCard.innerHTML = `
  <div>
    <p class="font-medium">${job.title}</p>
    <p class="text-text-muted text-sm">
      ${job.location} • 
      <span class="${job.status === "closed" ? "text-red-500" : "text-green-500"} font-medium">
        ${job.status}
      </span>
    </p>
  </div>

  <div class="flex items-center gap-3">
    <span class="text-brand text-sm">${applicantsCount} applicants</span>
    <button class="px-3 py-1 bg-background-card rounded text-sm">View</button>

    ${
      job.status !== "closed"
        ? `<button onclick="closeJob(${job.id})" class="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm text-white">
             Close
           </button>`
        : ""
    }
  </div>
`;

    container.appendChild(jobCard);
  });
}

async function closeJob(jobId) {
  try {
    await fetch(`http://localhost:3000/jobs/${jobId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "closed" })
    });

    // Recargar datos del dashboard
    loadMetrics(JSON.parse(localStorage.getItem("user")).id);

  } catch (error) {
    console.error("Error closing job:", error);
  }
}

function renderCharts(jobs, applications) {
  const ctxApps = document.getElementById("applicationsChart");
  const ctxJobs = document.getElementById("jobsChart");

  if (!ctxApps || !ctxJobs) return;

  // Fake weekly grouping (porque json-server no tiene fechas reales aún)
  const weeks = ["W1", "W2", "W3", "W4", "W5", "W6"];

  const appsPerWeek = [2, 4, 3, 6, 5, applications.length];
  const jobsPerWeek = [0, 1, 0, 1, 0, jobs.length];

  new Chart(ctxApps, {
    type: "line",
    data: {
      labels: weeks,
      datasets: [{
        label: "Applications",
        data: appsPerWeek,
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59,130,246,0.2)",
        tension: 0.4
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { x: { ticks: { color: "#94A3B8" } }, y: { ticks: { color: "#94A3B8" } } }
    }
  });

  new Chart(ctxJobs, {
    type: "bar",
    data: {
      labels: weeks,
      datasets: [{
        label: "Jobs",
        data: jobsPerWeek,
        backgroundColor: "#60A5FA"
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { x: { ticks: { color: "#94A3B8" } }, y: { ticks: { color: "#94A3B8" } } }
    }
  });
}


