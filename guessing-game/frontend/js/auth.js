async function loginUser(email, password) {
  const res = await fetch('http://localhost:5000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error('Login failed');
  const data = await res.json();
  localStorage.setItem('authToken', data.token);
  localStorage.setItem('playerName', data.name);
  window.location.href = 'index.html';
}

async function signupUser(name, email, password, avatar) {
  const res = await fetch('http://localhost:5000/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, avatar })
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Signup failed');
  }

  return res.json();
}



function logout() {
  document.getElementById("logoutModal").style.display = "flex";
}
function confirmLogout(confirm) {
  const modal = document.getElementById("logoutModal");
  modal.style.display = "none";
  if (confirm) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('playerName');
    window.location.href = 'login.html';
  }
}



function getToken() {
  return localStorage.getItem('authToken');
}

function isLoggedIn() {
  return !!localStorage.getItem('authToken');
}
