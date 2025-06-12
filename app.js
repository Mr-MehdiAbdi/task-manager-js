const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const addBtn = document.getElementById("addBtn");

const searchInput = document.getElementById("searchInput");
const priorityFilter = document.getElementById("priorityFilter");
const sortFilter = document.getElementById("sortFilter");

const taskList = document.getElementById("taskList");

const tasks = [];

function createTask(text) {
  return function (priority) {
    return {
      text,
      priority,
      createdAt: Date.now(),
    };
  };
}
function render(taskArray) {
  taskList.innerHTML = "";
  if (taskArray.length === 0) {
    const emptyMessage = document.getElementById("li");
    emptyMessage.textContent = "empty tasks";
    taskList.appendChild(emptyMessage);
    return;
  }
  taskArray.forEach((task) => {
    const li = document.createElement("li");
    li.textContent = `${task.text} (${task.priority}) 
    - ${new Date(task.createdAt).toLocaleString("en-US")}`;
    taskList.appendChild(li);
  });
}
function createFilter(searchText) {
  return function (priority) {
    return function (sortOrder) {
      return function (tasks) {
        return tasks
          .filter((task) =>
            task.text.toLowerCase().includes(searchText.toLowerCase().trim())
          )
          .filter((p) => (priority === "All" ? true : p.priority === priority))
          .sort((a, b) =>
            sortOrder === "Latest"
              ? b.createdAt - a.createdAt
              : a.createdAt - b.createdAt
          );
      };
    };
  };
}
addBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  const priority = priorityInput.value;
  if (text === "") {
    alert("Please enter a task");
    return;
  }
  const newTask = createTask(text)(priority);
  tasks.push(newTask);
  taskInput.value = "";
  update();
});
function update() {
  const filter = createFilter(searchInput.value)(priorityFilter.value)(
    sortFilter.value
  );
  const result = filter(tasks);
  render(result);
}
searchInput.addEventListener("input", update);
priorityFilter.addEventListener("change", update);
sortFilter.addEventListener("change", update);
update();
