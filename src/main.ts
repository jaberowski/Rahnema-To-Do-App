const appDiv = document.getElementById("app") as HTMLDivElement;
appDiv.innerHTML = `<h1>To Do List Project</h1>`;

const button = document.createElement("button");
button.innerHTML = "add Item";
const input = document.createElement("input");
const list = document.createElement("ul");
appDiv.append(input);
appDiv.append(button);
appDiv.append(list);

// const filterBox = document.createElement("div");
// const filterBoxHeader = document.createElement("h3");
// filterBox.innerText = "filter";
// const filterLabelPicker = document.createElement("select");
// const labelArrays = ["red", "green", "yellow", "blue", "none"];
// const labelOptionElements = labelArrays.map((item) => {
//   const optionElement = document.createElement("option");
//   optionElement.style.backgroundColor = item;
//   optionElement.innerHTML = item;
//   return optionElement;
// });
// filterLabelPicker.append(...labelOptionElements);
// filterBox.append(filterLabelPicker);
// appDiv.append(filterBox);

type Label = "red" | "green" | "yellow" | "blue" | "none";

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
type Status = Task["status"];

class State {
  data: Task[];
  filterBy: {
    label: Label | undefined;
    status: Status | undefined;
    title: string | undefined;
  };
  constructor() {
    this.data = [
      {
        status: "done",
        title: "watch football",
        id: 918,
        label: "red",
        date: 1691141571889,
      },
      {
        status: "done",
        title: "sleep",
        id: 6620,
        label: "green",
        date: 1691141574465,
      },
      { id: 5901, title: "eat", status: "todo", label: "blue" },
      {
        status: "doing",
        title: "movie",
        id: 2234,
        label: "red",
        date: 1691141580904,
      },
      {
        status: "done",
        title: "rest",
        id: 2786,
        label: "yellow",
        date: 1691141587376,
      },
    ];

    this.filterBy = { label: undefined, status: undefined, title: undefined };
  }
  makeItem(title: string): TodoTask {
    return { id: Math.floor(Math.random() * 10000), title, status: "todo" };
  }
  addItem(title: string): void {
    if (title === "") return;
    const newItem = this.makeItem(title);
    this.data = [...this.data, newItem];
    this.draw();
    console.log(this.data);
  }
  makeItemHtmlElement(task: Task): string {
    return `
    <li style="${
      task.label ? `background-color:` + task.label.toLowerCase() : ""
    } ; display:flex ; justify-content: space-between;border:2px solid black;padding:2px">
        <span >${task.title}</span>
        <select class="status-picker" data-id="${task.id}">
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
        <select class="label-picker" data-id="${task.id}" >
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
        <button class="delete-btn" data-id="${task.id}">delete</button>
    </li>
    `;
  }
  draw(): void {
    list.innerHTML = "";

    const filteredData = this.filterData();

    filteredData.forEach((task) => {
      list.innerHTML += this.makeItemHtmlElement(task);
    });

    const allStatusPickers = document.querySelectorAll(
      ".status-picker"
    ) as NodeListOf<HTMLSelectElement>;
    allStatusPickers.forEach((statusPicker) => {
      const id = Number(statusPicker.dataset.id);
      statusPicker.addEventListener("change", () => {
        this.changeItemStatus(id, statusPicker.value as Status);
      });
    });

    const allLabelPickers = document.querySelectorAll(
      ".label-picker"
    ) as NodeListOf<HTMLSelectElement>;
    allLabelPickers.forEach((labelPicker) => {
      const id = Number(labelPicker.dataset.id);
      labelPicker.addEventListener("change", () => {
        this.changeItemLabel(id, labelPicker.value as Label);
      });
    });

    const allDeleteBtn = document.querySelectorAll(
      ".delete-btn"
    ) as NodeListOf<HTMLButtonElement>;
    allDeleteBtn.forEach((deleteButton) => {
      deleteButton.addEventListener("click", () => {
        const id = Number(deleteButton.dataset.id);
        this.deleteItem(id);
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
  filterData(): Task[] {
    const dataFirstFilter = this.filterBy.label
      ? this.filterByLabel(this.filterBy.label, this.data)
      : [...this.data];
    const dataSecondFilter = this.filterBy.status
      ? this.filterByStatus(this.filterBy.status, dataFirstFilter)
      : [...dataFirstFilter];
    const dataThirdFilter = this.filterBy.title
      ? this.filterBYTitle(this.filterBy.title, dataSecondFilter)
      : [...dataSecondFilter];

    return dataThirdFilter;
  }
  filterByLabel(label: Label, arr = this.data): Task[] {
    return arr.filter((task) => task.label === label);
  }
  filterByStatus(status: Status, arr = this.data): Task[] {
    return arr.filter((task) => task.status === status);
  }
  filterBYTitle(queryString: string, arr = this.data): Task[] {
    return arr.filter((task) => task.title.includes(queryString));
  }
}

const appState = new State();
appState.draw();

button.addEventListener("click", () => {
  appState.addItem(input.value);
  input.value = "";
});
