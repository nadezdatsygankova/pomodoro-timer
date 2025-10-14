// Authentication JavaScript

const API_BASE_URL = 'http://localhost:3000/api';

// DOM Elements
const signinTab = document.querySelector('[data-tab="signin"]');
const signupTab = document.querySelector('[data-tab="signup"]');
const signinForm = document.getElementById('signinForm');
const signupForm = document.getElementById('signupForm');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');
const signinBtn = document.getElementById('signinBtn');
const signupBtn = document.getElementById('signupBtn');

// Tab switching
signinTab.addEventListener('click', () => switchTab('signin'));
signupTab.addEventListener('click', () => switchTab('signup'));

function switchTab(tab) {
  // Update tabs
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

  // Update forms
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
  document.getElementById(`${tab}Form`).classList.add('active');

  // Clear messages
  hideMessage();
}

// Show error message
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add('show');
  successMessage.classList.remove('show');
}

// Show success message
function showSuccess(message) {
  successMessage.textContent = message;
  successMessage.classList.add('show');
  errorMessage.classList.remove('show');
}

// Hide messages
function hideMessage() {
  errorMessage.classList.remove('show');
  successMessage.classList.remove('show');
}

// Set loading state
function setLoading(button, isLoading) {
  if (isLoading) {
    button.disabled = true;
    button.innerHTML = '<span class="loading"></span>Loading...';
  } else {
    button.disabled = false;
    button.innerHTML = button.dataset.originalText || 'Submit';
  }
}

// Store auth data
function storeAuthData(session) {
  localStorage.setItem('access_token', session.access_token);
  localStorage.setItem('refresh_token', session.refresh_token);
  localStorage.setItem('user_id', session.user.id);
  localStorage.setItem('user_email', session.user.email);
}

// Clear auth data
function clearAuthData() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('user_email');
}

// Sign in
signinForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideMessage();

  const email = document.getElementById('signinEmail').value;
  const password = document.getElementById('signinPassword').value;

  setLoading(signinBtn, true);

  try {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Sign in failed');
    }

    // Store auth data
    storeAuthData(data.session);

    showSuccess('Sign in successful! Redirecting...');

    // Redirect to main app
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);

  } catch (error) {
    console.error('Sign in error:', error);
    showError(error.message || 'Failed to sign in. Please try again.');
  } finally {
    setLoading(signinBtn, false);
  }
});

// Sign up
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideMessage();

  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  if (password.length < 6) {
    showError('Password must be at least 6 characters long');
    return;
  }

  setLoading(signupBtn, true);

  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password, name })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Sign up failed');
    }

    // Store auth data
    if (data.session) {
      storeAuthData(data.session);
    }

    showSuccess(data.message || 'Sign up successful! Please check your email to verify your account.');

    // Redirect to main app after a short delay
    if (data.session) {
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    }

  } catch (error) {
    console.error('Sign up error:', error);
    showError(error.message || 'Failed to sign up. Please try again.');
  } finally {
    setLoading(signupBtn, false);
  }
});

// Forgot password (placeholder)
document.getElementById('forgotPasswordLink').addEventListener('click', (e) => {
  e.preventDefault();
  showError('Password reset feature coming soon!');
});

// Check if already logged in
window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('access_token');
  if (token) {
    // Already logged in, redirect to main app
    window.location.href = 'index.html';
  }
});

