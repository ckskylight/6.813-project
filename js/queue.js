var resNum = 0; //number of reservations made (to uniquely identify them)

function addParty(details) {
    var name = $('#partyName').val();
    var time = $('#partyTime').val();
    var date = $('#partyDate').val();
    var phone = $('#partyPhone').val();
    var email = $('#partyEmail').val();
    var size = $('#partySize').val();

    if (name != '' && time != '' && date != '' && size != '') {
        hideSidebar();
    }

    console.log(name);
    console.log(time);
    console.log(date);
    console.log(size);

    var close = true;
    if (name != '') {
        
    }
    else {
        close = false;
    }
    if (time != '') {
        
    }
    else {
        close = false;
    }
    if (date != '') {
        
    }
    else {
        close = false;
    }
    if (size != '') {
        
    }
    else {
        close = false;
    }

    if (close) {
        $('#partyTime').val('');
        $('#partyDate').val('');
        $('#partySize').val('');
        $('#partyName').val('');
        $('#partyPhone').val('');
        $('#partyEmail').val('');
        hideSidebar();
    
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
        '<button name="assignTable" id="assignTable">Assign Table</button>' + 
        '<button name="deleteRes" id="deleteRes' + resNum + '">Delete</button><hr></div>';
}

$(document).ready(function() {
    $('#addPartyConfirm').click(function (e) {
        resNum = resNum + 1;
        addParty();
    });
});