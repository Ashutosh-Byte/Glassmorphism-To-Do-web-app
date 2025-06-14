document.addEventListener("DOMContentLoaded", () => {
  const taskinput = document.querySelector("#task-input");
  const addtaskbtn = document.querySelector("#add-task-btn");
  const tasklist = document.querySelector("#task-list");
  const emptyimage = document.querySelector(".empty-image");
  const todocontainer = document.querySelector(".to-do-container");
  const progressnumbers = document.querySelector("#number");
  const toggleEmptyState = () => {
    emptyimage.style.display =
      tasklist.children.length === 0 ? "block" : "none";
    todocontainer.style.width = tasklist.children.length > 0 ? "100%" : "50%";
  };

  const updateProgress = (checkCompletion = true) => {
    const totalTasks = tasklist.children.length;
    const completedTasks =
      tasklist.querySelectorAll(".checkbox:checked").length;
    progressbar.style.width = totalTasks
      ? `${(completedTasks / totalTasks) * 100}%`
      : "0%";
    progressnumbers.textContent = `${completedTasks} / ${totalTasks}`;

    if (checkCompletion && totalTasks > 0 && completedTasks == totalTasks) {
      Confeti();
    }
  };

  const saveTaskToLocalStorage = () => {
    const tasks = Array.from(tasklist.querySelectorAll("li")).map((li) => ({
      text: li.querySelector("span").textContent,
      completed: li.querySelector(".checkbox").checked,
    }));
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const loadTasksFromLocalStorage = () => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach(({ text, completed }) =>
      addtask(text, completed, false)
    );
    toggleEmptyState();
    updateProgress();
  };
  const addtask = (text, completd = false, checkCompletion = true) => {
    const tasktext = text || taskinput.value.trim();
    if (!tasktext) {
      return;
    } else {
      const li = document.createElement("li");
      li.innerHTML = `<input type='checkbox' ${
        completd ? "checked" : ""
      }class="checkbox"> 
      <span>${tasktext}</span>
      <div class="task-buttons">
        <button class="edit-btn">
          <i class="fa-solid fa-pen"></i></button>
         <button class='delete-btn'> <i class="fa-solid fa-trash"></i>
        </button>
      </div>`;
      const editbtn = li.querySelector(".edit-btn");
      const checkbox = li.querySelector(".checkbox");
      if (completd) {
        li.classList.add("completed");
        editbtn.disabled = true;
        editbtn.style.opacity = "0.5";
        editbtn.style.pointerEvents = "none";
      }

      checkbox.addEventListener("change", () => {
        const isChecked = checkbox.checked;
        li.classList.toggle("completed", isChecked);
        editbtn.disabled = isChecked;
        editbtn.style.opacity = isChecked ? "0.5" : "1";
        editbtn.style.pointerEvents = isChecked ? "none" : "auto";
        updateProgress();
        saveTaskToLocalStorage();
      });

      li.querySelector(".edit-btn").addEventListener("click", () => {
        if (!checkbox.checked) {
          taskinput.value = li.querySelector("span").textContent;
          li.remove();
          toggleEmptyState();
          updateProgress(false);
          saveTaskToLocalStorage();
        }
      });

      li.querySelector(".delete-btn").addEventListener("click", () => {
        li.remove();

        toggleEmptyState();
        updateProgress();
        saveTaskToLocalStorage();
      });

      tasklist.appendChild(li);
      taskinput.value = "";
      toggleEmptyState();
      updateProgress(checkCompletion);
      saveTaskToLocalStorage();
    }
  };
  addtaskbtn.addEventListener("click", () => addtask());
  taskinput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addtask();
    }
  });
  loadTasksFromLocalStorage();
});

const Confeti = () => {
  const count = 200,
    defaults = {
      origin: { y: 0.7 },
    };

  function fire(particleRatio, opts) {
    confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
      })
    );
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};
