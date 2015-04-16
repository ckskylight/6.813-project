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
                        if (rect != this && isCollide(this,rect)) {
                            console.log("Collide with rect " + i);
                            connectRects(rect, this);
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

    var connectRects = function(s, o) {  // for now we want to connect the bottom of s to top of o
        var sPoints = collectRectPoints(s);
        var oPoints = collectRectPoints(o);

        // we want to position the top left of o on the bottom left of s
        sBottomLeft = sPoints[2];
        o.attr('x', sBottomLeft[0]);
        o.attr('y', sBottomLeft[1]);
    }

    var isCollide = function(s, o) { // self, other
        var sPoints = collectRectPoints(s);
        var oPoints = collectRectPoints(o);

        var inside = false;

        for (var i=0; i < sPoints.length; i++) {
            var x = sPoints[i][0];
            var y = sPoints[i][1];
            var pointInside = true;
            for (var j=0; j < oPoints.length; j++) {
                var oPoint = oPoints[j];
                if (j == 0 && !(x >= oPoint[0] && y >= oPoint[1])) {
                    pointInside = false;
                }
                else if (j == 1 && !(x <= oPoint[0] && y >= oPoint[1])) {
                    pointInside = false;
                }
                else if (j == 2 && !(x >= oPoint[0] && y <= oPoint[1])) {
                    pointInside = false;
                }
                else if (j == 3 && !(x <= oPoint[0] && y <= oPoint[1])) {
                    pointInside = false;
                }
            }

            if (pointInside == true) inside = true;
        }

        return inside;

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
                        gradient.linear('top', [['#A040FFAA',time_percent] , ['#CCCCCCAA',time_percent]])
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
                                if (isCollide(this,rect)) {
                                    console.log("Collide with rect " + i);
                                    connectRects(rect, this);
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

