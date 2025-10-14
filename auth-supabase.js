// Supabase Authentication - Client Side
const SUPABASE_URL = 'https://hxhklmfayeqgzrogcfql.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4aGtsbWZheWVxZ3pyb2djZnFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NTI0ODMsImV4cCI6MjA3NjAyODQ4M30.AL-mYcyG07cWZWg9Q7XfWaBsySnlfUCGp7uKBjKy0h8';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
document.querySelector('[data-tab="guest"]').addEventListener('click', () => switchTab('guest'));

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
  localStorage.removeItem('guest_mode'); // Clear guest mode when signing in
}

// Clear auth data
function clearAuthData() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('user_email');
  localStorage.removeItem('guest_mode');
}

// Sign in
signinForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideMessage();

  const email = document.getElementById('signinEmail').value;
  const password = document.getElementById('signinPassword').value;

  setLoading(signinBtn, true);

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw new Error(error.message);
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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        }
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    // Store auth data
    if (data.session) {
      storeAuthData(data.session);
      showSuccess('Sign up successful! Redirecting...');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    } else {
      showSuccess('Sign up successful! Please check your email to verify your account.');
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

// Guest mode
document.getElementById('guestBtn').addEventListener('click', () => {
  // Set guest mode flag
  localStorage.setItem('guest_mode', 'true');
  localStorage.setItem('user_id', 'guest_' + Date.now());
  localStorage.setItem('user_email', 'Guest User');
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');

  // Redirect to main app
  window.location.href = 'index.html';
});

// Check if already authenticated when page loads
window.addEventListener('DOMContentLoaded', () => {
  // Add a delay to prevent flashing/blinking during page load
  setTimeout(() => {
    const token = localStorage.getItem('access_token');
    const guestMode = localStorage.getItem('guest_mode');

    // If already logged in (token or guest mode), redirect to main app
    if (token || guestMode) {
      window.location.href = 'index.html';
    }
  }, 300);
});

