const token = localStorage.getItem('token');
const jobsList = document.getElementById('jobsList');
const jobForm = document.getElementById('jobForm');
const jobError = document.getElementById('jobError');
const logoutBtn = document.getElementById('logoutBtn');

if (!token) window.location.href = 'index.html';

// Fetch jobs
async function fetchJobs() {
  try {
    const res = await fetch('/api/v1/jobs', { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || 'Failed to fetch jobs');
    renderJobs(data.jobs);
  } catch (err) { jobError.textContent = err.message; }
}

function renderJobs(jobs) {
  jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  jobsList.innerHTML = '';
  jobs.forEach(job => {
    const li = document.createElement('li');

    li.innerHTML = `
      <div class="job-info">
        <span class="job-company">${job.company}</span>
        <span class="job-position">${job.position}</span>
        <span class="job-status ${job.status}">${job.status}</span>
      </div>
      <div class="job-actions">
        <button onclick="editJob('${job._id}','${job.company}','${job.position}','${job.status}')" title="Edit">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button onclick="deleteJob('${job._id}')" title="Delete">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;
    jobsList.appendChild(li);
  });
}

// Add / Update job
jobForm.addEventListener('submit', async e => {
  e.preventDefault();
  const formData = new FormData(jobForm);
  const { jobId, company, position, status } = Object.fromEntries(formData.entries());

  try {
    let url = '/api/v1/jobs';
    let method = 'POST';
    if (jobId) { url = `/api/v1/jobs/${jobId}`; method = 'PATCH'; }

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ company, position, status })
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.msg || 'Failed to save job');

    jobForm.reset();
    fetchJobs();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) { jobError.textContent = err.message; }
});

// Edit job
window.editJob = function(id, company, position, status) {
  jobForm.jobId.value = id;
  jobForm.company.value = company;
  jobForm.position.value = position;
  jobForm.status.value = status;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Delete job
window.deleteJob = async function(id) {
  if (!confirm('Are you sure you want to delete this job?')) return;
  try {
    const res = await fetch(`/api/v1/jobs/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) { const data = await res.json(); throw new Error(data.msg || 'Failed to delete job'); }
    fetchJobs();
  } catch (err) { jobError.textContent = err.message; }
};

// Logout
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
});

fetchJobs();
