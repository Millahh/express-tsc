import axios from "axios";

// type DOM elements
const tasksDOM = document.querySelector<HTMLDivElement>('.tasks')!;
const loadingDOM = document.querySelector<HTMLDivElement>('.loading-text')!;
const formDOM = document.querySelector<HTMLFormElement>('.task-form')!;
const taskInputDOM = document.querySelector<HTMLInputElement>('.task-input')!;
const formAlertDOM = document.querySelector<HTMLDivElement>('.form-alert')!;

// type for Task object
interface Task {
  _id: string;
  name: string;
  completed: boolean;
}

// Load tasks from /api/tasks
const showTasks = async (): Promise<void> => {
  loadingDOM.style.visibility = 'visible';

  try {
    const { data } = await axios.get<{ tasks: Task[] }>('/api/v1/tasks');
    const tasks = data.tasks;

    if (tasks.length < 1) {
      tasksDOM.innerHTML = '<h5 class="empty-list">No tasks in your list</h5>';
      loadingDOM.style.visibility = 'hidden';
      return;
    }

    const allTasks = tasks
      .map(({ completed, _id: taskID, name }) => {
        return `<div class="single-task ${completed ? 'task-completed' : ''}">
  <h5><span><i class="far fa-check-circle"></i></span>${name}</h5>
  <div class="task-links">
    <!-- edit link -->
    <a href="task.html?id=${taskID}" class="edit-link">
      <i class="fas fa-edit"></i>
    </a>
    <!-- delete btn -->
    <button type="button" class="delete-btn" data-id="${taskID}">
      <i class="fas fa-trash"></i>
    </button>
  </div>
</div>`;
      })
      .join('');

    tasksDOM.innerHTML = allTasks;
  } catch (error) {
    tasksDOM.innerHTML =
      '<h5 class="empty-list">There was an error, please try later....</h5>';
  }

  loadingDOM.style.visibility = 'hidden';
};

showTasks();

// delete task /api/tasks/:id
tasksDOM.addEventListener('click', async (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  const parent = target.closest('.delete-btn') as HTMLButtonElement | null;

  if (parent) {
    loadingDOM.style.visibility = 'visible';
    const id = parent.dataset.id;

    if (!id) return;

    try {
      await axios.delete(`/api/v1/tasks/${id}`);
      showTasks();
    } catch (error) {
      console.error(error);
    }

    loadingDOM.style.visibility = 'hidden';
  }
});

// form submission
formDOM.addEventListener('submit', async (e: SubmitEvent) => {
  e.preventDefault();
  const name = taskInputDOM.value;

  try {
    await axios.post('/api/v1/tasks', { name });
    showTasks();
    taskInputDOM.value = '';

    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent = 'Success, task added';
    formAlertDOM.classList.add('text-success');
  } catch (error) {
    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent = 'Error, please try again';
  }

  setTimeout(() => {
    formAlertDOM.style.display = 'none';
    formAlertDOM.classList.remove('text-success');
  }, 3000);
});
