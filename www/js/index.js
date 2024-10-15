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

        valid = valid && checkLength(name, "task name", 3, 16);

        if (valid) {
            $("#tasks ul").append($("<li>").text(name.val()));
            dialog.dialog("close");
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
        dialog.dialog("open");
    });
});
