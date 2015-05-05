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
function addPartyData(resNum, time, name, size, phone) { //TODO: pass in phone
    /*var html = '<div class="inQueue bs-callout bs-callout-info" id="res' + resNum + '">' + 
            '<table style="width:100%;max-width:100%;font-weight:200;"><tr>' +
            '<td class="col-md-4 queue-column">' + time + '</td>' +
            '<td class="col-md-4 queue-column">' + name + '</td>' +
            '<td class="col-md-4 queue-column">' + size + '</td>' +
            '</tr></table></div>';
    return html;*/

    var time_military_hour = time.split(':')[0];
    var time_min  = time.split(':')[1];
    var time_hour = time_military_hour <= 12 ? time_military_hour: time_military_hour % 12;
    var time_am_pm = time_military_hour/12 >= 1 ? 'PM' : 'AM';

    
    console.log("time_military_hour: " + time_military_hour.toString());
    console.log("time_min: " + time_min.toString());
    console.log("time_hour: " + time_hour.toString());
    console.log("time_am_pm: " + time_am_pm.toString());
    

     var html = '<div class="inQueue bs-callout bs-callout-info" id="res' + resNum + '" style="margin-top:20px;margin-bottom:20px;border: 1px solid rgba(160,64,255,1.0);border-left: 5px solid rgba(160,64,255,1.0);background-color:#fff;padding:0px">' + 
              '<center style="padding:15px">' + 
              '<table style="font-weight:200;">' + 
                '<tbody>' + 
                  '<tr>' + 
                    '<td rowspan="2" class="queue-column" width="1%" style="text-align:left;font-size:30px">'+time_hour+'</td>' +
                    '<td class="queue-column"  style="text-align:left;word-wrap:break-word;">' + time_min +  '</td>' + 
                    '<td rowspan="2" class="queue-column" style="text-align: center;font-size:30px;width: 103px;">' + size + '<span class="glyphicon glyphicon-user" aria-hidden="true"></span></td>' + 
                    '<td class="queue-column" style="font-weight:400;text-align:right">' + name + '</td>' +
                  '</tr>' + 
                  '<tr>'+ 
                    '<td class="queue-column" style="text-align:left;word-wrap:break-word;">' + time_am_pm + '</td>' + 
                    '<td class="queue-column" style="text-align:right">' + phone + '</td>' + 
                  '</tr>' + 
                '</tbody>' +
              '</table>' +
            '</center>' +
            '</div>'


    /*
    var html = '<div class="inQueue bs-callout bs-callout-info" id="res' + resNum + '" style="border: 1px solid ' + 
        'rgba(160,64,255,1.0);border-left: 5px solid rgba(160,64,255,1.0);background-color:#fff;">' + 
        '<table style="width:100%;max-width:100%;font-weight:200;margin-left:0px"><tbody><tr>' + 
        '<td rowspan="2" class="queue-column" width="1%" style="text-align:left;font-size:30px">' + time + '</td>' + 
        '<td class="queue-column" style="text-align:left;word-wrap:break-word;"> 30 </td>' +  //TODO: hardcoded minutes
        '<td rowspan="2"class="queue-column" style="text-align:left;font-size:30px">' + size + '</td>' + 
        '<td class="queue-column">' + name + '</td></tr><tr>' + 
        '<td class="queue-column" style="text-align:left;word-wrap:break-word;"> am</td>' +  //TODO: hardcoded am/pm
        '<td class="queue-column">' + phone + '</td></tr></tbody></table></div>'
    */
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
    console.log('time:');
    console.log(time);
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
    $('#queueContent').append(html);

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
    $('#deleteRes').mouseover(function(e) {
        $('#deleteRes').addClass('moused-over-queue-button' );
    });
    $('#deleteRes').mouseout(function(e) {
        $('#deleteRes').removeClass('moused-over-queue-button ');
    });

    $('#assignTable').mouseover(function(e) {
        $('#assignTable').addClass('moused-over-queue-button ');
    });
    $('#assignTable').mouseout(function(e) {
        $('#assignTable').removeClass('moused-over-queue-button ');
    });
}

//returns the hidden options panel, which the listener can unhide
function optionsPanel(resNum, phone) {
    return '<div style="border-top: 5px solid rgba(160,64,255,1.0);border=4px solid rgba(160,64,255,1.0);border-bottom: 5px solid rgba(160, 64, 255, 1.0);border-right: 4px solid rgba(160, 64, 255, 1.0);" id="optionsRes' + resNum + '" >' +
        '<table style="width:100%;max-width:100%;font-weight:200;margin-left:0px"> <tr style="padding-top:10px"></tr></table>' + 
        '<div style="border=5px solid rgba(160,64,255,1.0)"><table style="width:100%;max-width:100%;font-weight:200;margin-left:0px"> <tr>' + 
        '<td style="border-right=5px solid rgba(160,64,255,1.0);font-weight:400;vertical-align:middle;border-right: 5px solid rgba(160,64,255,1.0);padding:15px;" name="assignTable" onclick="assignTableFunc()" id="assignTable' + 
        resNum + '" class="col-md-4 queue-column">Assign Table</td>' + 
        '<td style="font-weight:400;vertical-align:middle;padding: 15px;" name="deleteRes" id="deleteRes' + resNum + 
        '" class="col-md-4 queue-column">Delete</td></tr></table></div></div>';
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