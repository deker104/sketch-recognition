var canvas;
var ctx;
var resultModal;

const sensitivity = 20;

var paint = false;
var curColor = "#FF5733";
var touchStart = null;
var touchPosition = null;

var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();

function init() {
  canvas = document.getElementById('canvas');
  ctx = document.getElementById('canvas').getContext("2d");
}

function addClick(x, y, b) {
  clickX.push(Math.floor(x));
  clickY.push(Math.floor(y));
  clickDrag.push(b);
}

function submit() {
  axios.post("/predict", {
      clickX, clickY, clickDrag
    })
    .then(res => res.data)
    .then(function (res) {
      $("#result").text(`Я думаю, что это: ${res.result}`);
      resultModal.show();
    });
}

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  clickX = new Array();
  clickY = new Array();
  clickDrag = new Array();
}

function main() {
  init();
  init_pc();
  init_phone();
  $("#submit").click(submit);
  $("#clear").click(clear);
  canvas.width = $(".container").width() - 12;
  resultModal = new bootstrap.Modal(document.getElementById('resultModal'));
}

$(document).ready(main);

/*
function is_touch_device() {
    if ("ontouchstart" in window || window.TouchEvent)
        return true;

    if (window.DocumentTouch && document instanceof DocumentTouch)
        return true;

    const prefixes = ["", "-webkit-", "-moz-", "-o-", "-ms-"];
    const queries = prefixes.map(prefix => `(${prefix}touch-enabled)`);

    return window.matchMedia(queries.join(",")).matches;
}
*/