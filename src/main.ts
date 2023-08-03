const appDiv = document.getElementById("app") as HTMLDivElement;
appDiv.innerHTML = `<h1>To Do List Project</h1>`;

const button = document.createElement("button");
button.innerHTML = "add Item";
const input = document.createElement("input");
const list = document.createElement("ul");
appDiv.append(input);
appDiv.append(button);
appDiv.append(list);

type Label = "red" | "green" | "yellow" | "blue" | "none";
type Status = "todo" | "doing" | "done";

type BaseTask = {
  id: number;
  title: string;
  label?: Label;
};

type TodoTask = BaseTask & {
  status: "todo";
};

type DoingTask = BaseTask & {
  status: "doing";
  date: number;
};
type DoneTask = BaseTask & {
  status: "done";
  date: number;
};

type Task = TodoTask | DoingTask | DoneTask;

class State {
  data: Task[];
  sortBy: string;
  constructor() {
    this.data = [];
    this.sortBy = "sdfa";
  }
  makeItem(title: string): TodoTask {
    return { id: Math.floor(Math.random() * 10000), title, status: "todo" };
  }
  addItem(title: string) {
    if (title === "") return;
    const item = this.makeItem(title);
    this.data.push(item);
    this.draw();
    console.log(this.data);
  }
  makeItemHtmlElement(task: Task) {
    return `
    <li style="${
      task.label ? `background-color:` + task.label.toLowerCase() : ""
    } ; display:flex ; justify-content: space-between;border:2px solid black;padding:2px">
        <span >${task.title}</span>
        <select id="status-picker-${task.id}">
        ${["todo", "done", "doing"]
          .map(
            (item) =>
              `<option ${
                item === task.status ? 'selected="true"' : ""
              } value="${item}">${item}</option>`
          )
          .join("")}
        </select>
        <label>Label: 
        <select id="label-picker-${task.id}" ">
        ${["None", "Red", "Green", "Blue", "Yellow"]
          .map(
            (item) =>
              `<option ${
                item.toLowerCase() === task.label ? 'selected="true"' : ""
              } value="${item.toLowerCase()}">${item}</option>`
          )
          .join("")}
         
        </select>
        </Label>
        <span>
        ${
          task.status === "doing"
            ? "started at " + new Date(task.date).toUTCString()
            : ""
        }
        ${
          task.status === "done"
            ? "finished at " + new Date(task.date).toUTCString()
            : ""
        }
        </span>
        <button id="delete-btn-${task.id}">delete</button>
    </li>
    `;
  }
  draw(): void {
    console.log(this.data);
    list.innerHTML = "";
    this.data.forEach((task) => {
      list.innerHTML += this.makeItemHtmlElement(task);

      const statusPicker = document.getElementById(
        `status-picker-${task.id}`
      ) as HTMLSelectElement;
      statusPicker.addEventListener("change", () => {
        this.changeItemStatus(task.id, statusPicker.value as Status);
      });

      const labelPicker = document.getElementById(
        `label-picker-${task.id}`
      ) as HTMLSelectElement;
      labelPicker.addEventListener("change", () => {
        this.changeItemLabel(task.id, labelPicker.value as Label);
      });

      const deleteButton = document.getElementById(
        `delete-btn-${task.id}`
      ) as HTMLButtonElement;
      deleteButton.addEventListener("click", () => {
        this.deleteItem(task.id);
      });
    });
  }
  changeItemLabel(id: number, label: Label): void {
    const newData = this.data.map((item: Task) => {
      if (item.id !== id) return item;
      else {
        return { ...item, label: label };
      }
    });
    this.data = newData;
    this.draw();
  }
  changeItemStatus(id: number, status: Status) {
    const newData = this.data.map((task: Task) => {
      if (task.id !== id) return task;

      if (status === "todo") {
        const newTask: TodoTask = {
          status: "todo",
          title: task.title,
          id: task.id,
          label: task.label,
        };
        return newTask;
      }
      if (status === "doing") {
        const newTask: DoingTask = {
          status: "doing",
          title: task.title,
          id: task.id,
          label: task.label,
          date: Date.now(),
        };
        return newTask;
      }
      if (status === "done") {
        const newTask: DoneTask = {
          status: "done",
          title: task.title,
          id: task.id,
          label: task.label,
          date: Date.now(),
        };
        return newTask;
      }
      const checkForNever: never = status;
      return checkForNever;
    });
    this.data = newData;
    this.draw();
  }
  deleteItem(id: number): void {
    const newData = this.data.filter((item) => item.id !== id);
    this.data = newData;
    this.draw();
  }
}

const appState = new State();

button.addEventListener("click", () => {
  appState.addItem(input.value);
  input.value = "";
});
