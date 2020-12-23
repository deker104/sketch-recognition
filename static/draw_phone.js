function init_phone(){
    canvas.addEventListener("touchstart", function (e) { TouchStart(e); });
    canvas.addEventListener("touchmove", function (e) { TouchMove(e); });
    canvas.addEventListener("touchend", function (e) { TouchEnd(e, "green"); });
    canvas.addEventListener("touchcancel", function (e) { TouchEnd(e, "red"); });
    window.addEventListener('resize', resizeCanvas, false);
    window.addEventListener('orientationchange', resizeCanvas, false);
    resizeCanvas();
}

function resizeCanvas() {/*
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
*/}

function TouchStart(e)
{
    touchPosition = {x: e.changedTouches[0].clientX - canvas.offsetLeft, y: e.changedTouches[0].clientY - canvas.offsetTop};
    touchStart = {x: touchPosition.x, y: touchPosition.y};
    addClick(touchPosition.x, touchPosition.y, false);
}

function TouchMove(e)
{
    touchPosition = {x: e.changedTouches[0].clientX - canvas.offsetLeft, y: e.changedTouches[0].clientY - canvas.offsetTop};
    addClick(touchPosition.x, touchPosition.y, true);
    DrawLine();
    touchStart = {x: touchPosition.x, y: touchPosition.y};
}

function TouchEnd(e, color)
{
    touchStart = null;
    touchPosition = null;
}

function DrawLine()
{
    ctx.strokeStyle = curColor;
    ctx.lineCap = "round";
    ctx.lineWidth = 7;

    ctx.beginPath();

    ctx.moveTo(touchStart.x, touchStart.y);
    ctx.lineTo(touchPosition.x, touchPosition.y);

    ctx.stroke();
}
