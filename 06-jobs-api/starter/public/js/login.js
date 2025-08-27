const loginForm = document.getElementById('loginForm');
const errorEl = document.getElementById('error');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(loginForm);
  const data = Object.fromEntries(formData.entries());

  try {
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (!res.ok) throw new Error(result.msg || 'Something went wrong');

    localStorage.setItem('token', result.token);
    window.location.href = 'dashboard.html';
  } catch (err) {
    errorEl.textContent = err.message;
  }
});
