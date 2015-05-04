var resNum = 1; //number of reservations made (to uniquely identify them)

var exFullDate = new Date(2015,4,4,11,0);
var partyData = [{resNum: 1, name: 'CK', time: '11:00', date: '', size: '6', phone: '555-123-4567', fullDate: exFullDate}];

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
    var size = $('#partySize').val();

    var re = /^\s*(\d+):(\d+)\s*/;
    var matches = re.exec(time);
    var fullDate = new Date(2015,4,4,matches[1],matches[2]); //TODO: hardcoded day and month for the time being

    if (name != '' && time != '' && date != '' && size != '') {
        partyData.push({resNum: resNum, name: name, time: time, date: date, size: size, phone: phone, fullDate: fullDate});
        console.log('partyData in addParty:');
        console.log(partyData);

        hideSidebar();
        addResClickListener(resNum, phone);
    }

    //clear queue
    $('#queueContent').empty();
    //add back in everything in sorted order

    var partyDataSorted = partyData.sort(function(a,b) {
        return a.fullDate > b.fullDate;
    });

    console.log('partyDataSorted: ');
    console.log(partyDataSorted);

    var html = '';
    for (var j = 0; j < Object.size(partyDataSorted); j++) {
        var data = partyDataSorted[j];
        console.log('data: ');
        console.log(data);

        html += addPartyData(data['resNum'], data['time'], data['name'], data['size']);
    }
    console.log('html: ');
    console.log(html);
    $('#queueContent').after(html);

}

function deleteReservation(resNum) {
    $('#res' + resNum).remove();
}

//creates a select listener for each reservation added to the queue
function addResClickListener(resNum, phone) {
    $('#res' + resNum).click(function(e) {
        //$('#optionsRes' + resNum).removeClass('hidden');
        var optsDiv = $('#optionsRes' + resNum);

        if (optsDiv.val() != undefined) {
            optsDiv.remove();
        }
        else {
            for (var i = 0; i < 100; i++) {
                $('#optionsRes' + i).remove();
            }
            $('#res' + resNum).append(optionsPanel(resNum, phone));

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
function optionsPanel(resNum, phone) {
    return '<div id="optionsRes' + resNum + '">' +
        '<table style="width:100%;max-width:100%;font-weight:200;"> <tr style="padding-top:10px"></tr></table>' + 
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