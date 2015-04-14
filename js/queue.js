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
            '<div>?</div>' +
            '</div>';
    html = html + optionsPanel(resNum);
    html = html + '<br /><hr>';

    $('#queueContent').after(html);

    addResClickListener(resNum);
}

//creates a select listener for each reservation added to the queue
function addResClickListener(resNum) {
    $('#res' + resNum).click(function(e) {
        $('#optionsRes' + resNum).removeClass('hidden');
    });
    $('#deleteRes' + resNum).click(function(e) {
        $('#res' + resNum).addClass('hidden');
        $('#optionRes' + resNum).addClass('hidden');
    });
}

//returns the hidden options panel, which the listener can unhide
function optionsPanel(resNum) {
    return '<div class="hidden" id="optionsRes' + resNum + '"><button name="assignTable" id="assignTable">Assign Table</button>' + 
        '<button name="deleteRes" id="deleteRes' + resNum + '">Delete</button></div>';
}

$(document).ready(function() {
    $('#addPartyConfirm').click(function (e) {
        resNum = resNum + 1;
        addParty();
    });
});