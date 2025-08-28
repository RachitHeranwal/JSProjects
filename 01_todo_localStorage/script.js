document.addEventListener("DOMContentLoaded", () => {
  const todoInput = document.getElementById("todo-input");
  const addTaskButton = document.getElementById("add-task-btn");
  const todoList = document.getElementById("todo-list");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.forEach((task) => renderTasks(task));

  function addTask() {
    const taskText = todoInput.value.trim();
    if (taskText === "") return;

    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false,
    };
    tasks.push(newTask);
    saveTasks();
    renderAllTasks();
    todoInput.value = ""; //clear input
    console.log(tasks);
  }

  addTaskButton.addEventListener("click", () => {
    addTask();
  });

  todoInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  });

  function renderTasks(task) {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";
    
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed || false;
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderAllTasks();
    });
    
    const taskText = document.createElement("span");
    taskText.textContent = task.text;
    taskText.className = "task-text";
    taskText.addEventListener("dblclick", () => {
      const input = document.createElement("input");
      input.type = "text";
      input.value = task.text;
      input.className = "edit-input";
      li.replaceChild(input, taskText);
      input.focus();
      input.select();
      
      input.addEventListener("blur", () => {
        task.text = input.value.trim() || task.text;
        saveTasks();
        renderAllTasks();
      });
      
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          input.blur();
        } else if (e.key === "Escape") {
          li.replaceChild(taskText, input);
        }
      });
    });
    
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      saveTasks();
      renderAllTasks();
    };
    
    li.appendChild(checkbox);
    li.appendChild(taskText);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  }

  function renderAllTasks() {
    todoList.innerHTML = "";
    tasks.forEach(renderTasks);
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Initial rendering of tasks
  renderAllTasks();
});

// ========== Dark Mode Functionality ==========

document.addEventListener("DOMContentLoaded", () => {
  const themeSwitch = document.getElementById("theme-switch");
  
  // Load saved theme preference
  function loadTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      themeSwitch.checked = true;
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      themeSwitch.checked = false;
    }
  }
  
  // Toggle theme
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    themeSwitch.checked = newTheme === "dark";
  }
  
  // Event listener for theme switch
  themeSwitch.addEventListener("change", toggleTheme);
  
  // Initialize theme on page load
  loadTheme();
});

// ========== Pomodoro Timer Functionality ==========

document.addEventListener("DOMContentLoaded", () => {
  // Pomodoro Timer Elements
  const timerMinutes = document.getElementById("timer-minutes");
  const timerSeconds = document.getElementById("timer-seconds");
  const currentPhase = document.getElementById("current-phase");
  const cycleCount = document.getElementById("cycle-count");
  const startBtn = document.getElementById("start-timer");
  const pauseBtn = document.getElementById("pause-timer");
  const resetBtn = document.getElementById("reset-timer");
  const timerCircle = document.querySelector(".timer-circle");

  // Timer configuration
  const WORK_TIME = 20; // 20 seconds
  const SHORT_BREAK = 10; // 10 seconds
  const LONG_BREAK = 30; // 30 seconds
  const CYCLES_BEFORE_LONG_BREAK = 4;

  // Timer state
  let timeLeft = WORK_TIME;
  let isRunning = false;
  let currentCycle = 1;
  let isWorkPhase = true;
  let isLongBreak = false;
  let intervalId = null;

  // Load timer state from localStorage
  function loadTimerState() {
    const savedState = localStorage.getItem("pomodoroState");
    if (savedState) {
      const state = JSON.parse(savedState);
      timeLeft = state.timeLeft;
      currentCycle = state.currentCycle;
      isWorkPhase = state.isWorkPhase;
      isLongBreak = state.isLongBreak;
      updateDisplay();
      updatePhaseDisplay();
    }
  }

  // Save timer state to localStorage
  function saveTimerState() {
    const state = {
      timeLeft,
      currentCycle,
      isWorkPhase,
      isLongBreak
    };
    localStorage.setItem("pomodoroState", JSON.stringify(state));
  }

  // Update timer display
  function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerMinutes.textContent = minutes.toString().padStart(2, '0');
    timerSeconds.textContent = seconds.toString().padStart(2, '0');
  }

  // Update phase and cycle display
  function updatePhaseDisplay() {
    if (isLongBreak) {
      currentPhase.textContent = "Long Break";
      currentPhase.style.color = "#4CAF50";
    } else if (isWorkPhase) {
      currentPhase.textContent = "Work Session";
      currentPhase.style.color = "#ff80a0"; // Use the accent color directly
    } else {
      currentPhase.textContent = "Short Break";
      currentPhase.style.color = "#2196F3";
    }
    
    cycleCount.textContent = `Cycle ${currentCycle} of ${CYCLES_BEFORE_LONG_BREAK}`;
  }

  // Start timer
  function startTimer() {
    if (!isRunning) {
      isRunning = true;
      startBtn.disabled = true;
      pauseBtn.disabled = false;
      timerCircle.classList.add("active");
      
      intervalId = setInterval(() => {
        timeLeft--;
        updateDisplay();
        
        if (timeLeft <= 0) {
          clearInterval(intervalId);
          handlePhaseComplete();
        }
      }, 1000);
    }
  }

  // Pause timer
  function pauseTimer() {
    if (isRunning) {
      isRunning = false;
      clearInterval(intervalId);
      startBtn.disabled = false;
      pauseBtn.disabled = true;
      timerCircle.classList.remove("active");
      saveTimerState();
    }
  }

  // Reset timer
  function resetTimer() {
    clearInterval(intervalId);
    isRunning = false;
    timeLeft = WORK_TIME;
    currentCycle = 1;
    isWorkPhase = true;
    isLongBreak = false;
    
    updateDisplay();
    updatePhaseDisplay();
    
    startBtn.disabled = false;
    pauseBtn.disabled = false;
    timerCircle.classList.remove("active");
    
    localStorage.removeItem("pomodoroState");
  }

  // Handle phase completion
  function handlePhaseComplete() {
    timerCircle.classList.remove("active");
    
    if (isWorkPhase) {
      // Work phase completed
      if (currentCycle >= CYCLES_BEFORE_LONG_BREAK) {
        // Start long break
        isLongBreak = true;
        timeLeft = LONG_BREAK;
        currentPhase.textContent = "Long Break Complete!";
        setTimeout(() => {
          alert("Great job! You've completed 4 work cycles. Time for a 20-minute break!");
          updatePhaseDisplay();
        }, 100);
      } else {
        // Start short break
        isWorkPhase = false;
        timeLeft = SHORT_BREAK;
        currentPhase.textContent = "Work Complete!";
        setTimeout(() => {
          alert("Work session complete! Take a 5-minute break.");
          updatePhaseDisplay();
        }, 100);
      }
    } else if (isLongBreak) {
      // Long break completed - reset to cycle 1
      currentCycle = 1;
      isLongBreak = false;
      isWorkPhase = true;
      timeLeft = WORK_TIME;
      currentPhase.textContent = "Long Break Complete!";
      setTimeout(() => {
        alert("Break time over! Ready for a new cycle?");
        updatePhaseDisplay();
      }, 100);
    } else {
      // Short break completed - start next work cycle
      currentCycle++;
      isWorkPhase = true;
      timeLeft = WORK_TIME;
      currentPhase.textContent = "Break Complete!";
      setTimeout(() => {
        alert("Break time over! Starting work session.");
        updatePhaseDisplay();
      }, 100);
    }
    
    updateDisplay();
    saveTimerState();
    
    // Auto-start next phase after a short delay
    setTimeout(() => {
      if (!isRunning) {
        startTimer();
      }
    }, 1000);
  }

  // Event listeners
  startBtn.addEventListener("click", startTimer);
  pauseBtn.addEventListener("click", pauseTimer);
  resetBtn.addEventListener("click", resetTimer);

  // Initialize timer
  updateDisplay();
  updatePhaseDisplay();
  loadTimerState();
});
