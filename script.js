// Timer State
let timerInterval = null;
let timeLeft = 25 * 60; // 25 minutes in seconds
let isRunning = false;
let isPaused = false;
let isBreakMode = false; // true for break, false for work
let totalSessions = 0;
let totalFocusTime = 0; // in minutes
let currentTaskStartTime = null;
const WORK_TIME = 25 * 60; // 25 minutes
const SHORT_BREAK_TIME = 5 * 60; // 5 minutes
const LONG_BREAK_TIME = 15 * 60; // 15 minutes

// Task State
let tasks = [];
let taskIdCounter = 0;

// Activity History
let activityHistory = [];
let currentFilter = 'all';

// DOM Elements
const timerDisplay = document.getElementById('timerDisplay');
const timerLabel = document.getElementById('timerLabel');
const breakIndicator = document.getElementById('breakIndicator');
const breakType = document.getElementById('breakType');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const skipBreakBtn = document.getElementById('skipBreakBtn');
const sessionCount = document.getElementById('sessionCount');
const totalTime = document.getElementById('totalTime');
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const totalTasksElement = document.getElementById('totalTasks');
const completedTasksElement = document.getElementById('completedTasks');
const taskTimeElement = document.getElementById('taskTime');
const activityList = document.getElementById('activityList');
const exportBtn = document.getElementById('exportBtn');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const filterBtns = document.querySelectorAll('.filter-btn');

// Load data from database or localStorage
async function loadData() {
  try {
    const data = await api.getData();

    totalSessions = data.statistics.totalSessions || 0;
    totalFocusTime = data.statistics.totalFocusTime || 0;

    // Convert tasks from database format
    tasks = data.tasks.map(task => ({
      id: task.id,
      text: task.text,
      completed: task.completed,
      timeSpent: task.timeSpent
    }));

    // Set task counter
    if (tasks.length > 0) {
      taskIdCounter = Math.max(...tasks.map(t => t.id)) + 1;
    }

    // Convert activities from database format
    activityHistory = data.activities.map(activity => ({
      type: activity.type,
      title: activity.title,
      duration: activity.duration,
      timestamp: activity.timestamp
    }));

    updateSessionDisplay();
    renderTasks();
    renderActivities();
  } catch (error) {
    console.error('Error loading data:', error);
    // Fallback to localStorage
    const savedData = localStorage.getItem('pomodoroData');
    if (savedData) {
      const data = JSON.parse(savedData);
      totalSessions = data.totalSessions || 0;
      totalFocusTime = data.totalFocusTime || 0;
      tasks = data.tasks || [];
      taskIdCounter = data.taskIdCounter || 0;
      activityHistory = data.activityHistory || [];

      updateSessionDisplay();
      renderTasks();
      renderActivities();
    }
  }
}

// Save data to database or localStorage
async function saveData() {
  const data = {
    totalSessions,
    totalFocusTime,
    tasks,
    taskIdCounter,
    isBreakMode,
    activityHistory
  };

  // Also save to localStorage as backup
  localStorage.setItem('pomodoroData', JSON.stringify(data));
}

// Update session display
function updateSessionDisplay() {
  sessionCount.textContent = totalSessions;
  totalTime.textContent = `${totalFocusTime} min`;
}

// Format time as MM:SS
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Update timer display
function updateTimerDisplay() {
  timerDisplay.textContent = formatTime(timeLeft);
  updateProgressCircle();

  // Update UI based on mode
  if (isBreakMode) {
    timerLabel.textContent = 'Break Time';
    timerDisplay.style.color = 'var(--secondary-color)';
    breakIndicator.style.display = 'flex';
    skipBreakBtn.style.display = 'inline-flex';
  } else {
    timerLabel.textContent = 'Focus Time';
    timerDisplay.style.color = 'var(--primary-color)';
    breakIndicator.style.display = 'none';
    skipBreakBtn.style.display = 'none';
  }
}

// Update progress circle
function updateProgressCircle() {
  const progressCircle = document.querySelector('.timer-progress');
  const circumference = 2 * Math.PI * 45; // radius is 45

  // Determine total time based on mode
  let totalDuration;
  if (isBreakMode) {
    totalDuration = totalSessions % 4 === 0 ? LONG_BREAK_TIME : SHORT_BREAK_TIME;
  } else {
    totalDuration = WORK_TIME;
  }

  const progress = (totalDuration - timeLeft) / totalDuration;
  const offset = circumference * (1 - progress);
  progressCircle.style.strokeDashoffset = offset;

  // Change circle color based on mode
  if (isBreakMode) {
    progressCircle.style.stroke = 'var(--secondary-color)';
  } else {
    progressCircle.style.stroke = 'var(--primary-color)';
  }
}

// Start timer
function startTimer() {
  if (isRunning) return;

  isRunning = true;
  isPaused = false;

  // Only track task time during work sessions
  if (!isBreakMode) {
    currentTaskStartTime = Date.now();
  }

  startBtn.style.display = 'none';
  pauseBtn.style.display = 'inline-flex';

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      if (isBreakMode) {
        completeBreak();
      } else {
        completeSession();
      }
    }
  }, 1000);
}

// Pause timer
function pauseTimer() {
  if (!isRunning) return;

  isRunning = false;
  isPaused = true;

  startBtn.style.display = 'inline-flex';
  pauseBtn.style.display = 'none';

  clearInterval(timerInterval);

  // Update current task time if active
  if (currentTaskStartTime) {
    const elapsed = Math.floor((Date.now() - currentTaskStartTime) / 1000 / 60);
    updateCurrentTaskTime(elapsed);
    currentTaskStartTime = null;
  }
}

// Reset timer
function resetTimer() {
  isRunning = false;
  isPaused = false;

  // Reset to work mode
  isBreakMode = false;
  timeLeft = WORK_TIME;

  startBtn.style.display = 'inline-flex';
  pauseBtn.style.display = 'none';

  clearInterval(timerInterval);
  updateTimerDisplay();

  // Reset current task time
  if (currentTaskStartTime) {
    currentTaskStartTime = null;
  }
}

// Complete session
async function completeSession() {
  clearInterval(timerInterval);
  isRunning = false;
  isPaused = false;

  totalSessions++;
  totalFocusTime += 25;

  updateSessionDisplay();

  // Save to database
  await api.saveSession(25, 'work');

  // Log activity
  await addActivity({
    type: 'work',
    title: 'Pomodoro Session Completed',
    duration: '25 min',
    timestamp: new Date()
  });

  saveData();

  // Play completion sound
  playNotificationSound();

  // Show notification
  const isLongBreak = totalSessions % 4 === 0;
  const breakDuration = isLongBreak ? '15 minutes' : '5 minutes';
  showNotification(`🎉 Pomodoro completed! Take a ${breakDuration} break!`);

  // Start break
  startBreak();

  // Update task time
  if (currentTaskStartTime) {
    const elapsed = Math.floor((Date.now() - currentTaskStartTime) / 1000 / 60);
    updateCurrentTaskTime(elapsed);
    currentTaskStartTime = null;
  }
}

// Start break
function startBreak() {
  isBreakMode = true;

  // Determine break duration (long break every 4 sessions)
  const isLongBreak = totalSessions % 4 === 0;
  timeLeft = isLongBreak ? LONG_BREAK_TIME : SHORT_BREAK_TIME;

  breakType.textContent = isLongBreak ? 'Long Break (15 min)' : 'Short Break (5 min)';

  updateTimerDisplay();
  startBtn.style.display = 'inline-flex';
  pauseBtn.style.display = 'none';
}

// Complete break
async function completeBreak() {
  clearInterval(timerInterval);
  isRunning = false;
  isPaused = false;

  // Log activity
  const isLongBreak = totalSessions % 4 === 0;
  await addActivity({
    type: 'break',
    title: isLongBreak ? 'Long Break Completed' : 'Short Break Completed',
    duration: isLongBreak ? '15 min' : '5 min',
    timestamp: new Date()
  });

  saveData();

  // Play completion sound
  playNotificationSound();

  // Show notification
  showNotification('☕ Break complete! Ready for the next Pomodoro?');

  // Return to work mode
  isBreakMode = false;
  timeLeft = WORK_TIME;

  updateTimerDisplay();
  startBtn.style.display = 'inline-flex';
  pauseBtn.style.display = 'none';
}

// Skip break
function skipBreak() {
  if (!isBreakMode) return;

  clearInterval(timerInterval);
  isRunning = false;
  isPaused = false;

  // Return to work mode
  isBreakMode = false;
  timeLeft = WORK_TIME;

  updateTimerDisplay();
  startBtn.style.display = 'inline-flex';
  pauseBtn.style.display = 'none';

  showNotification('⏭️ Break skipped! Ready to focus?');
}

// Play notification sound
function playNotificationSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 800;
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
}

// Show notification
function showNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #51cf66;
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
    `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add task
async function addTask() {
  const taskText = taskInput.value.trim();
  if (!taskText) return;

  taskInput.value = '';

  // Add to database
  const result = await api.addTask(taskText);

  if (result.success) {
    const task = {
      id: result.id,
      text: taskText,
      completed: false,
      timeSpent: 0
    };

    tasks.push(task);
    renderTasks();

    // Log activity
    await addActivity({
      type: 'task',
      title: `Task Added: ${taskText}`,
      duration: '0 min',
      timestamp: new Date()
    });

    saveData();
  }

  // Focus on the new task
  taskInput.focus();
}

// Toggle task completion
async function toggleTask(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    task.completed = !task.completed;

    // Update in database
    await api.updateTask(taskId, { completed: task.completed });

    renderTasks();
    saveData();
  }
}

// Delete task
async function deleteTask(taskId) {
  // Delete from database
  await api.deleteTask(taskId);

  tasks = tasks.filter(t => t.id !== taskId);
  renderTasks();
  saveData();
}

// Update current task time
async function updateCurrentTaskTime(minutes) {
  const activeTasks = tasks.filter(t => !t.completed);
  if (activeTasks.length > 0) {
    const task = activeTasks[0];
    task.timeSpent += minutes;

    // Update in database
    await api.updateTask(task.id, { timeSpent: task.timeSpent });

    renderTasks();
    saveData();
  }
}

// Render tasks
function renderTasks() {
  taskList.innerHTML = '';

  tasks.forEach(task => {
    const taskItem = document.createElement('div');
    taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;

    taskItem.innerHTML = `
            <input
                type="checkbox"
                class="task-checkbox"
                ${task.completed ? 'checked' : ''}
                onchange="toggleTask(${task.id})"
            >
            <span class="task-text">${escapeHtml(task.text)}</span>
            <span class="task-time">${task.timeSpent} min</span>
            <button class="btn-delete" onclick="deleteTask(${task.id})" title="Delete task">🗑️</button>
        `;

    taskList.appendChild(taskItem);
  });

  updateTaskStats();
}

// Update task statistics
function updateTaskStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const totalTime = tasks.reduce((sum, t) => sum + t.timeSpent, 0);

  totalTasksElement.textContent = total;
  completedTasksElement.textContent = completed;
  taskTimeElement.textContent = `${totalTime} min`;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Add activity to history
async function addActivity(activity) {
  activityHistory.unshift(activity);

  // Keep only last 100 activities
  if (activityHistory.length > 100) {
    activityHistory = activityHistory.slice(0, 100);
  }

  // Save to database
  await api.addActivity(activity.type, activity.title, activity.duration);

  renderActivities();
}

// Render activities
function renderActivities() {
  activityList.innerHTML = '';

  if (activityHistory.length === 0) {
    activityList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
                <p style="font-size: 1.1rem; margin-bottom: 10px;">No activities yet</p>
                <p style="font-size: 0.9rem;">Start a Pomodoro session to see your activity history!</p>
            </div>
        `;
    return;
  }

  const filteredActivities = filterActivities(currentFilter);

  filteredActivities.forEach(activity => {
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';

    const icon = getActivityIcon(activity.type);
    const durationClass = activity.type === 'break' ? 'break-duration' : '';

    activityItem.innerHTML = `
            <div class="activity-icon ${activity.type}">
                ${icon}
            </div>
            <div class="activity-content">
                <div class="activity-title">${escapeHtml(activity.title)}</div>
                <div class="activity-time">${formatActivityTime(activity.timestamp)}</div>
            </div>
            <div class="activity-duration ${durationClass}">${activity.duration}</div>
        `;

    activityList.appendChild(activityItem);
  });
}

// Filter activities
function filterActivities(filter) {
  if (filter === 'all') {
    return activityHistory;
  }
  return activityHistory.filter(activity => activity.type === filter);
}

// Get activity icon
function getActivityIcon(type) {
  const icons = {
    work: '🍅',
    break: '☕',
    task: '📝'
  };
  return icons[type] || '📌';
}

// Format activity time
function formatActivityTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString();
}

// Export data
async function exportData() {
  try {
    const result = await api.exportData();
    if (result.success) {
      showNotification('📥 Data exported successfully!');
    } else {
      showNotification('❌ Failed to export data');
    }
  } catch (error) {
    console.error('Export error:', error);
    showNotification('❌ Failed to export data');
  }
}

// Clear history
async function clearHistory() {
  if (confirm('Are you sure you want to clear all activity history? This cannot be undone.')) {
    await api.clearActivities();
    activityHistory = [];
    renderActivities();
    saveData();
    showNotification('🗑️ History cleared successfully!');
  }
}

// Event Listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
skipBreakBtn.addEventListener('click', skipBreak);

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

exportBtn.addEventListener('click', exportData);
clearHistoryBtn.addEventListener('click', clearHistory);

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active class from all buttons
    filterBtns.forEach(b => b.classList.remove('active'));
    // Add active class to clicked button
    btn.classList.add('active');
    // Update filter
    currentFilter = btn.getAttribute('data-filter');
    renderActivities();
  });
});

// Logout function
async function logout() {
  try {
    const token = localStorage.getItem('access_token');

    if (token) {
      // Call logout API
      await fetch('http://localhost:3000/api/auth/signout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    }

    // Clear local storage
    localStorage.clear();

    // Redirect to login
    window.location.href = 'auth.html';
  } catch (error) {
    console.error('Logout error:', error);
    // Clear local storage anyway
    localStorage.clear();
    window.location.href = 'auth.html';
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Check authentication
  const token = localStorage.getItem('access_token');
  const guestMode = localStorage.getItem('guest_mode');
  const userEmail = localStorage.getItem('user_email');

  console.log('Auth check:', { token: !!token, guestMode: !!guestMode });

  // Show appropriate UI based on auth status
  const authButtons = document.getElementById('authButtons');
  const userInfo = document.getElementById('userInfo');

  if (token && userEmail) {
    // User is signed in - show user info
    document.getElementById('userEmail').textContent = userEmail;
    authButtons.style.display = 'none';
    userInfo.style.display = 'flex';
  } else {
    // User is not signed in - show sign in button
    authButtons.style.display = 'flex';
    userInfo.style.display = 'none';
  }

  // Sign in button
  const signInBtn = document.getElementById('signInBtn');
  if (signInBtn) {
    signInBtn.addEventListener('click', () => {
      window.location.href = 'auth.html';
    });
  }

  // Logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }

  loadData();
  updateTimerDisplay();
  updateTaskStats();

  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
});

// Auto-save every 30 seconds
setInterval(() => {
  if (isRunning && currentTaskStartTime && !isBreakMode) {
    const elapsed = Math.floor((Date.now() - currentTaskStartTime) / 1000 / 60);
    if (elapsed > 0) {
      updateCurrentTaskTime(1);
      currentTaskStartTime = Date.now();
    }
  }
  // Save state periodically
  saveData();
}, 30000); // 30 seconds

// Save data before page unload
window.addEventListener('beforeunload', () => {
  if (isRunning && currentTaskStartTime && !isBreakMode) {
    const elapsed = Math.floor((Date.now() - currentTaskStartTime) / 1000 / 60);
    if (elapsed > 0) {
      updateCurrentTaskTime(elapsed);
    }
  }
  saveData();
});

