var Table = function() {
    this.info = {
        name: "empty",
        partySize: 0,
        capacity: 0
    };
    this.number = null;
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
    });

    var currentCustomerInfo = null;

    var xoffset = 0;
    var yoffset = 0;
    var draglock = false;
    var curRect = null;
    var rectList = [];
    var timeList = [];
    var assignMode = false;

    var tables = [];

    var LEFT = 0;
    var RIGHT = 1;
    var TOP = 2;
    var BOTTOM = 3;

    var removeShading = function() {
        darkShadeRect.animate('0.5s', {
            fillColor: '#00000000'
        });
    }

    var showNotFull = function() {
        darkShadeRect.addTo(stage);
        darkShadeRect.animate('0.5s', {
            fillColor: '#00000077'
        });
        for (var i=0; i < timeList.length; i++) {
            if (timeList[i] == 0) {
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
                                    fillGradient: gradient.linear('top', [['#A040FFAA',100] , ['#DDDDDDAA',100]])
                                });
                                //this.fill(
                                    //gradient.linear('top', [['#A040FFAA',100] , ['#CCCCCCAA',100]])
                                //);
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
                .on('drag', function(e) {
                    this.attr('x', e.x - xoffset);
                    this.attr('y', e.y - yoffset);
                    // Collision detection
                    for (var i=0; i < rectList.length; i++) {
                        var rect = rectList[i];
                        var collideResult = isCollide(this,rect);
                        if (rect != this && collideResult[0]) {
                            console.log("Collide with rect " + i);
                            connectRects(rect, this, collideResult[1]);
                            var num = tables[i].number;
                            num.attr('x', rect.attr('x') + rect.attr('height')/2 - 25);
                            num.attr('y', rect.attr('y') + rect.attr('height')/2 - 25);
                        }
                    }
                });
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

    var connectRects = function(s, o, side) {  // for now we want to connect the bottom of s to top of o
        var sPoints = collectRectPoints(s);
        var oPoints = collectRectPoints(o);

        var width = o.attr('width');
        var height = o.attr('height');

        console.log(side);

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

    var isCollide = function(s, o) { // self, other
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
            console.log(topLeft + "," + topRight + "," + bottomLeft + "," + bottomRight);
            if (topLeft && topRight) side = TOP;
            else if (topLeft && bottomLeft) side = LEFT;
            else if (topRight && bottomRight) side = RIGHT;
            else if (bottomRight && bottomLeft) side = BOTTOM;
        }

        console.log("side: "  + side);

        return [inside, side];
    }

    var darkShadeRect = new Rect(0,0,1100,550)
        .fill('#00000000')
        .on('click', function(e) {
            stage.sendMessage({
                harro: "hamster"
            });
        });


    this.drawTables = function() {
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
                        //console.log(curRect);
                    })
                    .on('drag', function(e) {
                        this.attr('x', e.x - xoffset);
                        this.attr('y', e.y - yoffset);
                        // Collision detection
                        for (var i=0; i < rectList.length; i++) {
                            var rect = rectList[i];
                            if (rect != this) {
                                var collideResult = isCollide(this,rect);
                                if (collideResult[0]) {
                                    console.log("Collide with rect " + i);
                                    connectRects(rect, this, collideResult[1]);
                                    var num = tables[i].number;
                                    num.attr('x', rect.attr('x') + rect.attr('height')/2 - 25);
                                    num.attr('y', rect.attr('y') + rect.attr('height')/2 - 25);
                                }
                            }
                            else {
                                var num = tables[i].number;
                                num.attr('x', this.attr('x') + rect.attr('height')/2 - 25);
                                num.attr('y', this.attr('y') + rect.attr('height')/2 - 25);
                            }
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
                                    //this.fill(
                                        //gradient.linear('top', [['#A040FFAA',100] , ['#CCCCCCAA',100]])
                                    //);
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

