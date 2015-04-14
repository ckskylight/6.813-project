var resNum = 0; //number of reservations made (to uniquely identify them)

function addParty(details) {
    var name = $('#partyName').val();
    var time = $('#partyTime').val();
    var phone = $('#partyPhone').val();
    var email = $('#partyEmail').val();
    var size = $('#partySize').val();

    var html = '<div id="res' + resNum + '">' + 
            '<div>' + time + '</div>' +
            '<div>' + name + '</div>' +
            '<div>' + size + '</div>' +
            '<div>Table 10</div>' +
            '</div><br /><hr>';

    $('[data-sidebar-button-right]').after(html);
}

$(document).ready(function() {
    $('#addPartyConfirm').click(function (e) {
        resNum = resNum + 1;
        addParty();
    });
});