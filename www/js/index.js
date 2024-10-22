$(function() {
    var dialog, form,
        name = $("#name"),
        allFields = name,
        tips = $(".validateTips"),
        currentTaskDiv;

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
            if (currentTaskDiv) {
                currentTaskDiv.find("p").text(name.val());
            } else {
                var taskDiv = $("<div class='task'>").append($("<p>").text(name.val()));
                var buttonDiv = $("<div class='button-container'>");
                
                var editButton = $("<button>").text("EDIT").on("click", function() {
                    name.val(taskDiv.find("p").text());
                    currentTaskDiv = taskDiv;
                    dialog.dialog("option", "buttons", {
                        "Edit": addTask,
                        Cancel: function() {
                            dialog.dialog("close");
                            currentTaskDiv = null;
                        }
                    });
                    dialog.dialog("open");
                });
                
                var deleteButton = $("<button>").text("X").on("click", function() {
                    taskDiv.remove();
                });
                
                buttonDiv.append(editButton).append(deleteButton);
                taskDiv.append(buttonDiv);
                $("#tasks").append(taskDiv);
            }
            
            dialog.dialog("close");
            currentTaskDiv = null;
        }        
        return valid;
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
                currentTaskDiv = null;
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
                currentTaskDiv = null;
            }
        });
        dialog.dialog("open");
        currentTaskDiv = null;
    });
});
