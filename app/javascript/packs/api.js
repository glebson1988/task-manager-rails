import axios from 'axios';

export function listTasks() {
    return axios.get('/tasks.json').then((resp) => {
        return resp.data;
    });
}

export function createTask(task) {
    var localTask = task;

    delete localTask.id

    return axios.post('/tasks.json', localTask)
        .then(function (resp) {
            return resp.data;
        })
        .catch(function (error) {
            console.log(error);
        });
}

export function updateTask(task) {
    var taskId = task.id;
    var localTask = {
        name: task.name,
        description: task.description,
        completed: task.completed
    }

    return axios.put(`tasks/${taskId}.json`, localTask)
        .then(function (resp) {
            return resp.data;
        })
        .catch(function (error) {
            console.log(error);
        });
}

export function deleteTask(task_id) {
    return axios.delete(`tasks/${task_id}.json`)
        .then(function (resp) {
            return 'success';
        })
        .catch(function (error) {
            console.log(error);
        });
}
