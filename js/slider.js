$(document).ready(function() {
    // show sidebar and overlay
    function showSidebar() {
        sidebarLeft.css('margin-left', '0');

        overlay.show(0, function() {
            overlay.fadeTo('500', 0.5);
        });   
    }

    // hide sidebar and overlay
    function hideSidebar() {
        sidebarLeft.css('margin-left', sidebarLeft.width() * -1 + 'px');

        overlay.fadeTo('500', 0, function() {
            overlay.hide();
        });;
    }

    function showSidebarRight() {
        sidebarRight.css('margin-left', $(window).width() - sidebarRight.width());

        overlay.show(0, function() {
            overlayRight.fadeTo('500', 0.5);
        });   
    }

    // hide sidebar and overlay
    function hideSidebarRight() {
        sidebarRight.css('margin-left', 1500 + 'px');

        overlayRight.fadeTo('500', 0, function() {
            overlayRight.hide();
        });;
    }

    // selectors
    var sidebarLeft = $('[data-sidebar-left]');
    var sidebarRight = $('[data-sidebar-right]');
    var buttonLeft = $('[data-sidebar-button]');
    var buttonRight = $('[data-sidebar-button-right]');
    var overlay = $('[data-sidebar-overlay]');
    var overlayRight = $('[data-sidebar-overlay-right]');

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