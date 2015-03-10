var hoverOnOpacity = 1.0;
var hoverOffOpacity = 0.75;
var highlightTime = 100;

var turn = circleTokenName;
var won = false;

$(document).ready(function() {
  drawResetCanvas();

  $('canvas#reset').click(function(e) {
    location.reload();
  });

  $('canvas').hover(
    function(e) {
      var field = $(this);

      field.animate({ opacity: hoverOnOpacity }, highlightTime);
    },
    function(e) {
      var field = $(this);

      field.animate({ opacity: hoverOffOpacity }, highlightTime);
  });

  $('canvas.field').click(function(e) {
    var field = $(this);
    var fieldId = field.attr(idAttributeName);

    if (field.attr(tokenAttributeName) != noTokenName || won) {
      return;
    }

    if (turn == circleTokenName) {
      drawCircle(fieldId);
      field.attr(tokenAttributeName, circleTokenName);
    }
    else {
      drawCross(fieldId);
      field.attr(tokenAttributeName, crossTokenName);
    }

    //field.animate({opacity: 1.0}, 0, function() { field.animate({opacity:0.75},2000)});

    if (checkWin(turn)) {
      alert(turn + ' won!');
      won = true;
    }
    else if (checkDraw()) {
      alert('Draw!');
    };

    turn = turn == circleTokenName ? crossTokenName : circleTokenName;
  });
});

function checkWin(figure) {
  return (
    checkRows(figure) ||
    checkCols(figure) ||
    checkDiagonals(figure)
  );
};

function checkRows(figure) {
  return (
    checkRow(1, figure) ||
    checkRow(2, figure) ||
    checkRow(3, figure)
  );
};

function checkRow(rowId, figure) {
  return (
    checkField(rowId, 1, figure) &&
    checkField(rowId, 2, figure) &&
    checkField(rowId, 3, figure)
  );
};

function checkCols(figure) {
  return (
    checkCol(1, figure) ||
    checkCol(2, figure) ||
    checkCol(3, figure)
  );
};

function checkCol(colId, figure) {
  return (
    checkField(1, colId, figure) &&
    checkField(2, colId, figure) &&
    checkField(3, colId, figure)
  );
};

function checkDiagonals(figure) {
  return (
    checkField(1, 1, figure) &&
    checkField(2, 2, figure) &&
    checkField(3, 3, figure)
  ) ||
  (
    checkField(1, 3, figure) &&
    checkField(2, 2, figure) &&
    checkField(3, 1, figure)
  );
};

function checkDraw() {
  return !(
    checkField(1, 1, noTokenName) ||
    checkField(1, 2, noTokenName) ||
    checkField(1, 3, noTokenName) ||
    checkField(2, 1, noTokenName) ||
    checkField(2, 2, noTokenName) ||
    checkField(2, 3, noTokenName) ||
    checkField(3, 1, noTokenName) ||
    checkField(3, 2, noTokenName) ||
    checkField(3, 3, noTokenName)
  );
};

function checkField(rowId, colId, figure) {
  return $('canvas#f' + rowId + colId).attr(tokenAttributeName) == figure
}

function drawCircle(fieldId) {
  var canvas =  document.getElementById(fieldId);
  var context = canvas.getContext('2d');
  var centerX = canvas.width / 2;
  var centerY = canvas.height / 2;
  var innerRadius = 0.5 * canvas.width / 2;
  var outerRadius = 0.75 * canvas.width / 2;

  context.beginPath();
  context.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI, false);
  context.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI, true);
  context.fillStyle = circleColor;
  context.fill();
};

function drawCross(fieldId) {
  var canvas =  document.getElementById(fieldId);
  var context = canvas.getContext('2d');
  var centerX = canvas.width / 2;
  var centerY = canvas.height / 2;

  var innerMostPointsOffset = 0.20 * canvas.width / 2;
  var innerEndingPointsXOffset = 0.4 * canvas.width / 2;
  var innerEndingPointsYOffset = 0.75 * canvas.width / 2;
  var outerEndingPointsXOffset = 0.75 * canvas.width / 2;
  var outerEndingPointsYOffset = 0.75 * canvas.width / 2;

  context.fillStyle = crossColor;
  context.beginPath();
  context.moveTo(centerX - innerMostPointsOffset, centerY);
  context.lineTo(centerX - outerEndingPointsXOffset, centerY - outerEndingPointsYOffset);
  context.lineTo(centerX - innerEndingPointsXOffset, centerY - innerEndingPointsYOffset);
  context.lineTo(centerX, centerY - innerMostPointsOffset);
  context.lineTo(centerX + innerEndingPointsXOffset, centerY - innerEndingPointsYOffset);
  context.lineTo(centerX + outerEndingPointsXOffset, centerY - outerEndingPointsYOffset);
  context.lineTo(centerX + innerMostPointsOffset, centerY);
  context.lineTo(centerX + outerEndingPointsXOffset, centerY + outerEndingPointsYOffset);
  context.lineTo(centerX + innerEndingPointsXOffset, centerY + innerEndingPointsYOffset);
  context.lineTo(centerX, centerY + innerMostPointsOffset);
  context.lineTo(centerX - innerEndingPointsXOffset, centerY + innerEndingPointsYOffset);
  context.lineTo(centerX - outerEndingPointsXOffset, centerY + outerEndingPointsYOffset);
  context.closePath();
  context.fill();
};

function drawResetCanvas() {
  var canvas = document.getElementById("reset");
  var context = canvas.getContext("2d");
  context.fillStyle = fontColor;
  context.font = font;
  context.fillText(resetText, 35, 35);
};
