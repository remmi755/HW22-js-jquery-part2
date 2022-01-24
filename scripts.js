let getJSON = function (url) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        xhr.responseType = 'json';
        xhr.onload = function () {
            let status = xhr.status;
            if (status === 200) {
                resolve(xhr.response);
            } else {
                reject(status);
            }
        };
        xhr.send();
    });
};

let saveJSON = function (url, data) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('post', url, true);
        xhr.setRequestHeader(
            'Content-type', 'application/json; charset=utf-8'
        );
        xhr.responseType = 'json';
        xhr.onload = function () {
            let status = xhr.status;
            resolve(xhr.response);
        };
        xhr.onerror = function (e) {
            reject("Error fetching " + url);
        };
        xhr.send(data);
    });
};

let changeJSON = function (url, data) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('put', url, true);
        xhr.setRequestHeader(
            'Content-type', 'application/json; charset=utf-8'
        );
        xhr.responseType = 'json';
        xhr.onload = function () {
            let status = xhr.status;
            resolve(xhr.response);
        };
        xhr.onerror = function (e) {
            reject("Error fetching " + url);
        };
        xhr.send(data);
    });
};

let deleteJSON = function (url, data) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('delete', url, true);
        xhr.setRequestHeader(
            'Content-type', 'application/json; charset=utf-8'
        );
        xhr.responseType = 'json';
        xhr.onload = function () {
            let status = xhr.status;
            resolve(xhr.response);
        };
        xhr.onerror = function (e) {
            reject("Error fetching " + url);
        };
        xhr.send(data);
    });
};

let list = document.getElementById('list');
let btnCreate = document.getElementById('btn')
let input = document.getElementById('input')
let form = document.getElementById('form')
let url = 'http://localhost:3000/todos'

class TodoList {
    constructor(el) {
        this.el = el;
        el.addEventListener('click', (e) => {
            let elemParentTarget = e.target.closest('li')
            let id = elemParentTarget.dataset.id
            if (e.target.className === 'set-status') {
                this.changeComplited(url, id)
            } else if (e.target.className === 'delete-task') {
                this.deleteTask(url, id)
                elemParentTarget.remove()
            }
        })
    }

    async changeComplited(url, id) {
        try {
            let result = await getJSON(url + "/" + id)
            let newResult = await todo1.changeStatus(result)
            await changeJSON(url + "/" + id, JSON.stringify(newResult))
            let data = await getJSON(url)
            await todo1.render(data)
        } catch (err) {
            console.log(err)
        }
    }

    async showTodos(url) {
        try {
            let data = await getJSON(url)
            console.log(data)
            todo1.render(data)
        } catch (err) {
            console.log(err)
        }
    }

    render(arr) {
        let lis = '';
        for (let el of arr) {
            if (!el) {
                return;
            }
            if (el.complited === true) {
                lis += `<li  class="active" data-status="${el.complited}" data-id="${el.id}">${el.task}<button class = "set-status">Change status</button><button class="delete-task">Delete</button></li>`;
            } else if (el.complited === false) {
                lis += `<li  class="no-active" data-status="${el.complited}" data-id="${el.id}">${el.task}<button class = "set-status">Change status</button><button class="delete-task">Delete</button></li>`;
            }
        }
        this.el.innerHTML = lis;
    }

    changeStatus(task) {
        task.complited = !task.complited;
        return task
    }

    async deleteTask(url, id) {
        try {
            await deleteJSON(url + "/" + id)
        } catch (err) {
            console.log(err)
        }
    }

}

class Task {
    constructor() {
        this.task = input.value;
        this.complited = false;
    }

    async addNewTask(url, json) {
        try {
            let res = await saveJSON(url, json)
            list.insertAdjacentHTML("beforeend", `<li  class="no-active" data-status="${res.complited}" data-id="${res.id}">${res.task}<button class = "set-status">Change status</button><button class="delete-task">Delete</button></li>`)
        } catch (err) {
            console.log(err)
        }
    }
}

let task = new Task()
let todo1 = new TodoList(list);
todo1.showTodos(url)
form.addEventListener('click', function (e) {
    if (e.target === btnCreate) {
        if (input.value !== '') {
            let json = JSON.stringify(new Task())
            task.addNewTask(url, json)
            input.value = ''
        }
    }
})
