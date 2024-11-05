$(function() {
    var dialog, form,
        name = $("#name"),
        allFields = name,
        tips = $(".validateTips");

    function updateTips(t) {
        tips.text(t).addClass("ui-state-highlight");
        setTimeout(function() {
            tips.removeClass("ui-state-highlight");
        }, 1500);
    }

    function checkLength(o, n, min, max) {
        var length = o.val().length;
        if (length > max || length < min) {
            o.addClass("ui-state-error");
            updateTips("Length of " + n + " must be between " + min + " and " + max + ".");
            return false;
        }
        return true;
    }

    function addTask() {
        var valid = true;
        allFields.removeClass("ui-state-error");
        valid = valid && checkLength(name, "task name", 3, 100);

        if (valid) {
            var taskTitle = name.val();
            var taskPanel = $("<h3>").text(taskTitle);
            var taskContent = $("<div>").append($("<div class='button-container' style='display:none;'>"));

            var editButton = $("<button>").text("EDIT").on("click", function() {
                editTask(taskTitle);
            });
            var deleteButton = $("<button>").text("X").on("click", function() {
                removeTask(taskTitle);
            });

            taskContent.find('.button-container').append(editButton).append(deleteButton);
            $("#accordion").append(taskPanel).append(taskContent);
            refreshAccordion();

            // Guardar la nueva tarea en localStorage
            saveTaskToLocalStorage(taskTitle);

            dialog.dialog("close");
        }
        return valid;
    }

    function editTask(oldTitle) {
        name.val(oldTitle);
        dialog.dialog("option", "buttons", {
            "Edit": function() {
                var newTitle = name.val();

                // Actualizar en el DOM
                $("#accordion h3").filter(function() {
                    return $(this).text() === oldTitle;
                }).text(newTitle);
                
                // Actualizar en localStorage
                updateTaskInLocalStorage(oldTitle, newTitle);
                refreshAccordion();
                dialog.dialog("close");
            },
            Cancel: function() {
                dialog.dialog("close");
            }
        });
        dialog.dialog("open");
    }

    function removeTask(taskTitle) {
        // Eliminar del DOM
        $("#accordion h3").filter(function() {
            return $(this).text() === taskTitle;
        }).remove();
        $("#accordion div:has(h3:contains('" + taskTitle + "'))").remove();

        // Eliminar de localStorage
        deleteTaskFromLocalStorage(taskTitle);

        refreshAccordion();
    }

    function saveTaskToLocalStorage(taskTitle) {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push(taskTitle);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function updateTaskInLocalStorage(oldTitle, newTitle) {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const index = tasks.indexOf(oldTitle);
        if (index !== -1) {
            tasks[index] = newTitle;
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }
    }

    function deleteTaskFromLocalStorage(taskTitle) {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks = tasks.filter(task => task !== taskTitle);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasksFromLocalStorage() {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(function(taskTitle) {
            var taskPanel = $("<h3>").text(taskTitle);
            var taskContent = $("<div>").append($("<div class='button-container' style='display:none;'>"));

            var editButton = $("<button>").text("EDIT").on("click", function() {
                editTask(taskTitle);
            });
            var deleteButton = $("<button>").text("X").on("click", function() {
                removeTask(taskTitle);
            });

            taskContent.find('.button-container').append(editButton).append(deleteButton);
            $("#accordion").append(taskPanel).append(taskContent);
        });
        refreshAccordion();
    }

    function refreshAccordion() {
        $("#accordion").accordion("refresh");
    }

    dialog = $("#dialog-form").dialog({
        autoOpen: false,
        height: 400,
        width: 350,
        modal: true,
        buttons: {
            "Create Task": addTask,
            Cancel: function() {
                dialog.dialog("close");
            }
        },
        close: function() {
            form[0].reset();
            allFields.removeClass("ui-state-error");
        }
    });

    form = dialog.find("form").on("submit", function(event) {
        event.preventDefault();
        addTask();
    });

    $("#create-task").button().on("click", function() {
        dialog.dialog("option", "buttons", {
            "Create Task": addTask,
            Cancel: function() {
                dialog.dialog("close");
            }
        });
        dialog.dialog("open");
    });

    // Inicializa el accordion
    $("#accordion").accordion({
        collapsible: true,
        heightStyle: "content",
        activate: function(event, ui) {
            if (ui.newHeader.length) {
                // Mostrar los botones al hacer clic en el panel
                ui.newPanel.find('.button-container').show();
            }
            if (ui.oldHeader.length) {
                // Ocultar los botones al cerrar el panel
                ui.oldPanel.find('.button-container').hide();
            }
        }
    });

    // Cargar las tareas desde localStorage al cargar la página
    loadTasksFromLocalStorage();
});
