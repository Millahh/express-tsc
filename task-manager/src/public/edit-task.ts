import axios from "axios"

// type DOM elements
const taskIDDOM = document.querySelector<HTMLSpanElement>('.task-edit-id')!
const taskNameDOM = document.querySelector<HTMLInputElement>('.task-edit-name')!
const taskCompletedDOM = document.querySelector<HTMLInputElement>('.task-edit-completed')!
const editFormDOM = document.querySelector<HTMLFormElement>('.single-task-form')!
const editBtnDOM = document.querySelector<HTMLButtonElement>('.task-edit-btn')!
const formAlertDOM = document.querySelector<HTMLDivElement>('.form-alert')!

// take id from query params
const params = window.location.search
const id = new URLSearchParams(params).get('id') as string
let tempName: string

// define task type
interface Task {
  _id: string
  name: string
  completed: boolean
}

// show task
const showTask = async (): Promise<void> => {
  try {
    const { data }: { data: { task: Task } } = await axios.get(`/api/v1/tasks/${id}`)
    const { _id: taskID, completed, name } = data.task

    taskIDDOM.textContent = taskID
    taskNameDOM.value = name
    tempName = name
    if (completed) {
      taskCompletedDOM.checked = true
    }
  } catch (error) {
    console.error(error)
  }
}

showTask()

// edit task
editFormDOM.addEventListener('submit', async (e: Event) => {
  e.preventDefault()
  editBtnDOM.textContent = 'Loading...'
  try {
    const taskName = taskNameDOM.value
    const taskCompleted = taskCompletedDOM.checked

    const { data }: { data: { task: Task } } = await axios.patch(`/api/v1/tasks/${id}`, {
      name: taskName,
      completed: taskCompleted,
    })

    const { _id: taskID, completed, name } = data.task

    taskIDDOM.textContent = taskID
    taskNameDOM.value = name
    tempName = name
    if (completed) {
      taskCompletedDOM.checked = true
    }

    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = 'success, edited task'
    formAlertDOM.classList.add('text-success')
  } catch (error) {
    console.error(error)
    taskNameDOM.value = tempName
    formAlertDOM.style.display = 'block'
    formAlertDOM.innerHTML = 'error, please try again'
  }
  editBtnDOM.textContent = 'Edit'
  setTimeout(() => {
    formAlertDOM.style.display = 'none'
    formAlertDOM.classList.remove('text-success')
  }, 3000)
})
