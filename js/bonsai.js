var Table = function() {
    this.info = {
        name: "empty",
        partySize: 0,
        capacity: 0
    };
    this.number = null;
    this.selected = false;
    this.connectedTables = [];
}

var TableUI = function(model) {

    stage.on('message', function(data) {
        console.log(data);
        if (data.command == "show available") {
            showNotFull();
        }
        else if (data.command == "remove shading") {
            removeShading();
        }
        else if (data.command == "assign") {
            currentCustomerInfo = data.details;
            showNotFull();
            assignMode = true;
        }
        else if (data.command == "add table") {
            addTable(data.details);
        }
        else if (data.command == "cancel add table") {
            cancelAddTable();
        }
        else if (data.command == "save table") {
            saveTable();
        }
        else if (data.command == "delete table") {
            activateDelete();
        }
        else if (data.command == "save delete table") {
            deleteSelectedTables();
            deselectAllTables();
        }
        else if (data.command == "cancel delete table") {
            deselectAllTables();
        }
        else if (data.command == "reset tables") {
            deleteAllTables();
            drawTablesInternal();
        }
        else if (data.command == "cancel assign") {
            removeShading();
            assignMode = false;
        }
    });

    var currentCustomerInfo = null;

    var xoffset = 0;
    var yoffset = 0;
    var draglock = false;
    var curRect = null;
    var rectList = [];
    var timeList = [];
    var tables = [];
    var assignMode = false;

    var deleteMode = false;

    var curAddingTable = null;


    var LEFT = 0;
    var RIGHT = 1;
    var TOP = 2;
    var BOTTOM = 3;

    var activateDelete = function() {
        deleteMode = true;
        addDeleteStroke();
    }

    var addDeleteStroke = function() {
        for (var i=0; i < rectList.length; i++) {
            rectList[i].stroke('#696969', 4);
        }
    }

    var addTable = function(details) {
        drawRect(null, details);
    }

    var toggleSelectTableToDelete = function(rect) {
        for (var i=0; i < rectList.length; i++) {
            if (rectList[i] == rect) {
                if (tables[i].selected) {
                    rect.stroke("#696969", 4);
                }
                else {
                    rect.stroke("#FF504A", 4);
                }
                tables[i].selected = !tables[i].selected;
            }
        }
    }

    var deleteAllTables = function() {
        for (var i=0; i < tables.length; i++) {
            tables[i].selected = true;
        }
        deleteSelectedTables();
    }


    var deleteSelectedTables = function() {
        var deleteIdx = [];
        for (var i=0; i < tables.length; i++) {
            if (tables[i].selected) {
                rectList[i].destroy();
                tables[i].number.destroy();
                deleteIdx.push(i);
            }
        }
        deleteIdx.sort(function(a,b) {
            return b-a;
        });
        for (var i=0; i < deleteIdx.length; i++) {
            tables.splice(deleteIdx[i], 1);
            timeList.splice(deleteIdx[i], 1);
            rectList.splice(deleteIdx[i], 1);
        }
    }

    var deselectAllTables = function() {
        deleteMode = false;
        for (var i=0; i < tables.length; i++) {
            tables[i].selected = false;
            rectList[i].stroke("#FFFFFF00", 0);
        }
    }

    var saveTable = function() {
        curAddingTable[0].fill("#FFFFFF00");
        curAddingTable[0].fill(
            gradient.linear('top', [['#A040FFAA',0] , ['#DDDDDDAA',0]])
            );
        redrawAllRects();
    }

    var cancelAddTable = function() {
        curAddingTable[0].destroy();
        curAddingTable[1].destroy();
        tables.pop();
        rectList.pop();
        timeList.pop();
        redrawAllRects();
    }

    var drawRect = function(i, newRectDetails) {
        if (newRectDetails.length  > 0) {
            // newRectDetails
            // [capacity]
            var table = new Table();
            table.info["capacity"] = newRectDetails[0];
            // TODO: Be able to change size relative to capacity later
            var size = 130;

            var numLabel = new Text(table.info.capacity).attr('fontSize', '80px')
                .attr('x', 450  + size/2 - 25)
                .attr('y', 200  + size/2 - 25)
                .addTo(stage);

            var newRect = new Rect(450, 200, size,size)
                .addTo(stage)
                .fill("#FF504AAA");

            table.number = numLabel;
            rectList.push(newRect);
            tables.push(table);
            timeList.push(0);
            curAddingTable = [newRect, numLabel];
        }

        if (i == null) i = rectList.length - 1;

        var rect = rectList[i];
        rect.destroy();
        rect.addTo(stage)
        .on('pointerdown', function(e) {
            var w = this.attr('width');
            var h = this.attr('height');
            var x = this.attr('x');
            var y = this.attr('y');
            xoffset = e.x - x;
            yoffset = e.y - y;
            curRect = this;
            //console.log(curRect);
        });

        if (newRectDetails.length == 0) {
            rect.on('dblclick', function(e) {
                // Look for the rect's index and use that to modify
                // the table
                if (assignMode) {
                    for (var k=0; k < rectList.length; k++) {
                        if (rectList[k] == this) {
                            tables[k].info.name = currentCustomerInfo.name;
                            tables[k].info.partySize = currentCustomerInfo.partySize;
                            this.animate('1s', {
                                fillGradient: gradient.linear('top', [['#A040FFAA',100] , ['#CCCCCCAA',100]])
                            });
                            // also fill its connected tables
                            var connected = tables[k].connectedTables;
                            console.log(connected);
                            for (var n=0; n < connected.length; n++) {
                                connected[n].animate('1s', {
                                    fillGradient: gradient.linear('top', [['#A040FFAA',100] , ['#CCCCCCAA',100]])
                                });
                                //timeList[k] = 40;
                            }
                        }
                    }
                    console.log(tables);
                    removeShading();
                    assignMode = false;
                }
                else {
                    var info = null;
                    for (var k=0; k < rectList.length; k++) {
                        if (rectList[k] == this) {
                            info = tables[k].info
                        }
                    }
                    stage.sendMessage({
                        command: "modal",
                        details: info
                    });
                }
            })
            .on('click', function(e) {
                // Look for the rect's index and use that to modify
                // the table
                if (assignMode) {
                    for (var k=0; k < rectList.length; k++) {
                        if (rectList[k] == this) {
                            tables[k].info.name = currentCustomerInfo.name;
                            tables[k].info.partySize = currentCustomerInfo.partySize;
                            this.animate('1s', {
                                fillGradient: gradient.linear('top', [['#A040FFAA',100] , ['#CCCCCCAA',100]])
                            });
                            timeList[k] = 40;
                            // also fill its connected tables
                            var connected = tables[k].connectedTables;
                            console.log(connected);
                            for (var n=0; n < connected.length; n++) {
                                connected[n].animate('1s', {
                                    fillGradient: gradient.linear('top', [['#A040FFAA',100] , ['#CCCCCCAA',100]])
                                });
                                //timeList[k] = 40;
                            }
                        }
                    }
                    console.log(tables);
                    removeShading();
                    assignMode = false;
                    stage.sendMessage({
                        command: "assign done"
                    });
                }
                else if (deleteMode) {
                    toggleSelectTableToDelete(this);
                }
            });
        }
        if (newRectDetails.length == 0) {
            rect.on('drag', function(e) {
                this.attr('x', e.x - xoffset);
                this.attr('y', e.y - yoffset);
                // Collision detection
                for (var i=0; i < rectList.length; i++) {
                    var rect = rectList[i];
                    if (rect != this) {
                        var collideResult = isCollide(this,rect,true);
                        if (collideResult[0]) {
                            connectRects(rect, this, collideResult[1]);
                            var num = tables[i].number;
                            for (var j=0; j < rectList.length; j++) {
                                var rect2 = rectList[j];
                                if (rect2 == this) {
                                    var num = tables[j].number;
                                    num.attr('x', this.attr('x') + this.attr('height')/2 - 25);
                                    num.attr('y', this.attr('y') + this.attr('height')/2 - 25);
                                }
                            }
                        }
                    }
                    else if (rect == this) {
                        var num = tables[i].number;
                        num.attr('x', this.attr('x') + rect.attr('height')/2 - 25);
                        num.attr('y', this.attr('y') + rect.attr('height')/2 - 25);
                    }
                }
            });
        }
        else {
            rect.on('drag', function(e) {
                this.attr('x', e.x - xoffset);
                this.attr('y', e.y - yoffset);
                // Collision detection
                for (var i=0; i < rectList.length; i++) {
                    var rect = rectList[i];
                    if (rect == this) {
                        var num = tables[i].number;
                        num.attr('x', this.attr('x') + rect.attr('height')/2 - 25);
                        num.attr('y', this.attr('y') + rect.attr('height')/2 - 25);
                    }
                }
            });
        }
    }

    var redrawAllRects = function() {
        for (var i=0; i < tables.length; i++) {
            drawRect(i, []);
        }
    }

    var removeShading = function() {
        darkShadeRect.animate('0.5s', {
            fillColor: '#00000000'
        });
        redrawAllRects();
    }


    var showNotFull = function() {
        darkShadeRect.addTo(stage);
        darkShadeRect.animate('0.5s', {
            fillColor: '#00000077'
        });
        for (var i=0; i < timeList.length; i++) {
            if (timeList[i] == 0) {
                drawRect(i, []);
            }
        }
    }

    var collectRectPoints = function(rect) {
        points = [];
        points.push([rect.attr('x'), rect.attr('y')]); // top left
        points.push([rect.attr('x') + rect.attr('width'), rect.attr('y')]); // top right
        points.push([rect.attr('x'), rect.attr('y') + rect.attr('height')]); // bottom left
        points.push([rect.attr('x') + rect.attr('width'), rect.attr('y') + rect.attr('height')]); // bottom right
        return points;
    }

    var addToConnectedTables = function(s, o) {
        // add o to s's connectedTables list
        // Look for s's index
        var sIdx = null;
        for (var i=0; i < rectList.length; i++) {
            if (rectList[i] == s) sIdx = i;
        }

        // Check whether o is in s's list
        var insideS = false;
        var tablesList = tables[sIdx].connectedTables;
        for (var i=0; i < tablesList.length; i++) {
            if (tablesList[i] == o) insideS = true;
        }

        if (!insideS) {
            tablesList.push(o);
        }

        console.log(tables[sIdx].connectedTables);
    }

    var removeConnectedTables = function(s) {
        for (var i=0; i < rectList.length; i++) {
            if (rectList[i] == s) {
                rectList[i].connectedTables = [];
            }
        }
    }

    var connectRects = function(s, o, side) {
        // add s and o to each other's connectedTables list
        removeConnectedTables(s);
        removeConnectedTables(o);
        addToConnectedTables(s,o);
        addToConnectedTables(o,s);

        var sPoints = collectRectPoints(s);
        var oPoints = collectRectPoints(o);

        var width = o.attr('width');
        var height = o.attr('height');


        if (side == BOTTOM) {
            sBottomLeft = sPoints[2];
            o.attr('x', sBottomLeft[0]);
            o.attr('y', sBottomLeft[1]);
        }
        else if (side == LEFT) {
            sTopLeft = sPoints[0];
            o.attr('x', sTopLeft[0] - width);
            o.attr('y', sTopLeft[1]);
        }
        else if (side == RIGHT) {
            sTopRight = sPoints[1];
            o.attr('x', sTopRight[0]);
            o.attr('y', sTopRight[1]);
        }
        else if (side == TOP) {
            sTopLeft = sPoints[0];
            o.attr('x', sTopLeft[0]);
            o.attr('y', sTopLeft[1] - height);
        }
    }

    var pointDistance = function(x1, y1, x2, y2) {
        var a = x1 - x2;
        var b = y1 - y2;
        var dist = Math.sqrt(Math.pow(a,2) + Math.pow(b,2));
        return dist;
    }

    var isCollide = function(s, o, recurse) { // self, other
        var sPoints = collectRectPoints(s);
        var oPoints = collectRectPoints(o);

        var inside = false;
        var side = null;

        var topLeft = false;
        var topRight = false;
        var bottomLeft = false;
        var bottomRight = false;

        for (var i=0; i < sPoints.length; i++) {
            var x = sPoints[i][0];
            var y = sPoints[i][1];
            var pointInside = true;

            var pointDistances = [];

            for (var j=0; j < oPoints.length; j++) {
                var oPoint = oPoints[j];
                pointDistances.push(pointDistance(x,y,oPoint[0],oPoint[1]));
                // top left
                if (j == 0 && !(x >= oPoint[0] && y >= oPoint[1])) {
                    pointInside = false;
                }
                // top right
                if (j == 1 && !(x <= oPoint[0] && y >= oPoint[1])) {
                    pointInside = false;
                }
                // bottom left
                if (j == 2 && !(x >= oPoint[0] && y <= oPoint[1])) {
                    pointInside = false;
                }
                // bottom right
                if (j == 3 && !(x <= oPoint[0] && y <= oPoint[1])) {
                    pointInside = false;
                }
            }

            if (pointInside == true) {
                var minDist = 100000;
                var minDistIdx = 0;
                var minDist2 = 100000;
                var minDistIdx2 = 0;
                for (var k=0; k < pointDistances.length; k++) {
                    if (pointDistances[k] < minDist) {
                        minDist = pointDistances[k];
                        minDistIdx = k;
                    }
                }
                for (var k=0; k < pointDistances.length; k++) {
                    if (pointDistances[k] < minDist2 && pointDistances[k] > minDist) {
                        minDist2 = pointDistances[k];
                        minDistIdx2 = k;
                    }
                }
                if (minDistIdx == 0) topLeft = true;
                else if (minDistIdx == 1) topRight = true;
                else if (minDistIdx == 2) bottomLeft = true;
                else if (minDistIdx == 3) bottomRight = true;
                if (minDistIdx2 == 0) topLeft = true;
                else if (minDistIdx2 == 1) topRight = true;
                else if (minDistIdx2 == 2) bottomLeft = true;
                else if (minDistIdx2 == 3) bottomRight = true;
                inside = true;
                break;
            }
        }

        if (inside) {
            if (topLeft && topRight) side = TOP;
            else if (topLeft && bottomLeft) side = LEFT;
            else if (topRight && bottomRight) side = RIGHT;
            else if (bottomRight && bottomLeft) side = BOTTOM;
        }
        else if (!inside && recurse) {
            var flipCollide = isCollide(o,s,false);
            if (flipCollide[0]) {
                inside = true;
                var flipSide = flipCollide[1];
                if (flipSide == TOP) {
                    side = BOTTOM;
                }
                else if (flipSide == BOTTOM) {
                    side = TOP;
                }
                else if (flipSide == LEFT) {
                    side = RIGHT;
                }
                else if (flipSide == RIGHT) {
                    side = LEFT;
                }
            }
        }


        return [inside, side]; // side is relative to self
    }

    var darkShadeRect = new Rect(0,0,1100,550)
        .fill('#00000000')
        .on('click', function(e) {
            stage.sendMessage({
                harro: "hamster"
            });
        });

    this.drawTables = function() {
        drawTablesInternal();
    }

    var drawTablesInternal = function() {
        console.log("draw called");
        var time_percent = 80;

        var rows = 2;
        var cols = 4;
        var xOffset = 185;
        var yOffset = 100;
        var tableSizes = [[100, 150, 150, 150], [100, 150, 100, 100]];


        for (var i=0; i < rows; i++) {
            for (var j=0; j < cols; j++) {

                if (j == 1) time_percent = 0;
                else if (j == 3 && i == 1) time_percent = 0;
                else time_percent = Math.random() * 100;
                timeList.push(time_percent);

                var size = tableSizes[i][j];

                var table = new Table();
                if (size == 150) table.info["capacity"] = 5;
                else table.info["capacity"] = 2;

                var numLabel = new Text(table.info.capacity).attr('fontSize', '80px')
                    .attr('x', 190*j + xOffset + size/2 - 25)
                    .attr('y', 190*i + yOffset + size/2 - 25)
                    .addTo(stage);

                var newRect = new Rect(190*j + xOffset, 190*i + yOffset, size,size)
                    .addTo(stage)
                    .fill(
                        gradient.linear('top', [['#A040FFAA',time_percent] , ['#DDDDDDAA',time_percent]])
                        )
                    //.stroke('#222222', 1)
                    .on('pointerdown', function(e) {
                        var w = this.attr('width');
                        var h = this.attr('height');
                        var x = this.attr('x');
                        var y = this.attr('y');
                        xoffset = e.x - x;
                        yoffset = e.y - y;
                        curRect = this;
                    })
                    .on('drag', function(e) {
                        this.attr('x', e.x - xoffset);
                        this.attr('y', e.y - yoffset);
                        // Collision detection
                        for (var i=0; i < rectList.length; i++) {
                            var rect = rectList[i];
                            if (rect != this) {
                                var collideResult = isCollide(this,rect,true);
                                if (collideResult[0]) {
                                    connectRects(rect, this, collideResult[1]);
                                    var num = tables[i].number;
                                    for (var j=0; j < rectList.length; j++) {
                                        var rect2 = rectList[j];
                                        if (rect2 == this) {
                                            var num = tables[j].number;
                                            num.attr('x', this.attr('x') + this.attr('height')/2 - 25);
                                            num.attr('y', this.attr('y') + this.attr('height')/2 - 25);
                                        }
                                    }
                                }
                            }
                            else if (rect == this) {
                                var num = tables[i].number;
                                num.attr('x', this.attr('x') + rect.attr('height')/2 - 25);
                                num.attr('y', this.attr('y') + rect.attr('height')/2 - 25);
                            }
                        }
                    })
                    .on('dblclick', function(e) {
                        // Look for the rect's index and use that to modify
                        // the table
                        if (assignMode) {
                            for (var k=0; k < rectList.length; k++) {
                                if (rectList[k] == this) {
                                    tables[k].info.name = currentCustomerInfo.name;
                                    tables[k].info.partySize = currentCustomerInfo.partySize;
                                    this.animate('1s', {
                                        fillGradient: gradient.linear('top', [['#A040FFAA',100] , ['#CCCCCCAA',100]])
                                    });
                                }
                            }
                            console.log(tables);
                            removeShading();
                            assignMode = false;
                            stage.sendMessage({
                                command: "assign done"
                            });
                        }
                        else {
                            var info = null;
                            for (var k=0; k < rectList.length; k++) {
                                if (rectList[k] == this) {
                                    info = tables[k].info
                                }
                            }
                            stage.sendMessage({
                                command: "modal",
                                details: info
                            });
                        }
                    })
                    .on('click', function(e) {
                        // Look for the rect's index and use that to modify
                        // the table
                        if (assignMode) {
                            for (var k=0; k < rectList.length; k++) {
                                if (rectList[k] == this) {
                                    tables[k].info.name = currentCustomerInfo.name;
                                    tables[k].info.partySize = currentCustomerInfo.partySize;
                                    this.animate('1s', {
                                        fillGradient: gradient.linear('top', [['#A040FFAA',100] , ['#CCCCCCAA',100]])
                                    });
                                    timeList[k] = 40;

                                    // also fill its connected tables
                                    var connected = tables[k].connectedTables;
                                    console.log(connected);
                                    for (var n=0; n < connected.length; n++) {
                                        connected[n].animate('1s', {
                                            fillGradient: gradient.linear('top', [['#A040FFAA',100] , ['#CCCCCCAA',100]])
                                        });
                                        //timeList[k] = 40;
                                    }
                                }
                            }
                            console.log(tables);
                            removeShading();
                            assignMode = false;
                            stage.sendMessage({
                                command: "assign done"
                            });
                        }
                        else if (deleteMode) {
                            toggleSelectTableToDelete(this);
                        }
                    });

                rectList.push(newRect);


                table.number = numLabel;
                tables.push(table);
            }
            console.log(tables);
        }
        console.log(rectList);
    }
}

var UI = new TableUI(null);

UI.drawTables();

