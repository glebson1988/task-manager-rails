import axios from 'axios';

export function listTasks() {
    return axios.get('/tasks.json').then((resp) => {
        return resp.data;
    });
}
