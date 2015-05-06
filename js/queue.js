var resNum = 0; //number of reservations made (to uniquely identify them)

var exFullDate = new Date(2015,4,4,11,0);
var partyData = [{resNum: 0, name: 'CK', time: '11:00', date: '', size: '6', phone: '5551234567', fullDate: exFullDate}];

//from http://stackoverflow.com/questions/5223/length-of-a-javascript-object-that-is-associative-array
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


//creates html with specific info
function addPartyData(resNum, time, name, size, phone) {
    var time_military_hour = time.split(':')[0];
    var time_min  = time.split(':')[1];
    var time_hour = time_military_hour > 12 ? time_military_hour % 12 : time_military_hour;
    var time_hour = time_hour == 00 ? 12: time_hour;
    var time_am_pm = time_military_hour/12 >= 1 ? 'PM' : 'AM';

    /*
    console.log("time_military_hour: " + time_military_hour.toString());
    console.log("time_min: " + time_min.toString());
    console.log("time_hour: " + time_hour.toString());
    console.log("time_military_hour > 12: ");
    console.log(time_military_hour > 12);
    console.log("time_am_pm: " + time_am_pm.toString());
    */

     var html = '<div class="inQueue queueItem bs-callout bs-callout-info" style="padding-top:15px; padding-bottom:15px; border: 1px solid rgba(160,64,255,1.0);border-left: 5px solid rgba(160,64,255,1.0);background-color:#fff;padding-left: 0px;padding-right: 0px;margin-top: 0px;margin-bottom: 0px;padding: none;padding: 0px; " id="res' + resNum + '">' +
              '<center style="padding:15px 10px ; height:78px;">' +
               '<div style="height:50px; line-height: 46px; position: absolute;">' +
                '<div style="width: 65%; font-size: 40px; float: left;text-align: center; line-height: 46px;">' + time_hour + '</div>' +
                '<div style="margin-left: 44px; margin-top: 4px;line-height: 23px;   ">' + time_min + '</div>' +
                '<div style="margin-left: 48px; margin-top: -6px;line-height: 23px;   ">' + time_am_pm + '</div>' +
              '</div>' +
              '<div style="margin-left: 60px; line-height: 46px; font-size: 40px; width: 38%; position: absolute; ">' + size + '<span class="glyphicon glyphicon-user" aria-hidden="true" style="font-size: 30px;"></span></div>' +

              '<div style="height:50px; line-height: 46px; position: absolute;">' +
                '<div style="margin-left: 150px; margin-top: 4px;line-height: 23px; width: 50%;  text-align: right; word-wrap:break-word;">' + name + '</div>'
                '<div style="margin-left: 150px; margin-top: -6px;line-height: 23px; width: 50%;  text-align: right;   ">' + phone + '</div>' +
              '</div> ' +
            '</center>' +
            '</div>'


     /*
     var html = '<div class="inQueue queueItem bs-callout bs-callout-info" id="res' + resNum + '">' +
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
    */

    return html;
}

//create a printable version of the day and month
function makePrintDate(dateIn) {
    var date = dateIn.getDate();
    var month = dateIn.getMonth();

    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[month] + ' ' + date;
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

    var reDate = /^(\d+)-(\d+)-(\d+)$/;
    var matchesDate = reDate.exec(date);
    var fullDate = new Date(matchesDate[1],matchesDate[2],matchesDate[3],matches[1],matches[2]);

    if (name != '' && time != '' && date != '' && size != '') {
        partyData.push({resNum: resNum, name: name, time: time, date: date, size: size, phone: phone, fullDate: fullDate});
        console.log('partyData in addParty:');
        console.log(partyData);

        hideSidebar();
    }

    //clear queue
    $('#queueContent').empty();
    //add back in everything in sorted order

    var partyDataSorted = partyData.sort(function(a,b) {
        return a.fullDate > b.fullDate;
    });

    console.log('partyDataSorted: ');
    console.log(partyDataSorted);

    var prevDate = partyDataSorted[0]['fullDate'].getDate(); //bug: if reservations are made a month exactly apart, breaks. We don't care
    for (var j = 0; j < Object.size(partyDataSorted); j++) {
        var data = partyDataSorted[j];

        var html = addPartyData(data['resNum'], data['time'], data['name'], data['size'], data['phone']);
        var date = data['fullDate'].getDate();
        console.log('prevDate: ' + prevDate);
        console.log('date: ' + date);
        if (date != prevDate) {
            var printDate = makePrintDate(data['fullDate']);
            html = '<hr><h4 style="font-weight:200;padding:10px;padding-left:0px">' + printDate +'</h4>' + html;
            prevDate = date;
        }

        $('#queueContent').append(html);
        addResClickListener(data['resNum'], data['phone']);
    }
    console.log('html: ');
    console.log(html);

}

function deleteReservation(resNum) {
    $('#res' + resNum).remove();
}

//creates a select listener for each reservation added to the queue
function addResClickListener(resNum, phone) {
    console.log('in addResClickListener. resNum: ' + resNum);

    $('#res' + resNum).click(function(e) {
        console.log('IN CLICK');
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

                console.log(partyData);
                console.log(resNum);

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
}

//returns the hidden options panel, which the listener can unhide
function optionsPanel(resNum, phone) {
    return '<div class="resNum" id="optionsRes' + resNum + '" >' +
        '<table class="optionsTable"> <tr style="padding-top:10px"></tr></table>' +
        '<div style="border=5px solid rgba(160,64,255,1.0)"><table style="width:100%;max-width:100%;font-weight:200;margin-left:0px"> <tr>' +
        '<td name="assignTable" onclick="assignTableFunc()" id="assignTable' +
        resNum + '" class="col-md-4 queue-column assignTable">Assign Table</td>' +
        '<td name="deleteRes" id="deleteRes' + resNum +
        '" class="col-md-4 queue-column deleteTable">Delete</td></tr></table></div></div>';
}

$(document).ready(function() {
    $('#addPartyConfirm').click(function (e) {
        resNum = resNum + 1;
        addParty();
    });

    $('#pushHere').click(function() {
        console.log('listeners attached to res1');
        console.log($("#res0").data("events"));
        console.log($('#res0'));
    });

    $('#res5').click(function() {
        console.log('5 CLICKED');
    });

    /*
    $(document).keypress(function(e) {
        if (e.which == 13) { //enter pressed
            resNum = resNum + 1;
            addParty();
        }
    });*/

    //listeners for hard-coded example
    $('#res0').click(function(e) {
        //$('#optionsRes' + resNum).removeClass('hidden');
        console.log('IN HARDCODED CLICK');
        var optsDiv = $('#optionsRes0');
        if (optsDiv.val() != undefined) {
            optsDiv.remove();
        }
        else {
            for (var i = 0; i < 100; i++) {
                $('#optionsRes' + i).remove();
            }
            $('#res0').append(optionsPanel(0, '5551234567'));

            //add event listeners in options panel
            $('#deleteRes0').click(function(e) {
                deleteReservation(0);
            });
            $('#assignTable0').click(function(e) {
                console.log('in Assign table');
                deleteReservation(0);
                hideSidebarRight();

                bonsai.sendMessage({
                    command: "assign",
                    details: {
                        name: partyData[0].name,
                        partySize: partyData[0].size
                    }
                });
            });
        }
    });
    $('#res0').mouseover(function(e) {
        $('#res0').addClass('mousedOver');
    });
    $('#res0').mouseout(function(e) {
        $('#res0').removeClass('mousedOver');
    });
});