var TableUI = function(model) {

    var xoffset = 0;
    var yoffset = 0;
    var draglock = false;
    var curRect = null;
    var rectList = [];

    var isCollide = function(s, o) { // self, other
        var sPoints = []
        var oPoints = []
        sPoints.push([s.attr('x'),s.attr('y')]);
        sPoints.push([s.attr('x')+s.attr('width'), s.attr('y')]);
        sPoints.push([s.attr('x'), s.attr('y') + s.attr('height')]);
        sPoints.push([s.attr('x') + s.attr('width'), s.attr('y') + s.attr('height')]);
        oPoints.push([o.attr('x'),o.attr('y')]); // Top left
        oPoints.push([o.attr('x')+o.attr('width'), o.attr('y')]); // Top right
        oPoints.push([o.attr('x'), o.attr('y') + o.attr('height')]); // Bottom left
        oPoints.push([o.attr('x') + o.attr('width'), o.attr('y') + o.attr('height')]); // Bottom right

        for (var i=0; i < sPoints; i++) {
            var x = sPoints[i][0];
            var y = sPoints[i][1];
            for (var j=0; j < oPoints; j++) {
                if (j == 0) {

                }
            }
        }

    }

    this.drawTables = function() {

        var time_percent = 80;

        var rect1 = new Rect(0,0,900,600)
            .addTo(stage)
            .stroke('black', 10);


        var rect2 = new Rect(20,20,150,150)
            .addTo(stage)
            .fill(
                gradient.linear('top', [['red',time_percent] , ['blue',time_percent]])
                )
            .attr('filters', new filter.DropShadow(1, 1, 5, 0x000000FF))
            .on('click', function(e) {
                this.destroy();
                // NOTE: listeners aren't included in the object so just adding
                // the object to the stage won't work. The listeners have to be
                // re-added for functionality to work
                this.addTo(stage);
                this.on('pointermove', function(e) {
                    time_percent = 100*((150-(e.y-20))/150);
                    this.fill(
                        gradient.linear('top', [['red',time_percent] , ['blue',time_percent]])
                    );
                });
            })
            .on('pointermove', function(e) {
                time_percent = 100*((150-(e.y-20))/150);
                this.fill(
                    gradient.linear('top', [['red',time_percent] , ['blue',time_percent]])
                );
            });


        var rect3 = new Rect(190,20,150,150)
            .addTo(stage)
            .fill('orange')
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
                console.log("drag");
                this.attr('x', e.x - xoffset);
                this.attr('y', e.y - yoffset);
                // Collision detection
                for (var i=0; i < rectList.length; i++) {
                    var rect = rectList[i];
                    if (rect != this) {
                        isCollide(this,rect);
                    }
                }
            })
            .attr('filters', new filter.DropShadow(1, 1, 5, 0x000000FF));

        var rect4 = new Rect(360, 20, 150, 150)
            .addTo(stage)
            .fill('orange')
            .attr('filters', new filter.DropShadow(1, 1, 5, 0x000000FF));

        var rect5 = new Rect(530, 20, 200, 200)
            .addTo(stage)
            .fill('maroon')
            .attr('filters', new filter.DropShadow(1, 1, 5, 0x000000FF));

        rectList.push(rect1);
        rectList.push(rect2);
        rectList.push(rect3);
        rectList.push(rect4);
        rectList.push(rect5);

        console.log(rectList);
    }
}

var UI = new TableUI(null);

UI.drawTables();

