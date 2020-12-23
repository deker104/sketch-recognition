var mouseStart = null;
var mousePosition = null;

function init_pc(){
    $('#canvas').mousedown(function (e) {
        mousePosition = {x: e.pageX - this.offsetLeft, y: e.pageY - this.offsetTop};
        mouseStart = {x: mousePosition.x, y: mousePosition.y};
        addClick(mousePosition.x, mousePosition.y, false); //Daniil api
        paint = true;
        draw();
    });

    $('#canvas').mousemove(function (e) {
        if (paint) {
            mousePosition = {x: e.pageX - this.offsetLeft, y: e.pageY - this.offsetTop}
            addClick(mousePosition.x, mousePosition.y, true); //Daniil api
            draw();
            mouseStart = {x: mousePosition.x, y: mousePosition.y};
        }
    });

    $('#canvas').mouseup(function (e) {
        paint = false;
        mouseStart = null;
        mousePosition = null;
    });
}

function draw() {
    ctx.strokeStyle = curColor;
    ctx.lineCap = "round";
    ctx.lineWidth = 7;

    ctx.beginPath();

    ctx.moveTo(mouseStart.x, mouseStart.y);
    ctx.lineTo(mousePosition.x, mousePosition.y);

    ctx.stroke();
}