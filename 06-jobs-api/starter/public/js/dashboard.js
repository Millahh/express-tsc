const token = localStorage.getItem('token');
const jobsList = document.getElementById('jobsList');
const jobForm = document.getElementById('jobForm');
const jobError = document.getElementById('jobError');
const logoutBtn = document.getElementById('logoutBtn');

if (!token) window.location.href = 'index.html';

// Fetch jobs
async function fetchJobs() {
  try {
    const res = await fetch('/api/v1/jobs', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || 'Failed to fetch jobs');
    renderJobs(data.jobs);
  } catch (err) {
    jobError.textContent = err.message;
  }
}

function renderJobs(jobs) {
  jobsList.innerHTML = '';
  jobs.forEach(job => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${job.company}</strong> - ${job.position} 
      [${job.status}]
      <button onclick="editJob('${job._id}','${job.company}','${job.position}','${job.status}')">Edit</button>
      <button onclick="deleteJob('${job._id}')">Delete</button>
    `;
    jobsList.appendChild(li);
  });
}

// Add or Update job
jobForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(jobForm);
  const data = Object.fromEntries(formData.entries());
  const { jobId, company, position, status } = data;

  try {
    let url = '/api/v1/jobs';
    let method = 'POST';

    // if editing
    if (jobId) {
      url = `/api/v1/jobs/${jobId}`;
      method = 'PATCH';
    }

    const res = await fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ company, position, status })
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.msg || 'Failed to save job');

    jobForm.reset();
    fetchJobs();
  } catch (err) {
    jobError.textContent = err.message;
  }
});

// Edit job
window.editJob = function(id, company, position, status) {
  jobForm.jobId.value = id;
  jobForm.company.value = company;
  jobForm.position.value = position;
  jobForm.status.value = status;
};

// Delete job
window.deleteJob = async function(id) {
  if (!confirm('Are you sure you want to delete this job?')) return;

  try {
    const res = await fetch(`/api/v1/jobs/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.msg || 'Failed to delete job');
    }

    fetchJobs();
  } catch (err) {
    jobError.textContent = err.message;
  }
};

// Logout
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
});

fetchJobs();
