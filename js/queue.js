var resNum = 0; //number of reservations made (to uniquely identify them)

function addParty() {
    var name = $('#partyName').val();
    var time = $('#partyTime').val();
    var date = $('#partyDate').val();
    var phone = $('#partyPhone').val();
    var email = $('#partyEmail').val();
    var size = $('#partySize').val();

    console.log(name);
    console.log(time);
    console.log(date);
    console.log(size);

    if (name != '' && time != '' && date != '' && size != '') {
        hideSidebar();
    
        var html = '<div class="inQueue bs-callout bs-callout-info" id="res' + resNum + '">' + 
                '<table style="width:100%;max-width:100%;font-weight:200;"><tr>' +
                '<td class="col-md-4 queue-column">' + time + '</td>' +
                '<td class="col-md-4 queue-column">' + name + '</td>' +
                '<td class="col-md-4 queue-column">' + size + '</td>' +
                '</tr></table>';

        /*var html = '<div class="inQueue" id="res' + resNum + '">' + 
                '<div>' + time + '</div>' +
                '<div>' + date + '</div' +
                '<div>' + name + '</div>' +
                '<div>' + size + '</div>' +
                '<div>?</div>';*/
        //html = html + optionsPanel(resNum, phone, email);
        html = html + '</div>';

        $('#queueContent').after(html);

        addResClickListener(resNum, phone, email);
    }
}

//creates a select listener for each reservation added to the queue
function addResClickListener(resNum, phone, email) {
    $('#res' + resNum).click(function(e) {
        //$('#optionsRes' + resNum).removeClass('hidden');
        var optsDiv = $('#optionsRes' + resNum);
        console.log(optsDiv);
        console.log(optsDiv.val());
        if (optsDiv.val() != undefined) {
            optsDiv.remove();
        }
        else {
            $('#res' + resNum).append(optionsPanel(resNum, phone, email));
        }
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