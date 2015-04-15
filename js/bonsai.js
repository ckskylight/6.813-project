var TableUI = function(model) {

    stage.on('message', function(data) {
        //if (data.bonsai === 'tree') {
            //text.attr('textFillColor', 'red');
        //}
        console.log(data);
    });

    var xoffset = 0;
    var yoffset = 0;
    var draglock = false;
    var curRect = null;
    var rectList = [];

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

    this.drawTables = function() {
        var time_percent = 80;

        var rows = 2;
        var cols = 4;
        var xOffset = 85;
        var yOffset = 100;


        var rect1 = new Rect(0,0,900,600)
            .addTo(stage)
            .stroke('black', 10)
            .on('click', function(e) {
                stage.sendMessage({
                    harro: "hamster"
                });
            });


        for (var i=0; i < rows; i++) {
            for (var j=0; j < cols; j++) {
                time_percent = Math.random() * 100;
                var newRect = new Rect(190*j + xOffset, 190*i + yOffset, 150,150)
                    .addTo(stage)
                    .fill(
                        gradient.linear('top', [['#D42207',time_percent] , ['#FFC50A',time_percent]])
                        )
                    .stroke('#222222', 1)
                    //.attr('filters', new filter.DropShadow(1, 1, 5, 0x000000FF))
                    .on('pointerdown', function(e) {
                        var w = this.attr('width');
                        var h = this.attr('height');
                        var x = this.attr('x');
                        var y = this.attr('y');
                        xoffset = e.x - x;
                        yoffset = e.y - y;
                        curRect = this;
                        console.log(curRect);
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
                    })
                    .on('click', function(e) {
                        this.destroy();
                        // NOTE: listeners aren't included in the object so just adding
                        // the object to the stage won't work. The listeners have to be
                        // re-added for functionality to work
                        this.addTo(stage);
                    });

                rectList.push(newRect);
            }
        }


        //var rect2 = new Rect(20,20,150,150)
            //.addTo(stage)
            //.fill(
                //gradient.linear('top', [['red',time_percent] , ['blue',time_percent]])
                //)
            //.attr('filters', new filter.DropShadow(1, 1, 5, 0x000000FF))
            //.on('click', function(e) {
                //this.destroy();
                //// NOTE: listeners aren't included in the object so just adding
                //// the object to the stage won't work. The listeners have to be
                //// re-added for functionality to work
                //this.addTo(stage);
                //this.on('pointermove', function(e) {
                    //time_percent = 100*((150-(e.y-20))/150);
                    //this.fill(
                        //gradient.linear('top', [['red',time_percent] , ['blue',time_percent]])
                    //);
                //});
            //})
            //.on('pointermove', function(e) {
                //time_percent = 100*((150-(e.y-20))/150);
                //this.fill(
                    //gradient.linear('top', [['red',time_percent] , ['blue',time_percent]])
                //);
            //});


        //var rect3 = new Rect(190,20,150,150)
            //.addTo(stage)
            //.fill('orange')
            //.on('pointerdown', function(e) {
                //var w = this.attr('width');
                //var h = this.attr('height');
                //var x = this.attr('x');
                //var y = this.attr('y');
                //xoffset = e.x - x;
                //yoffset = e.y - y;
                //curRect = this;
                //console.log(curRect);
            //})
            //.on('drag', function(e) {
                //this.attr('x', e.x - xoffset);
                //this.attr('y', e.y - yoffset);
                //// Collision detection
                //for (var i=0; i < rectList.length; i++) {
                    //var rect = rectList[i];
                    //if (rect != this && isCollide(this,rect)) {
                        //console.log("Collide with rect " + i);
                        //connectRects(rect, this);
                    //}
                //}
            //})
            //.attr('filters', new filter.DropShadow(1, 1, 5, 0x000000FF));

        //var rect4 = new Rect(360, 20, 150, 150)
            //.addTo(stage)
            //.fill('orange')
            //.attr('filters', new filter.DropShadow(1, 1, 5, 0x000000FF));

        //var rect5 = new Rect(530, 20, 200, 200)
            //.addTo(stage)
            //.fill('maroon')
            //.attr('filters', new filter.DropShadow(1, 1, 5, 0x000000FF));

        ////rectList.push(rect1);
        //rectList.push(rect2);
        //rectList.push(rect3);
        //rectList.push(rect4);
        //rectList.push(rect5);

        console.log(rectList);
    }
}

var UI = new TableUI(null);

UI.drawTables();

