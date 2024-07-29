previousContent = '';       // right table
previousContent_1 = '';     // left table 

left_table = []
right_table = []

root_1 = "https://eccc-2405-201-7-f83a-ace6-fb9f-a4a4-f5c.ngrok-free.app"

// Get Table Data
const table_data = () => {
    $.post(root_1 + "/copy_crud", { op: 'read' }, function (data, status) {
        Table_data = JSON.parse(data);

        left_table = Table_data['left_table']
        right_table = Table_data['right_table']

        left_table_temp = []
        right_table_temp = []

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

        // for (var i = 0; i < right_table.length; i++) {
        //     // data pre preprocessing
        //     let Name = right_table[i];
        //     let temp = [Name, `<i class="fa fa-trash" onClick="removeDataRight('${Name}')"></i>`]
        //     right_table_temp.push(temp)
        //     temp = []
        // }
        // if (right_table_temp) {
        //     if (counter_for_datatable_right == 0) {
        //         counter_for_datatable_right += 1;
        //         datatable_1 = $("#clipboardTable").DataTable({
        //             paging: false,
        //             pageLength: 50,
        //             info: false,
        //             scrollX: false,
        //             order: false,
        //             searching: false
        //         });
        //     }
        //     datatable_1.clear();
        //     datatable_1.rows.add(right_table_temp);
        //     datatable_1.draw();
        // }
    }).fail(function (response) {
        logger.error("Error: " + response);
    });
}

// Send Table Data
const send_data = (left) => {

    let data_dict = {
        left_table: left,
    }

    $.post(root_1 + "/copy_crud", { op: 'create', data: JSON.stringify(data_dict) }, function (data, status) {
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
            send_data(left_table, right_table)
        }
    }
}

// const removeDataRight = (data) => {
//     // Optionally remove the value from `left_table` as well
//     const index = right_table.indexOf(data);
//     if (index > -1) {
//         right_table.splice(index, 1);
//         send_data(left_table, right_table)
//     }
// }

// Clipboard Function (RIGHT TABLE)
function checkClipboard() {
    navigator.clipboard.readText().then(text => {

        if (left_table.includes(text) || right_table.includes(text)) {
            return
        }

        if (text !== previousContent) {
            previousContent = text;

            if (right_table.length >= 50) {
                right_table.splice(0, 1);
            }

            right_table.push(text)
            right_table.reverse()

            send_data(left_table, right_table)

        }
    }).catch(err => {
        console.error('Failed to read clipboard contents: ', err);
    });
}

//---------- On Ready - Refresh
$(document).ready(function () {

    $.ajaxSetup({ async: false }); // to stop async

    counter_for_datatable_left = 0;
    counter_for_datatable_right = 0;

    table_data()

    // To initialize, focus the hidden input field to capture clipboard data
    $('#hiddenInput').focus();

    // Periodically check the clipboard content
    // setInterval(checkClipboard, 100); // Check every second

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
        send_data(left_table, right_table)
        $('#text_message_1').val('')
    }
});

//---------- Click User Action Clear Storage
// document.querySelector('.wrapper_2 h4').addEventListener("click", () => {
//     let con = confirm('Are you sure you want to clear all storage ?')
//     if (con) {
//         left_table = []
//         right_table = []
//         send_data(left_table, right_table)
//     }
// })