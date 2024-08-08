// Get Table Data
const table_data = () => {
    $.post(root + "/copy_crud", { op: 'read' }, function (data, status) {
        if (data == 'UnAuthorised Access') {
            toast_function('danger', 'session expired')
            localStorage.clear();
            var pastDate = new Date(0);
            document.cookie = "lt=; expires=" + pastDate.toUTCString() + "; path=/";
            setTimeout(() => {
                window.location.href = "/"
            }, 3000);
        }

        if (data == '{}') {
            return
        } else {
            Table_data = JSON.parse(data)
        }

        if ('left_table' in Table_data) {
            left_table = Table_data['left_table']
        }

        if (left_table) {
            left_table_temp = []

            for (var i = 0; i < Object.values(left_table).length; i++) {
                // data pre preprocessing
                let Name = left_table[i];
                let temp = [i, Name, `<div class="d-flex align-items-center justify-content-center" onClick="removeDataLeft('${i}')" style="cursor: pointer"><i class="fa fa-trash"></i></div>`]
                left_table_temp.push(temp)
                temp = []
            }
            if (left_table_temp) {
                if (counter_for_datatable_left == 0) {
                    counter_for_datatable_left += 1;
                    datatable = $("#textTable").DataTable({
                        paging: false,
                        pageLength: 50,
                        info: false,
                        scrollX: false,
                        order: false,
                        searching: false
                    });
                }
                datatable.clear();
                datatable.rows.add(left_table_temp);
                datatable.draw();
            }
        }


    }).fail(function (response) {
        logger.error("Error: " + response);
    });
}

// Send Table Data
const send_data = (left) => {

    let data_dict = {
        left_table: left,
    }

    $.post(root + "/copy_crud", { op: 'create', data: JSON.stringify(data_dict) }, function (data, status) {

        if (data == 'UnAuthorised Access') {
            toast_function('danger', 'session expired')
            localStorage.clear();
            var pastDate = new Date(0);
            document.cookie = "lt=; expires=" + pastDate.toUTCString() + "; path=/";
            setTimeout(() => {
                window.location.href = "/"
            }, 3000);
        }

        if (data == 'success') {
            toast_function('success', 'Table Updated Successfully!')
            table_data()
        }
    })
}


// Remove Table Data
const removeDataLeft = (data) => {
    let con = confirm('are you sure you want to remove ?')
    if (con) {
        delete left_table[data];
        send_data(left_table)
    }
}

//---------- On Ready - Refresh
$(document).ready(function () {

    $.ajaxSetup({ async: false }); // to stop async

    counter_for_datatable_left = 0;
    counter_for_datatable_right = 0;

    previousContent = '';       // right table
    previousContent_1 = '';     // left table 

    left_table = []
    right_table = []

    table_data()

    // To initialize, focus the hidden input field to capture clipboard data
    $('#hiddenInput').focus();

    $("tbody").on("click", "td:nth-child(2)", function () {
        var cell = $(this);
        var text = cell['0']['innerText'];

        navigator.clipboard.writeText(text).then(() => {
            toast_function('success', 'Text copied to clipboard')
        }).catch((err) => {
            logger.error("Failed to copy text: " + err);
            toast_function('danger', 'Failed to copy text')
        });

    });
})

//---------- Click User Action Submit (LEFT TABLE)
document.querySelector(".Submit_Button").addEventListener("click", () => {

    let value = $('#text_message_1').val()

    let formattedText = value.replace(/\n/g, '<br>');

    if (formattedText !== previousContent_1) {
        previousContent_1 = formattedText;

        if (Object.keys(left_table).length >= 50) {
            const firstKey = Object.keys(left_table)[0];
            delete left_table[firstKey];
        }

        left_table[Object.keys(left_table).length] = formattedText

        // Convert object to an array of [key, value] pairs
        let entries = Object.entries(left_table);
        // Reverse the array
        entries.reverse();
        // Convert the reversed array back to an object
        let reversedLeftTable = Object.fromEntries(entries);

        send_data(reversedLeftTable)
        $('#text_message_1').val('')
    }
});