const confirm_yes = () => {
    $('#delete_user_close').click()
    Yes_button_Clicked = true
    if (Yes_button_Clicked) {
        Yes_button_Clicked = false
        Create_User_Action_data();
    }
}

//---------- Create invite link 
const Create_Data = () => {

    var telegram_username = $('#telegram_username').val()
    var time_duration = $('#time_duration').val();
    var selected_grp = $('#select_grp').val();
    var selected_type = $('#select_type').val();

    // input validation
    if (telegram_username == "" || time_duration == "" || selected_type == "" || time_duration == null) {
        toast_function('warning', 'Please Enter all fields!')
        return;
    }

    data_dict = {
        'contact': parseFloat("91" + telegram_username),
        'pool_name': parseFloat(selected_grp),
        'pool_type': selected_type,
        'expiry': time_duration
    };

    generate_link_api(data_dict)
}

//---------- Create User Action data
const Create_User_Action_data = () => {

    var ban_unban = $('#ban_unban_select').val()
    var tele_user = $('#tele_user').val();
    var selected_grp = $('#select_grp2').val();

    // input validation
    if (ban_unban == "" || tele_user == "") {
        toast_function('warning', 'Please Enter all fields!')
        return;
    }

    data_dict = {
        'contact': parseFloat(tele_user),
        'pool_name': parseFloat(selected_grp),
    };

    User_Action_api(data_dict, ban_unban)
}

//---------- Create Post Message data
const Create_post_msg_data = () => {

    var selected_grp = $('#select_grp1').val()
    var msg = $('#text_message').val();

    // input validation
    if (ban_unban == "" || tele_user == "") {
        toast_function('warning', 'Please Enter all fields!')
        return;
    }

    data_dict = {
        'message': msg,
        'pool_name': parseInt(selected_grp),
    };

    post_msg_api(data_dict)
}

// Generate Link Api
const generate_link_api = (data_dict) => {
    data = JSON.stringify(data_dict);

    $.post(root + "/telegram_crud", { 'data': data, 'op': 'create' }, function (data, status) {
        if (data !== 'err') {
            toast_function('success', 'Event Created Successfully!')
            $('#telegram_username').val('')
        } else {
            toast_function('danger', 'Unable to create event')
        }
    }).fail(function (response) {
        logger.error("Error: " + response);
    });
}

// Get Bot Link
const get_bot_link = () => {

    $.get(root + "/bot_link", function (data, status) {
        if (data !== 'err') {
            var text = data
            if (data !== '') {

                navigator.clipboard
                    .writeText(text)
                    .then(() => {
                        logger.info("Link copied to clipboard: " + text);
                        toast_function('success', 'Link copied to clipboard')
                    })
                    .catch((err) => {
                        logger.error("Failed to copy Link: " + err);
                        toast_function('danger', 'Failed to copy Link')
                    });
            }
        } else {
            toast_function('danger', 'Unable to get link')
        }
    }).fail(function (response) {
        logger.error("Error: " + response);
    });
}

// Get Table Data
const table_data = () => {
    $.get(root + "/read_user", function (data, status) {
        Joined_user = JSON.parse(JSON.stringify(data));
        for (var i = 0; i < Joined_user.length; i++) {
            // data pre preprocessing
            let Joined_date = Joined_user[i][0];
            let User_Id = Joined_user[i][1];
            let Name = Joined_user[i][2];
            Joined_user[i][0] = moment.unix(Joined_date).format('DD/MM/YYYY HH:mm:ss')
            Joined_user[i][1] = User_Id
            Joined_user[i][2] = Name
        }
        if (Joined_user) {
            if (counter_for_datatable == 0) {
                counter_for_datatable += 1;
                datatable = $("#Datatable").DataTable({
                    paging: true,
                    pageLength: 50,
                    info: false,
                    scrollX: true,
                    scrollY: 550,
                    order: true,
                });
            }
            datatable.clear();
            datatable.rows.add(Joined_user);
            datatable.draw();
        }
    }).fail(function (response) {
        logger.error("Error: " + response);
    });
}

// user Action Api
const User_Action_api = (data_dict, ban_unban) => {
    data = JSON.stringify(data_dict);

    $.post(root + "/user_action", { 'data': data, 'op': ban_unban }, function (data, status) {
        if (data !== 'err') {
            toast_function('success', 'Event Created Successfully!')
            $('#tele_user').val('')
            $('#ban_unban_select').val('ban')
        } else {
            toast_function('danger', 'Unable to create event')
        }
    }).fail(function (response) {
        logger.error("Error: " + response);
    });
}

// Send message Api
const post_msg_api = (data_dict) => {
    data = JSON.stringify(data_dict);

    $.post(root + "/send_message", { 'data': data }, function (data, status) {
        if (data !== 'err') {
            toast_function('success', 'Event Created Successfully!')
            $('#text_message').val('')
        } else {
            toast_function('danger', 'Unable to create event')
        }
    }).fail(function (response) {
        logger.error("Error: " + response);
    });
}

//---------- Click Submit
document.querySelector("#generate_invite_link").addEventListener("click", () => {
    Create_Data();
});

// fetch group
const fetch_group = () => {
    $.post(root + "/pool_list", function (data, status) {
        Channel_Read = Object.entries(data)
    }).done(function () {
        if (Channel_Read.length > 0) {
            $('#select_grp').empty()
            for (let i = 0; i < Channel_Read.length; i++) {
                $('#select_grp').append(`<option id="${Channel_Read[i][1]}" value="${Channel_Read[i][1]}">${Channel_Read[i][0]}</option>`)
                $('#select_grp1').append(`<option id="${Channel_Read[i][1]}" value="${Channel_Read[i][1]}">${Channel_Read[i][0]}</option>`)
                $('#select_grp2').append(`<option id="${Channel_Read[i][1]}" value="${Channel_Read[i][1]}">${Channel_Read[i][0]}</option>`)
            }
        }
    }).fail(function (response) {
        logger.error("Error: " + response);
    });
}

//---------- Click User Action Submit
document.querySelector("#post_message").addEventListener("click", () => {
    Create_post_msg_data();
});

//---------- On Ready - Refresh
$(document).ready(function () {

    $.ajaxSetup({ async: false }); // to stop async

    scrollPosition = 0;

    counter_for_datatable = 0;
    counter_for_datatable1 = 0;

    counter_for_show_hide = 0;
    counter_for_show_hide1 = 0;

    fetch_group()
    table_data()

    $("#Datatable tbody").on("click", "td", function () {
        var cell = $(this);
        var text = cell.text();

        if (
            cell.children().length === 0 &&
            cell.contents().length === 1 &&
            cell.contents()[0].nodeType === Node.TEXT_NODE
        ) {

            navigator.clipboard
                .writeText(text)
                .then(() => {
                    logger.info("Text copied to clipboard: " + text);
                    toast_function('success', 'Text copied to clipboard')
                })
                .catch((err) => {
                    logger.error("Failed to copy text: " + err);
                    toast_function('danger', 'Failed to copy text')
                });
        }
    });

    $("input[type='file']").on("change", function () {
        try {
            if (this.files[0].size > 20000000) {
                toast_function('warning', 'Please upload a file less than 20MB. Thanks!!')
                $(this).val('');
                return;
            }
        }
        catch (e) { logger.error("File Removed!"); return }


        var allowed_ext = ["jpg", "png", "jpeg", "webp", "svg", "mp4"]
        var curr_ext = $("#Image_input").val()
        curr_ext = curr_ext.split('.').pop();
        curr_ext = curr_ext.toLowerCase();
        logger.info("Extension:" + curr_ext)
        if (allowed_ext.includes(curr_ext)) {
            logger.info("Ext allowed")
        }
        else {
            toast_function("warning", "Please upload a file!")
            $(this).val('');
        }

    });

});

//---------- Intersection Observer - MODAL CLOSE - (page will not go back to top)
$(document).on("click", ".Modal_Open", function () {
    scrollPosition = window.scrollY;
});

//------ Close the modal and restore scroll position
$(document).on("click", ".close_modal", function () {
    setTimeout(() => {
        window.scrollTo(0, scrollPosition);
    }, 350);
});