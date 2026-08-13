(() => {
  "use strict";

  const STORAGE_KEYS = {
    tasks: "todoLifeDashboard.tasks",
    links: "todoLifeDashboard.links"
  };

  const DEFAULT_LINKS = [
    { id: "default-google", name: "Google", url: "https://www.google.com/" },
    { id: "default-youtube", name: "YouTube", url: "https://www.youtube.com/" },
    { id: "default-github", name: "GitHub", url: "https://github.com/" }
  ];

  const state = {
    tasks: load(STORAGE_KEYS.tasks, []),
    links: load(STORAGE_KEYS.links, DEFAULT_LINKS),
    timer: {
      duration: 25 * 60,
      remaining: 25 * 60,
      intervalId: null
    }
  };

  const $ = (selector) => document.querySelector(selector);

  const elements = {
    greeting: $("#greeting"),
    time: $("#current-time"),
    date: $("#current-date"),
    timerDisplay: $("#timer-display"),
    timerProgress: $("#timer-progress-bar"),
    timerStatus: $("#timer-status"),
    taskForm: $("#task-form"),
    taskInput: $("#task-input"),
    taskList: $("#task-list"),
    taskCount: $("#task-count"),
    emptyTasks: $("#empty-tasks"),
    links: $("#quick-links"),
    emptyLinks: $("#empty-links"),
    linkForm: $("#link-form"),
    linkName: $("#link-name"),
    linkUrl: $("#link-url"),
    openLinkForm: $("#open-link-form"),
    cancelLink: $("#cancel-link")
  };

  function load(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      console.warn(`Could not load ${key} from Local Storage.`, error);
      return fallback;
    }
  }

  function save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Could not save ${key} to Local Storage.`, error);
    }
  }

  function createId(prefix) {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return `${prefix}-${window.crypto.randomUUID()}`;
    }
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function updateDateTime() {
    const now = new Date();
    const hour = now.getHours();

    let greeting = "Good evening";
    if (hour >= 5 && hour < 12) {
      greeting = "Good morning";
    } else if (hour >= 12 && hour < 18) {
      greeting = "Good afternoon";
    }

    elements.greeting.textContent = greeting;
    elements.time.textContent = now.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });
    elements.date.textContent = now.toLocaleDateString(undefined, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }

  function renderTasks() {
    elements.taskList.innerHTML = "";

    const tasks = [...state.tasks].sort((a, b) => {
      if (a.done !== b.done) return Number(a.done) - Number(b.done);
      return b.createdAt - a.createdAt;
    });

    tasks.forEach((task) => {
      const item = document.createElement("li");
      item.className = `task-item${task.done ? " done" : ""}`;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "task-check";
      checkbox.checked = task.done;
      checkbox.setAttribute("aria-label", `Mark ${task.text} as done`);
      checkbox.addEventListener("change", () => toggleTask(task.id));

      const text = document.createElement("span");
      text.className = "task-text";
      text.textContent = task.text;

      const actions = document.createElement("div");
      actions.className = "task-actions";

      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.className = "small-button";
      editButton.textContent = "Edit";
      editButton.addEventListener("click", () => editTask(task.id));

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "small-button";
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => deleteTask(task.id));

      actions.append(editButton, deleteButton);
      item.append(checkbox, text, actions);
      elements.taskList.appendChild(item);
    });

    const total = state.tasks.length;
    const remaining = state.tasks.filter((task) => !task.done).length;
    elements.taskCount.textContent = `${remaining} open / ${total} total`;
    elements.emptyTasks.classList.toggle("hidden", total > 0);
  }

  function addTask(event) {
    event.preventDefault();
    const text = elements.taskInput.value.trim();
    if (!text) return;

    state.tasks.push({
      id: createId("task"),
      text,
      done: false,
      createdAt: Date.now()
    });

    save(STORAGE_KEYS.tasks, state.tasks);
    elements.taskInput.value = "";
    elements.taskInput.focus();
    renderTasks();
  }

  function toggleTask(id) {
    const task = state.tasks.find((item) => item.id === id);
    if (!task) return;

    task.done = !task.done;
    save(STORAGE_KEYS.tasks, state.tasks);
    renderTasks();
  }

  function editTask(id) {
    const task = state.tasks.find((item) => item.id === id);
    if (!task) return;

    const updated = window.prompt("Edit task:", task.text);
    if (updated === null) return;

    const text = updated.trim();
    if (!text) return;

    task.text = text;
    save(STORAGE_KEYS.tasks, state.tasks);
    renderTasks();
  }

  function deleteTask(id) {
    state.tasks = state.tasks.filter((task) => task.id !== id);
    save(STORAGE_KEYS.tasks, state.tasks);
    renderTasks();
  }

  function renderLinks() {
    elements.links.innerHTML = "";

    state.links.forEach((link) => {
      const item = document.createElement("div");
      item.className = "link-item";

      const main = document.createElement("div");
      main.className = "link-main";

      const icon = document.createElement("div");
      icon.className = "link-icon";
      icon.textContent = link.name.charAt(0).toUpperCase();

      const anchor = document.createElement("a");
      anchor.href = link.url;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      anchor.textContent = link.name;
      anchor.title = link.url;

      main.append(icon, anchor);

      const actions = document.createElement("div");
      actions.className = "task-actions";

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "small-button";
      deleteButton.textContent = "Remove";
      deleteButton.addEventListener("click", () => deleteLink(link.id));

      actions.appendChild(deleteButton);
      item.append(main, actions);
      elements.links.appendChild(item);
    });

    elements.emptyLinks.classList.toggle("hidden", state.links.length > 0);
  }

  function addLink(event) {
    event.preventDefault();

    const name = elements.linkName.value.trim();
    let url = elements.linkUrl.value.trim();

    if (!name || !url) return;

    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }

    try {
      const parsed = new URL(url);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        throw new Error("Unsupported protocol");
      }
    } catch {
      window.alert("Please enter a valid website URL.");
      return;
    }

    state.links.push({
      id: createId("link"),
      name,
      url
    });

    save(STORAGE_KEYS.links, state.links);
    elements.linkForm.reset();
    elements.linkForm.classList.add("hidden");
    renderLinks();
  }

  function deleteLink(id) {
    state.links = state.links.filter((link) => link.id !== id);
    save(STORAGE_KEYS.links, state.links);
    renderLinks();
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  function renderTimer() {
    const { duration, remaining } = state.timer;
    elements.timerDisplay.textContent = formatTime(remaining);
    const progress = ((duration - remaining) / duration) * 100;
    elements.timerProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }

  function startTimer() {
    if (state.timer.intervalId !== null) return;

    elements.timerStatus.textContent = "Focus session running…";

    state.timer.intervalId = window.setInterval(() => {
      state.timer.remaining -= 1;
      renderTimer();

      if (state.timer.remaining <= 0) {
        stopTimer();
        elements.timerStatus.textContent = "Focus session complete! 🎉";
        window.alert("25-minute focus session complete!");
      }
    }, 1000);
  }

  function stopTimer() {
    if (state.timer.intervalId !== null) {
      window.clearInterval(state.timer.intervalId);
      state.timer.intervalId = null;
    }

    if (state.timer.remaining > 0) {
      elements.timerStatus.textContent = "Timer stopped. Resume whenever you're ready.";
    }
  }

  function resetTimer() {
    stopTimer();
    state.timer.remaining = state.timer.duration;
    elements.timerStatus.textContent = "Ready when you are.";
    renderTimer();
  }

  elements.taskForm.addEventListener("submit", addTask);
  $("#timer-start").addEventListener("click", startTimer);
  $("#timer-stop").addEventListener("click", stopTimer);
  $("#timer-reset").addEventListener("click", resetTimer);

  elements.openLinkForm.addEventListener("click", () => {
    elements.linkForm.classList.toggle("hidden");
    if (!elements.linkForm.classList.contains("hidden")) {
      elements.linkName.focus();
    }
  });

  elements.cancelLink.addEventListener("click", () => {
    elements.linkForm.reset();
    elements.linkForm.classList.add("hidden");
  });

  elements.linkForm.addEventListener("submit", addLink);

  updateDateTime();
  window.setInterval(updateDateTime, 1000);
  renderTimer();
  renderTasks();
  renderLinks();
})();
