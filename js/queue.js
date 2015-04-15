var resNum = 0; //number of reservations made (to uniquely identify them)

function addParty() {
    var name = $('#partyName').val();
    var time = $('#partyTime').val();
    var date = $('#partyDate').val();
    var phone = $('#partyPhone').val();
    var email = $('#partyEmail').val();
    var size = $('#partySize').val();

    if (name != '' && time != '' && date != '' && size != '') {
        hideSidebar();
        
        var html = '<div class="inQueue" id="res' + resNum + '">' + 
                '<table><tr>' +
                '<td class="col1">' + time + '</td>' +
                '<td class="col2">' + date + '</td>' +
                '<td class="col3">' + name + '</td>' +
                '<td class="col4">' + size + '</td>' +
                '</tr></table>';

        html = html + '<hr></div>';
        $('#queueContent').after(html);

        addResClickListener(resNum, phone, email);
    }
}

//creates a select listener for each reservation added to the queue
function addResClickListener(resNum, phone, email) {
    $('#res' + resNum).click(function(e) {
        //$('#optionsRes' + resNum).removeClass('hidden');
        var optsDiv = $('#optionsRes' + resNum);
        if (optsDiv.val() != undefined) {
            optsDiv.remove();
        }
        else {
            $('#res' + resNum).append(optionsPanel(resNum, phone, email));
        }
    });
    $('#deleteRes' + resNum).click(function(e) {
        console.log('deleting');
        $('#res' + resNum).remove();
        console.log($('#res' + resNum));

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
    return '<div id="optionsRes' + resNum + '"><div>' + phone + '</div> <div>' + email + '</div>' +
        '<button name="assignTable" id="assignTable" class="btn btn-primary">Assign Table</button>' + 
        '<button name="deleteRes" id="deleteRes' + resNum + '" class="btn btn-primary">Delete</button><hr></div>';
}

$(document).ready(function() {
    $('#addPartyConfirm').click(function (e) {
        resNum = resNum + 1;
        addParty();
    });
});