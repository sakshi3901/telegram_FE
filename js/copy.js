previousContent = '';       // right table
previousContent_1 = '';     // left table 

left_table = []
right_table = []

// Get Table Data
const table_data = () => {
    $.post(root + "/copy_crud", { op: 'read' }, function (data, status) {
        Table_data = JSON.parse(data);

        left_table = Table_data['left_table']

        left_table_temp = []

        for (var i = 0; i < left_table.length; i++) {
            // data pre preprocessing
            let Name = left_table[i];
            let temp = [Name, `<div class="d-flex align-items-center justify-content-center" onClick="removeDataLeft('${Name}')" style="cursor: pointer"><i class="fa fa-trash"></i></div>`]
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
        // Optionally remove the value from `left_table` as well
        const index = left_table.indexOf(data);
        if (index > -1) {
            left_table.splice(index, 1);
            send_data(left_table)
        }
    }
}

//---------- On Ready - Refresh
$(document).ready(function () {

    $.ajaxSetup({ async: false }); // to stop async

    counter_for_datatable_left = 0;
    counter_for_datatable_right = 0;

    table_data()

    // To initialize, focus the hidden input field to capture clipboard data
    $('#hiddenInput').focus();

    $("tbody").on("click", "td:nth-child(1)", function () {
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

        if (left_table.length >= 50) {
            left_table.splice(0, 1);
        }

        left_table.push(formattedText)
        left_table.reverse()
        send_data(left_table)
        $('#text_message_1').val('')
    }
});