var resNum = 0; //number of reservations made (to uniquely identify them)

function addParty(details) {
    var name = $('#partyName').val();
    var time = $('#partyTime').val();
    var date = $('#partyDate').val();
    var phone = $('#partyPhone').val();
    var email = $('#partyEmail').val();
    var size = $('#partySize').val();

    $('#partyName').val('');
    $('#partyTime').val('');
    $('#partyDate').val('');
    $('#partyPhone').val('');
    $('#partyEmail').val('');
    $('#partySize').val('');

    var html = '<div id="res' + resNum + '">' + 
            '<div>' + time + '</div>' +
            '<div>' + date + '</div' +
            '<div>' + name + '</div>' +
            '<div>' + size + '</div>' +
            '<div>?</div>';
    //html = html + optionsPanel(resNum, phone, email);
    html = html + '<hr></div>';

    $('#queueContent').after(html);

    addResClickListener(resNum, phone, email);
}

//creates a select listener for each reservation added to the queue
function addResClickListener(resNum, phone, email) {
    $('#res' + resNum).click(function(e) {
        //$('#optionsRes' + resNum).removeClass('hidden');
        $('#res' + resNum).append(optionsPanel(resNum, phone, email));
    });
    $('#deleteRes' + resNum).click(function(e) {
        $('#res' + resNum).remove();
    });
    $('#res' + resNum).mouseover(function(e) {
        $('#res' + resNum).addClass('mousedOver');
    });
    $('#res' + resNum).mouseout(function(e) {
        $('#res' + resNum).removeClass('mousedOver');
    });
}

//returns the hidden options panel, which the listener can unhide
function optionsPanel(resNum, phone, email) {
    return '<div>' + phone + '</div> <div>' + email + '</div>' +
        '<div id="optionsRes' + resNum + '"><button name="assignTable" id="assignTable">Assign Table</button>' + 
        '<button name="deleteRes" id="deleteRes' + resNum + '">Delete</button></div><hr>';
}

$(document).ready(function() {
    $('#addPartyConfirm').click(function (e) {
        resNum = resNum + 1;
        addParty();
    });
});