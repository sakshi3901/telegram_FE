previousContent = '';       // right table
previousContent_1 = '';     // left table 

left_table = []
right_table = []

$(document).ready(function () {

    getLocalStorage()

    // To initialize, focus the hidden input field to capture clipboard data
    $('#hiddenInput').focus();

    function checkClipboard() {
        navigator.clipboard.readText().then(text => {

            if (left_table.includes(text) || right_table.includes(text)) {
                return
            }

            if (right_table.length >= 50) {
                right_table.splice(0, 1);
                localStorage.setItem("rightTable", JSON.stringify(right_table));
                $('#clipboardTable tbody tr:last').remove();
            }

            right_table.push(text)
            localStorage.setItem("rightTable", JSON.stringify(right_table));


            if (text !== previousContent) {
                previousContent = text;

                let newRow = $('<tr></tr>');

                // First <td> for text
                let textCell = $('<td></td>').text(text);
                newRow.append(textCell);

                // Second <td> for delete icon
                let deleteCell = $('<td class="text-center" style="cursor: pointer"></td>');
                let deleteIcon = $('<i></i>').addClass('fa fa-trash'); // Example using Font Awesome for delete icon
                deleteCell.append(deleteIcon);
                newRow.append(deleteCell);

                // Prepend the new row to the table
                $('#clipboardTable tbody').prepend(newRow);

                // Attach click event to delete icon
                deleteIcon.on('click', function () {
                    newRow.remove(); // Remove the row from the table
                    // Optionally update `left_table` and `right_table` to reflect the removal
                    const index = right_table.indexOf(text);
                    if (index > -1) {
                        right_table.splice(index, 1);
                        localStorage.setItem("rightTable", JSON.stringify(right_table));
                    }
                });
            }
        }).catch(err => {
            console.error('Failed to read clipboard contents: ', err);
        });
    }

    // Periodically check the clipboard content
    setInterval(checkClipboard, 1000); // Check every second

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

    $('.wrapper_2 h4').click(() => {
        let con = confirm('Are ypu sure you want to clear all storage ?')
        if (con) {
            localStorage.removeItem("leftTable")
            localStorage.removeItem("rightTable")
            $('#textTable tbody').empty();
            $('#clipboardTable tbody').empty();
            left_table = []
            right_table = []
        }
    })
});

const getLocalStorage = () => {
    let leftTable = localStorage.getItem("leftTable")
    let rightTable = localStorage.getItem("rightTable")

    if (leftTable) {
        let tempLeftTable = JSON.parse(leftTable)

        for (let i = 0; i < tempLeftTable.length; i++) {
            let newRow = $('<tr></tr>');
            // First <td> for text
            let textCell = $('<td></td>').html(tempLeftTable[i]);
            newRow.append(textCell);
            // Second <td> for delete icon
            let deleteCell = $('<td class="text-center" style="cursor: pointer"></td>');
            let deleteIcon = $('<i></i>').addClass('fa fa-trash'); // Example using Font Awesome for delete icon
            deleteCell.append(deleteIcon);
            newRow.append(deleteCell);
            $('#textTable tbody').prepend(newRow);
            // Attach click event to delete icon
            deleteIcon.on('click', function () {
                let con = confirm('are you sure you want to remove ?')
                if (con) {
                    newRow.remove(); // Remove the row from the table
                    // Optionally remove the value from `left_table` as well
                    const index = tempLeftTable.indexOf(tempLeftTable[i]);
                    if (index > -1) {
                        tempLeftTable.splice(index, 1);
                        localStorage.setItem("leftTable", JSON.stringify(tempLeftTable));
                    }
                }
            });
        }
    }

    if (rightTable) {
        let tempRightTable = JSON.parse(rightTable)

        for (let i = 0; i < tempRightTable.length; i++) {
            let newRow = $('<tr></tr>');
            // First <td> for text
            let textCell = $('<td></td>').text(tempRightTable[i]);
            newRow.append(textCell);
            // Second <td> for delete icon
            let deleteCell = $('<td class="text-center" style="cursor: pointer"></td>');
            let deleteIcon = $('<i></i>').addClass('fa fa-trash'); // Example using Font Awesome for delete icon
            deleteCell.append(deleteIcon);
            newRow.append(deleteCell);
            // Prepend the new row to the table
            $('#clipboardTable tbody').prepend(newRow);
            // Attach click event to delete icon
            deleteIcon.on('click', function () {
                newRow.remove(); // Remove the row from the table
                // Optionally update `left_table` and `right_table` to reflect the removal
                const index = tempRightTable.indexOf(tempRightTable[i]);
                if (index > -1) {
                    tempRightTable.splice(index, 1);
                    localStorage.setItem("rightTable", JSON.stringify(tempRightTable));
                }
            });
        }
    }
}


const push_data_into_table = () => {

    let value = $('#text_message_1').val()

    let formattedText = value.replace(/\n/g, '<br>');

    if (formattedText !== previousContent_1) {
        previousContent_1 = formattedText;

        if (left_table.length >= 50) {
            left_table.splice(0, 1);
            localStorage.setItem("leftTable", JSON.stringify(left_table));
            $('#textTable tbody tr:last').remove();
        }

        left_table.push(value)
        localStorage.setItem("leftTable", JSON.stringify(left_table));

        let newRow = $('<tr></tr>');

        // First <td> for text

        let textCell = $('<td></td>').html(formattedText);
        newRow.append(textCell);

        // Second <td> for delete icon
        let deleteCell = $('<td class="text-center" style="cursor: pointer"></td>');
        let deleteIcon = $('<i></i>').addClass('fa fa-trash'); // Example using Font Awesome for delete icon
        deleteCell.append(deleteIcon);
        newRow.append(deleteCell);

        $('#textTable tbody').prepend(newRow);

        $('#text_message_1').val('')

        // Attach click event to delete icon
        deleteIcon.on('click', function () {
            let con = confirm('are you sure you want to remove ?')
            if (con) {
                newRow.remove(); // Remove the row from the table
                // Optionally remove the value from `left_table` as well
                const index = left_table.indexOf(value);
                if (index > -1) {
                    left_table.splice(index, 1);
                    localStorage.setItem("leftTable", JSON.stringify(left_table));
                }
            }
        });
    }
}


//---------- Click User Action Submit
document.querySelector(".Submit_Button").addEventListener("click", () => {
    push_data_into_table();
});