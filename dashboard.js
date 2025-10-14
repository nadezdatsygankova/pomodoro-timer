// Dashboard JavaScript

let currentPeriod = 'today';
let charts = {};

// Check authentication
window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    window.location.href = 'auth.html';
    return;
  }

  // Show user info
  const userEmail = localStorage.getItem('user_email');
  if (userEmail) {
    document.getElementById('userEmail').textContent = userEmail;
  }

  // Logout button
  document.getElementById('logoutBtn').addEventListener('click', logout);

  // Initialize dashboard
  initializeDashboard();
});

// Logout function
async function logout() {
  try {
    const token = localStorage.getItem('access_token');

    if (token) {
      await fetch('http://localhost:3000/api/auth/signout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    }

    localStorage.clear();
    window.location.href = 'auth.html';
  } catch (error) {
    console.error('Logout error:', error);
    localStorage.clear();
    window.location.href = 'auth.html';
  }
}

// Initialize dashboard
async function initializeDashboard() {
  try {
    await loadDashboardData();
    setupEventListeners();
  } catch (error) {
    console.error('Error initializing dashboard:', error);
  }
}

// Setup event listeners
function setupEventListeners() {
  // Time filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPeriod = btn.dataset.period;
      loadDashboardData();
    });
  });
}

// Load dashboard data
async function loadDashboardData() {
  try {
    const data = await api.getData();

    // Update statistics
    updateStatistics(data);

    // Create charts
    createCharts(data);

    // Generate insights
    generateInsights(data);

  } catch (error) {
    console.error('Error loading dashboard data:', error);
    showNoData();
  }
}

// Update statistics cards
function updateStatistics(data) {
  const stats = data.statistics;

  // Total sessions
  document.getElementById('totalSessions').textContent = stats.totalSessions || 0;

  // Total focus time
  const totalHours = Math.floor(stats.totalFocusTime / 60);
  const totalMinutes = stats.totalFocusTime % 60;
  document.getElementById('totalFocusTime').textContent =
    totalHours > 0 ? `${totalHours}h ${totalMinutes}m` : `${totalMinutes}m`;

  // Tasks completed
  const completedTasks = data.tasks.filter(t => t.completed).length;
  document.getElementById('tasksCompleted').textContent = completedTasks;

  // Average session
  const avgSession = stats.totalSessions > 0 ?
    Math.round(stats.totalFocusTime / stats.totalSessions) : 25;
  document.getElementById('avgSession').textContent = `${avgSession}m`;
}

// Create charts
function createCharts(data) {
  // Destroy existing charts
  Object.values(charts).forEach(chart => chart.destroy());
  charts = {};

  // Daily Activity Chart
  createDailyChart(data.activities);

  // Activity Breakdown Chart
  createActivityChart(data.activities);

  // Weekly Progress Chart
  createWeeklyChart(data.activities);

  // Task Completion Chart
  createTaskChart(data.tasks);
}

// Daily Activity Chart
function createDailyChart(activities) {
  const ctx = document.getElementById('dailyChart').getContext('2d');

  // Group activities by day
  const dailyData = {};
  activities.forEach(activity => {
    const date = new Date(activity.timestamp).toLocaleDateString();
    if (!dailyData[date]) {
      dailyData[date] = { work: 0, break: 0 };
    }
    if (activity.type === 'work') dailyData[date].work++;
    if (activity.type === 'break') dailyData[date].break++;
  });

  const dates = Object.keys(dailyData).slice(-7); // Last 7 days
  const workData = dates.map(date => dailyData[date]?.work || 0);
  const breakData = dates.map(date => dailyData[date]?.break || 0);

  charts.dailyChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [
        {
          label: 'Work Sessions',
          data: workData,
          borderColor: 'rgb(255, 107, 107)',
          backgroundColor: 'rgba(255, 107, 107, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Breaks',
          data: breakData,
          borderColor: 'rgb(78, 205, 196)',
          backgroundColor: 'rgba(78, 205, 196, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

// Activity Breakdown Chart
function createActivityChart(activities) {
  const ctx = document.getElementById('activityChart').getContext('2d');

  const workCount = activities.filter(a => a.type === 'work').length;
  const breakCount = activities.filter(a => a.type === 'break').length;
  const taskCount = activities.filter(a => a.type === 'task').length;

  charts.activityChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Work Sessions', 'Breaks', 'Tasks'],
      datasets: [{
        data: [workCount, breakCount, taskCount],
        backgroundColor: [
          'rgb(255, 107, 107)',
          'rgb(78, 205, 196)',
          'rgb(81, 207, 102)'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

// Weekly Progress Chart
function createWeeklyChart(activities) {
  const ctx = document.getElementById('weeklyChart').getContext('2d');

  // Get last 7 days
  const days = [];
  const workData = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
    days.push(dateStr);

    const dayActivities = activities.filter(a => {
      const activityDate = new Date(a.timestamp);
      return activityDate.toDateString() === date.toDateString();
    });

    workData.push(dayActivities.filter(a => a.type === 'work').length);
  }

  charts.weeklyChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: days,
      datasets: [{
        label: 'Pomodoro Sessions',
        data: workData,
        backgroundColor: 'rgb(255, 107, 107)',
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

// Task Completion Chart
function createTaskChart(tasks) {
  const ctx = document.getElementById('taskChart').getContext('2d');

  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.filter(t => !t.completed).length;

  charts.taskChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Completed', 'Pending'],
      datasets: [{
        data: [completed, pending],
        backgroundColor: [
          'rgb(81, 207, 102)',
          'rgb(255, 193, 7)'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

// Generate insights
function generateInsights(data) {
  const insights = [];
  const stats = data.statistics;
  const tasks = data.tasks;
  const activities = data.activities;

  // Total sessions insight
  if (stats.totalSessions > 0) {
    insights.push({
      icon: '🍅',
      text: `You've completed ${stats.totalSessions} Pomodoro session${stats.totalSessions > 1 ? 's' : ''}!`
    });
  }

  // Focus time insight
  if (stats.totalFocusTime > 0) {
    const hours = Math.floor(stats.totalFocusTime / 60);
    insights.push({
      icon: '⏱️',
      text: `You've focused for ${hours} hour${hours !== 1 ? 's' : ''} and ${stats.totalFocusTime % 60} minutes!`
    });
  }

  // Task completion insight
  const completedTasks = tasks.filter(t => t.completed).length;
  if (completedTasks > 0) {
    const completionRate = Math.round((completedTasks / tasks.length) * 100);
    insights.push({
      icon: '✅',
      text: `You've completed ${completedTasks} task${completedTasks > 1 ? 's' : ''} (${completionRate}% completion rate)!`
    });
  }

  // Streak insight
  if (activities.length > 0) {
    const today = new Date().toDateString();
    const todayActivities = activities.filter(a =>
      new Date(a.timestamp).toDateString() === today
    );
    if (todayActivities.length > 0) {
      insights.push({
        icon: '🔥',
        text: `You're on fire today! Keep up the great work!`
      });
    }
  }

  // Productivity tip
  if (stats.totalSessions < 4) {
    insights.push({
      icon: '💡',
      text: `Try to complete at least 4 Pomodoros per day for maximum productivity!`
    });
  }

  // Display insights
  const insightsList = document.getElementById('insightsList');
  if (insights.length === 0) {
    insightsList.innerHTML = `
            <div class="no-data">
                <div class="no-data-icon">📊</div>
                <p>No data yet. Start using the Pomodoro Timer to see insights!</p>
            </div>
        `;
  } else {
    insightsList.innerHTML = insights.map(insight => `
            <div class="insight-item">
                <div class="insight-icon">${insight.icon}</div>
                <div class="insight-text">${insight.text}</div>
            </div>
        `).join('');
  }
}

// Show no data message
function showNoData() {
  document.querySelector('.stats-grid').innerHTML = `
        <div class="no-data" style="grid-column: 1 / -1;">
            <div class="no-data-icon">📊</div>
            <h3>No Data Available</h3>
            <p>Start using the Pomodoro Timer to see your statistics!</p>
            <button class="btn btn-primary" onclick="window.location.href='index.html'" style="margin-top: 20px;">
                Go to Timer
            </button>
        </div>
    `;

  document.querySelector('.charts-grid').innerHTML = '';
  document.getElementById('insightsList').innerHTML = '';
}

