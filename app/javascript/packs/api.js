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
