let $list = $('#list');
let $input = $('#input')
let $btn = $('#btn')
let $url = 'http://localhost:3000/todos'

class TodoList {
    constructor(el) {
        this.el = el;
        $list.on('click', 'li', (e) => {
            let $elemParentTarget = $(e.target.closest('li'))
            let id = $elemParentTarget.data('id')
            if ($(e.target).hasClass('set-status')) {
                todo1.changeComplited($url, id)
            } else if ($(e.target).hasClass('delete-task')) {
                todo1.deleteTask($url, id)
                $elemParentTarget.remove()
            }
        })
    }

    changeComplited(url, id) {
        $.ajax($url + "/" + id)
            .done(function (data) {
                todo1.changeStatus(data)
                $.ajax({
                    type: "PUT",
                    url: $url + "/" + id,
                    data: data,
                    success: function (data) {
                        $.ajax($url)
                            .done(function (data) {
                                todo1.render(data)
                            })
                    },
                    error: function (err) {
                    }
                });
            });

    }

    showTodos(url) {
        $.ajax(url)
            .done(function (data) {
                todo1.render(data);
            })
            .fail(function (err) {
                console.log("error", err);
            })
    }

    render(arr) {
        let lis = '';
        for (let el of arr) {
            if (!el) {
                return;
            }
            if (JSON.parse(el.complited) === true) {
                lis += `<li  class="active" data-status="${el.complited}" data-id="${el.id}">${el.task}<button class = "set-status">Change status</button><button class="delete-task">Delete</button></li>`;
            } else if (JSON.parse(el.complited) === false) {
                lis += `<li  class="no-active" data-status="${el.complited}" data-id="${el.id}">${el.task}<button class = "set-status">Change status</button><button class="delete-task">Delete</button></li>`;
            }
        }
        $list.html(lis);
    }

    changeStatus(task) {
        task.complited = !JSON.parse(task.complited);
    }

    deleteTask(url, id) {
        $.ajax({
            url: $url + `/` + id,
            type: 'DELETE',
            dataType: 'json',
        });
    }
}

let todo1 = new TodoList($list);
todo1.showTodos($url)

class Task {
    constructor() {
        this.task = $input.val();
        this.complited = false;
    }

    addNewTask(url, data) {
        $.ajax({
            url: $url,
            method: 'post',
            dataType: 'json',
            data: new Task(),
            success: function (data) {
                $list.append($(`<li  class="no-active" data-status="${data.complited}" data-id="${data.id}">${data.task}<button class = "set-status">Change status</button><button class="delete-task">Delete</button></li>`));
            },
            error: function (err) {
                console.log(err)
            }
        });
    }
}

let task = new Task()

$btn.on('click', function (e) {
    if ($input.val() !== '') {
        let json = JSON.stringify(task)
        task.addNewTask($url, json)
        $input.val('')
        e.preventDefault();
    }
})
