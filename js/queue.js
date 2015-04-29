var resNum = 1; //number of reservations made (to uniquely identify them)

var partyData = {1: {name: 'CK', time: '11 am', date: '', size: '6', phone: '555-123-4567', email: 'tmaestro@mit.edu'}};

//from http://stackoverflow.com/questions/5223/length-of-a-javascript-object-that-is-associative-array
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


//creates html with specific info
function addPartyData(resNum, time, name, size) {
    var html = '<div class="inQueue bs-callout bs-callout-info" id="res' + resNum + '">' + 
            '<table style="width:100%;max-width:100%;font-weight:200;"><tr>' +
            '<td class="col-md-4 queue-column">' + time + '</td>' +
            '<td class="col-md-4 queue-column">' + name + '</td>' +
            '<td class="col-md-4 queue-column">' + size + '</td>' +
            '</tr></table></div>';
    return html;
}

//take an arbitrary time string, and parse out the actual time
function parseTime(inp) {
    var re = /^\s*(\d+)\s*[\:|\d|\s]*([a|p|A|P}])/;
    var matches = re.exec(inp);
    return matches;
}

//adds a new party to the queue, and rearranges parties by time
function addParty() {
    var name = $('#partyName').val();
    var time = $('#partyTime').val();
    var date = $('#partyDate').val();
    var phone = $('#partyPhone').val();
    var email = $('#partyEmail').val();
    var size = $('#partySize').val();

    if (name != '' && time != '' && date != '' && size != '') {
        partyData[resNum] = {name: name, time: time, date: date, size: size, phone: phone, email: email};
        console.log('partyData in addParty:');
        console.log(partyData);

        //add to local storage
        var partyDataStr = JSON.stringify(partyData);
        localStorage['partyData'] = partyDataStr;

        hideSidebar();
    
        var html = addPartyData(resNum, time, name, size);

        $('#queueContent').after(html);
        addResClickListener(resNum, phone, email);
    }

    //clear queue
    $('#queueContent').remove();
    //add back in everything in sorted order

    var partyDataList = [];

    //sort list of reservations
    for (var i = 1; i <= Object.size(partyData); i++) {
        var data = partyData[i];
        partyDataList.push(data);
    }

    
    var partyDataSorted = partyDataList.sort(function(a,b) {
        var aTime = parseTime(a.time);
        if (aTime[1] == 'p' || aTime[1] == 'P') {
            aTime[0] += 12; //convert to 24 hour time
        }
        var bTime = parseTime(b.time);
        if (bTime[1] == 'p' || bTime[1] == 'P') {
            bTime[0] += 12; //convert to 24 hour time
        }
        console.log(aTime);

        return parseInt(a.time) - parseInt(b.time);
    });
    console.log('partyDataSorted: ');
    console.log(partyDataSorted);

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
            for (var i = 0; i < 100; i++) {
                $('#optionsRes' + i).remove();
            }
            $('#res' + resNum).append(optionsPanel(resNum, phone, email));

            //add event listeners in options panel
            $('#deleteRes' + resNum).click(function(e) {
                deleteReservation(resNum);
            });
            $('#assignTable' + resNum).click(function(e) {
                console.log('in Assign table');
                deleteReservation(resNum);
                hideSidebarRight();

                console.log('Data going to bonsai:');
                console.log('name: ' + partyData[resNum].name);
                console.log('size: ' + partyData[resNum].size);

                bonsai.sendMessage({
                    command: "assign",
                    details: {
                        name: partyData[resNum].name,
                        partySize: partyData[resNum].size
                    }
                });
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
        '<td name="Phone" id="Phone" class="queue-column" style="max-width:122px;padding-top:10px">'+phone+'</td>' + 
        '<td name="Email" id="Email" class="queue-column style="max-width:122px;padding-top:10px>'+email+'</td></tr></table>' + 
        '<hr><table style="width:100%;max-width:100%;font-weight:200;"> <tr>' + 
        '<td style="font-weight:400" name="assignTable" onclick="assignTableFunc()" id="assignTable' + 
        resNum + '" class="col-md-4 queue-column">Assign Table</td>' + 
        '<td style="font-weight:400" name="deleteRes" id="deleteRes' + resNum + 
        '" class="col-md-4 queue-column">Delete</td></tr></table></div>';
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
            for (var i = 0; i < 100; i++) {
                $('#optionsRes' + i).remove();
            }
            $('#res1').append(optionsPanel(1, '555-123-4567', 'tmaestro@mit.edu'));

            //add event listeners in options panel
            $('#deleteRes1').click(function(e) {
                deleteReservation(1);
            });
            $('#assignTable1').click(function(e) {
                console.log('in Assign table');
                deleteReservation(1);
                hideSidebarRight();

                bonsai.sendMessage({
                    command: "assign",
                    details: {
                        name: partyData['1'].name,
                        partySize: partyData['1'].size
                    }
                });
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