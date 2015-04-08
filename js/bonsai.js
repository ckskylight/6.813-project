var drawTables = function() {

    var time_percent = 80;

    new Rect(0,0,900,600)
        .addTo(stage)
        .fill('green')
        .on('click', function(e) {
            this.fill('random');
        });

    new Rect(20,20,150,150)
        .addTo(stage)
        .fill(
            gradient.linear('top', [['red',time_percent] , ['blue',time_percent]])
            )
        .attr('filters', new filter.DropShadow(1, 1, 5, 0x000000FF))
        .on('pointermove', function(e) {
            time_percent = 100*((150-(e.y-20))/150);
            this.fill(
                gradient.linear('top', [['red',time_percent] , ['blue',time_percent]])
            );
        });

    new Rect(190,20,150,150)
        .addTo(stage)
        .fill('orange')
        .attr('filters', new filter.DropShadow(1, 1, 5, 0x000000FF));

    new Rect(360, 20, 150, 150)
        .addTo(stage)
        .fill('orange')
        .attr('filters', new filter.DropShadow(1, 1, 5, 0x000000FF));

    new Rect(530, 20, 200, 200)
        .addTo(stage)
        .fill('maroon')
        .attr('filters', new filter.DropShadow(1, 1, 5, 0x000000FF));
}

drawTables();
