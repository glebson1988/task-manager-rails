import Vue from 'vue';

const Api = require('./api');

document.addEventListener("DOMContentLoaded", () => {
    var app = new Vue({
        el: '#app',
        components: {
            'task': {
                props: ['task'],
                template: `
            <div class="ui segment task"
                   v-bind:class="task.completed ? 'done' : 'todo' ">
                    <div class="ui grid">
                      <div class="left floated twelve wide column">
                        <div class="ui checkbox">
                          <input type="checkbox" name="task" :checked="task.completed" v-on:click="$root.toggleDone($event, task.id)" >
                          <label>{{ task.name }} <span class="description">{{ task.description }}</span></label>
                        </div>
                      </div>
                      <div class="right floated three wide column">
                        <i class="icon pencil blue" alt="Edit" v-on:click="$root.editTask($event, task.id)"></i>
                        <i class="icon trash red" alt="Delete" v-on:click="$root.deleteTask($event, task.id)"></i>
                      </div>
                    </div>
              </div>
            `
            }
        },
        data: {
            tasks: [],
            task: {},
            action: 'create',
            message: 'Hey there!'
        },
        computed: {
            completedTasks: function () {
                return this.tasks.filter(item => item.completed == true);
            },
            todoTasks: function () {
                return this.tasks.filter(item => item.completed == false);
            },
            nextId: function () {
                return (this.tasks.sort(function (a, b) {
                    return a.id - b.id;
                }))[this.tasks.length - 1].id + 1;
            }
        },
        methods: {
            listTasks: function () {
                Api.listTasks().then(function (resp) {
                    app.tasks = resp;
                })
            },
            clear: function () {
                this.task = {};
                this.action = 'create';
                this.message = '';
            },
            toggleDone: function (event, id) {
                event.stopImmediatePropagation();

                let task = this.tasks.find(item => item.id == id);

                if (task) {
                    task.completed = !task.completed;
                    this.task = task;

                    Api.updateTask(this.task).then(function (resp) {
                        app.listTasks();
                        app.clear();

                        let status = resp.completed ? 'completed' : 'in progress';
                        app.message = `Task ${resp.id} is ${status}`;
                    })
                }
            },
            createTask: function (event) {
                if (!this.task.completed) {
                    this.task.completed = false;
                } else {
                    this.task.completed = true;
                }

                Api.createTask(this.task).then(function (resp) {
                    app.listTasks();
                    app.clear();
                    app.message = `Task ${resp.id} created`
                });
            },
            editTask: function (event, id) {
                event.stopImmediatePropagation();

                this.action = 'edit';

                let task = this.tasks.find(item => item.id == id);

                if (task) {
                    this.task = {id: id, name: task.name, description: task.description, completed: task.completed};
                }
            },
            updateTask: function (event, id) {
                event.stopImmediatePropagation();

                Api.updateTask(this.task).then(function (resp) {
                    app.listTasks();
                    app.clear();
                    app.message = `Task ${resp.id} updated`
                })
            },
            deleteTask: function (event, id) {
                event.stopImmediatePropagation();

                let taskIndex = this.tasks.findIndex(item => item.id == id);

                if (taskIndex > -1) {
                    Api.deleteTask(id).then(function () {
                        app.$delete(app.tasks, taskIndex);
                        app.message = `Task ${id} deleted`
                    });
                }
            }
        },
        beforeMount() {
            this.listTasks()
        }
    });

});
