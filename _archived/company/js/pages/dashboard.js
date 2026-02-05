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
    const [jobsRes, applicationsRes, interviewsRes, matchesRes] =
      await Promise.all([
        fetch(`${API_URL}/jobs?companyId=${companyId}`),
        fetch(`${API_URL}/applications`),
        fetch(`${API_URL}/interviews?companyId=${companyId}&status=scheduled`),
        fetch(`${API_URL}/matches?companyId=${companyId}`),
      ]);

    const jobs = await jobsRes.json();
    const applications = await applicationsRes.json();
    const interviews = await interviewsRes.json();
    const matches = await matchesRes.json();


    // Jobs
    const jobsEl = document.getElementById("metric-jobs");
    if (jobsEl) jobsEl.textContent = jobs.length;

    // Applicants
    const jobIds = jobs.map((job) => job.id);
    const companyApplications = applications.filter((app) =>
      jobIds.includes(app.jobId),
    );

    renderJobs(jobs, applications);
    renderCharts(jobs, applications);
    renderMatchesChart(matches);

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

  jobs.forEach((job) => {
    const applicantsCount = applications.filter(
      (app) => app.jobId === job.id,
    ).length;

    const jobCard = document.createElement("div");
    jobCard.className =
      "flex justify-between items-center bg-background-app p-4 rounded-lg";

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
      body: JSON.stringify({ status: "closed" }),
    });

    // Recargar datos del dashboard


    loadMetrics(JSON.parse(localStorage.getItem("user")).id);
  } catch (error) {
    console.error("Error closing job:", error);
  }
}

function groupByLast6Weeks(items, dateField) {
  const now = new Date();
  const weeks = [];

  for (let i = 5; i >= 0; i--) {
    const start = new Date(now);
    start.setDate(now.getDate() - i * 7);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 7);

    weeks.push({
      label: `W${6 - i}`,
      start,
      end,
    });
  }

  return weeks.map((week) => ({
    label: week.label,
    count: items.filter((item) => {
      const d = new Date(item[dateField]);
      return d >= week.start && d < week.end;
    }).length,
  }));

}

function renderCharts(jobs, applications) {
  const ctxApps = document.getElementById("applicationsChart");
  const ctxJobs = document.getElementById("jobsChart");

  if (!ctxApps || !ctxJobs) return;

  const appsData = groupByLast6Weeks(applications, "createdAt");


  const jobsData = groupByLast6Weeks(jobs, "createdAt");

  new Chart(ctxApps, {
    type: "line",
    data: {
      labels: appsData.map((w) => w.label),
      datasets: [
        {
          label: "Applications",
          data: appsData.map((w) => w.count),
          borderColor: "#3B82F6",
          backgroundColor: "rgba(59,130,246,0.2)",
          tension: 0.4,
        },
      ],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: "#94A3B8" } },
        y: { ticks: { color: "#94A3B8" } },
      },
    },
  });

  new Chart(ctxJobs, {
    type: "bar",
    data: {
      labels: jobsData.map((w) => w.label),
      datasets: [
        {
          label: "Jobs",
          data: jobsData.map((w) => w.count),
          backgroundColor: "#60A5FA",
        },
      ],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: "#94A3B8" } },
        y: { ticks: { color: "#94A3B8" } },
      },
    },
  });
}

function renderMatchesChart(matches) {
  const ctxMatches = document.getElementById("matchesChart");
  if (!ctxMatches) return;

  const statusMap = {
    pending: { label: "Pending", color: "#94A3B8", count: 0 },
    contacted: { label: "Contacted", color: "#3B82F6", count: 0 },
    interview: { label: "Interview", color: "#F59E0B", count: 0 },
    hired: { label: "Hired", color: "#10B981", count: 0 },
    rejected: { label: "Rejected", color: "#EF4444", count: 0 }
  };

  // Contar matches por estado
  matches.forEach(match => {
    if (statusMap[match.status]) {
      statusMap[match.status].count++;
    }
  });

  // Convertir a array y ordenar de mayor a menor
  const sortedStatuses = Object.values(statusMap)
    .sort((a, b) => b.count - a.count);

  const labels = sortedStatuses.map(s => s.label);
  const data = sortedStatuses.map(s => s.count);
  const colors = sortedStatuses.map(s => s.color);

  new Chart(ctxMatches, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Matches",
        data: data,
        backgroundColor: colors,
        borderRadius: 6,
        barThickness: 28
      }]
    },
    options: {
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          ticks: { color: "#94A3B8" },
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          ticks: { color: "#94A3B8", stepSize: 1 },
          grid: { color: "rgba(148,163,184,0.08)" }
        }
      }
    }
  });
}


