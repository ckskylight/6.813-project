// hide sidebar and overlay
var hideSidebar =  function() {
    sidebarLeft.css('margin-left', sidebarLeft.width() * -1 + 'px');

    overlay.fadeTo('500', 0, function() {
        overlay.hide();
    });
}

// hide sidebar and overlay
function hideSidebarRight() {
    sidebarRight.css('margin-left', 1500 + 'px');

    overlayRight.fadeTo('500', 0, function() {
        overlayRight.hide();
    });;
}

var sidebarLeft;
var overlay;
var sidebarRight;
var overlayRight;

$(document).ready(function() {
    // show sidebar and overlay
    function showSidebar() {

        $('#partyTime').val('');
        $('#partyDate').val('');
        $('#partySize').val('');
        $('#partyName').val('');
        $('#partyPhone').val('');
        $('#partyEmail').val('');

        sidebarLeft.css('margin-left', '0');

        overlay.show(0, function() {
            overlay.fadeTo('500', 0.5);
        });
    }

    function showSidebarRight() {
        sidebarRight.css('margin-left', $(window).width() - sidebarRight.width());

        overlay.show(0, function() {
            overlayRight.fadeTo('500', 0.5);
        });
    }

    // selectors
    sidebarLeft = $('[data-sidebar-left]');
    sidebarRight = $('[data-sidebar-right]');
    var buttonLeft = $('[data-sidebar-button]');
    var buttonRight = $('[data-sidebar-button-right]');
    overlay = $('[data-sidebar-overlay]');
    overlayRight = $('[data-sidebar-overlay-right]');

    // add height to content area
    overlay.parent().css('min-height', 'inherit');

    // hide sidebar on load
    sidebarLeft.css('margin-left', sidebarLeft.width() * -1 + 'px');
    sidebarRight.css('margin-left', sidebarRight.width() + 1500 + 'px');

    sidebarLeft.show(0, function() {
        sidebarLeft.css('transition', 'all 0.5s ease');
    });
    sidebarRight.show(0, function() {
        sidebarRight.css('transition', 'all 0.5s ease');
    });

    // toggle sidebar on click
    buttonLeft.click(function() {
        if (overlay.is(':visible')) {
            hideSidebar();
        } else {
            showSidebar();
        }

        return false;
    });
    // toggle sidebar on click
    buttonRight.click(function() {
        if (overlayRight.is(':visible')) {
            hideSidebarRight();
        } else {
            showSidebarRight();
        }

        return false;
    });

    // hide sidebar on overlay click
    overlay.click(function() {
        hideSidebar();
    });
    // hide sidebar on overlay click
    overlayRight.click(function() {
        hideSidebarRight();
    });
});