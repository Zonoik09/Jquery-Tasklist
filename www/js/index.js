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
                taskPanel.remove();
                taskContent.remove();
                refreshAccordion();
            });

            taskContent.find('.button-container').append(editButton).append(deleteButton);
            $("#accordion").append(taskPanel).append(taskContent);
            refreshAccordion();

            dialog.dialog("close");
        }        
        return valid;
    }

    function editTask(oldTitle) {
        name.val(oldTitle);
        dialog.dialog("option", "buttons", {
            "Edit": function() {
                var newTitle = name.val();
                $("#accordion h3").filter(function() {
                    return $(this).text() === oldTitle;
                }).text(newTitle);
                refreshAccordion();
                dialog.dialog("close");
            },
            Cancel: function() {
                dialog.dialog("close");
            }
        });
        dialog.dialog("open");
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
});
