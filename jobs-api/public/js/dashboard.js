const token = localStorage.getItem('token');
if (!token) window.location.href = 'index.html';

const jobsList = document.getElementById('jobsList');
const jobForm = document.getElementById('jobForm');
const jobError = document.getElementById('jobError');
const logoutBtn = document.getElementById('logoutBtn');

const escapeHtml = (str = '') =>
  str.replace(/[&<>"']/g, s => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[s]));

// fetch wrapper
async function fetchJSON(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, ...(options.headers || {}) }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.msg || data.error || 'Request failed');
  return data;
}

// render Jobs
async function fetchJobs() {
  jobError.textContent = '';
  try {
    const data = await fetchJSON('/api/v1/jobs');
    renderJobs(Array.isArray(data.jobs) ? data.jobs : []);
  } catch (err) {
    jobError.textContent = err.message;
    jobsList.innerHTML = '';
  }
}

function renderJobs(jobs) {
  jobsList.innerHTML = '';
  jobs
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .forEach(job => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div class="job-info">
          <span class="job-company">${escapeHtml(job.company)}</span>
          <span class="job-position">${escapeHtml(job.position)}</span>
          <span class="job-status ${escapeHtml(job.status)}">${escapeHtml(job.status)}</span>
        </div>
        <div class="job-actions">
          <button class="edit-btn"
                  data-id="${job._id}"
                  data-company="${encodeURIComponent(job.company)}"
                  data-position="${encodeURIComponent(job.position)}"
                  data-status="${job.status}">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="delete-btn" data-id="${job._id}">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>`;
      jobsList.appendChild(li);
    });
}

// event edit & delete
jobsList.addEventListener('click', async (e) => {
  const editBtn = e.target.closest('.edit-btn');
  const deleteBtn = e.target.closest('.delete-btn');

  if (editBtn) {
    jobForm.jobId.value = editBtn.dataset.id;
    jobForm.company.value = decodeURIComponent(editBtn.dataset.company || '');
    jobForm.position.value = decodeURIComponent(editBtn.dataset.position || '');
    jobForm.status.value = editBtn.dataset.status || 'pending';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  if (deleteBtn) {
    if (!confirm('Are you sure you want to delete this job?')) return;
    try {
      await fetchJSON(`/api/v1/jobs/${deleteBtn.dataset.id}`, { method: 'DELETE' });
      fetchJobs();
    } catch (err) {
      jobError.textContent = err.message;
    }
  }
});

// Add / Update job
jobForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(jobForm);
  const { jobId, company, position, status } = Object.fromEntries(formData.entries());
  const payload = { company, position, status };

  try {
    if (jobId) {
      await fetchJSON(`/api/v1/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      await fetchJSON('/api/v1/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
    jobForm.reset();
    fetchJobs();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    jobError.textContent = err.message;
  }
});

// Logout
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
});

fetchJobs();
