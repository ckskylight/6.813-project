var resNum = 2; //number of reservations made (to uniquely identify them)

var partyData = [];

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
        partyData.push({resNum: {'name': name, 'time': time, 'date': date, 'size': size, 'phone': phone, 'email': email}});
        console.log(partyData);
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

function deleteReservation(resNum) {
    $('#res' + resNum).remove();
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

            //add event listeners in options panel
            $('#deleteRes' + resNum).click(function(e) {
                deleteReservation(resNum);
            });
            $('#assignTable' + resNum).click(function(e) {
                console.log('in Assign table');
                deleteReservation(resNum);
                hideSidebarRight();
            });
        }
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
    return '<div id="optionsRes' + resNum + '">' +
        '<table style="width:100%;max-width:100%;font-weight:200;"> <tr style="padding-top:10px">' + 
        '<td name="Phone" id="Phone" class="queue-column" style="max-width:122px">'+phone+'</td>' + 
        '<td name="Email" id="Email" class="queue-column style="max-width:122px">'+email+'</td></tr></table>' + 
        '<hr><table style="width:100%;max-width:100%;font-weight:200;"> <tr>' + 
        '<td style="font-weight:400" name="assignTable" onclick="assignTableFunc()" id="assignTable' + resNum + '" class="col-md-4 queue-column">Assign Table</td>' + 
        '<td style="font-weight:400" name="deleteRes" id="deleteRes' + resNum + '" class="col-md-4 queue-column">Delete</td></tr></table></div>';
    /*
    Dirk's Previous code:
    return '<div id="optionsRes' + resNum + '"><div>' + phone + '</div> <div>' + email + '</div>' +
        '<button name="assignTable" id="assignTable" class="btn btn-primary">Assign Table</button>' + 
>>>>>>> Formatted Queue Assign Table Buttons
        '<button name="deleteRes" id="deleteRes' + resNum + '" class="btn btn-primary">Delete</button><hr></div>';
    */
}

$(document).ready(function() {
    $('#addPartyConfirm').click(function (e) {
        resNum = resNum + 1;
        addParty();
    });
    /*
    $(document).keypress(function(e) {
        if (e.which == 13) { //enter pressed
            resNum = resNum + 1;
            addParty();
        }
    });*/

    //listeners for hard-coded example
    $('#res1').click(function(e) {
        //$('#optionsRes' + resNum).removeClass('hidden');
        var optsDiv = $('#optionsRes1');
        console.log(optsDiv);
        console.log(optsDiv.val());
        if (optsDiv.val() != undefined) {
            optsDiv.remove();
        }
        else {
            $('#res1').append(optionsPanel(1, '555-123-4567', 'tmaestro@mit.edu'));

            //add event listeners in options panel
            $('#deleteRes1').click(function(e) {
                deleteReservation(1);
            });
            $('#assignTable1').click(function(e) {
                console.log('in Assign table');
                deleteReservation(1);
                hideSidebarRight();
            });
        }
    });
    $('#res1').mouseover(function(e) {
        $('#res1').addClass('mousedOver');
    });
    $('#res1').mouseout(function(e) {
        $('#res1').removeClass('mousedOver');
    });
});