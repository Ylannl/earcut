'use strict';  /*eslint comma-spacing: 0, no-unused-vars: 0 */ /*global earcut:false */


var testPoints = [
    [
        [20, 20],
        [300, 20],
        // [300, 300],
        [20, 300]
    ],
    [
        [50, 50],
        [100, 50],
        // [100, 100],
        [50, 100]
    ],

    [
        [150, 50],
        [200, 50],
        // [200, 100],
        [150, 100]
    ],

    // [
    //     [50, 150],
    //     [100, 150],
    //     [100, 200],
    //     [50, 200]
    // ],

    // [
    //     [150, 150],
    //     [200, 150],
    //     [200, 200],
    //     [150, 200]
    // ],
];


var testPoints = [
    [
        [0,300],
        [0,0],
        [300,0],
        [300,300]
    ],
    [
        [50, 50],
        [100, 50],
        [100, 100],
        [50, 100]
    ],

    [
        [150, 50],
        [200, 50],
        // [200, 100],
        [150, 100]
    ],
    [
        [150,300],
        [200,300],
        [300,200],
        [300,150]
    ],
];

// 'water-huge2',
// 'water-huge',
// 'steiner'
var testPoints_steiner = [
    [[0,0],[100,0],[100,100],[0,100]],
    [[50,50]],
    [[30,40]],
    [[70,60]],
    [[20,70]]
];






var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;

for (var i = 0; i < testPoints[0].length; i++) {
    minX = Math.min(minX, testPoints[0][i][0]);
    maxX = Math.max(maxX, testPoints[0][i][0]);
    minY = Math.min(minY, testPoints[0][i][1]);
    maxY = Math.max(maxY, testPoints[0][i][1]);
}

var width = maxX - minX;
var height = maxY - minY;

// ctx.translate(-minX, -minY);

canvas.width = window.innerWidth;
canvas.height = canvas.width * height / width + 10;

canvas.width = width + 1000;
canvas.height = height + 1000;

var ratio = 1; //(canvas.width - 10) / width;

if (devicePixelRatio > 1) {
    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';
    canvas.width *= 2;
    canvas.height *= 2;
    ctx.scale(2, 2);
}
// ctx.scale(0.2,0.2);


var data = earcut.flatten(testPoints);

console.time('earcut');
// for (var i = 0; i < 1000; i++) {
    console.log(data.vertices)
    console.log(data.holes)
    console.log(data.dimensions)
var result = earcut(data.vertices, data.holes, data.dimensions);
// }
console.timeEnd('earcut');
console.log(window.filterCount);

var triangles = [];
for (i = 0; i < result.length; i++) {
    var index = result[i];
    triangles.push([data.vertices[index * data.dimensions], data.vertices[index * data.dimensions + 1]]);
}

ctx.lineJoin = 'round';


for (i = 0; triangles && i < triangles.length; i += 3) {
    var p = triangles.slice(i, i + 3);
    // console.log(p[0] + ',' + p[1] + ',' + p[2]);
    drawPoly([p], 'rgba(255,0,0,0.2)', 'rgba(255,255,0,0.2)');
    // drawPoly([triangles.slice(i, i + 3)], 'rgba(255,0,0,0.0)', 'rgba(255,0,0,0.3)');
}

drawPoly(testPoints, 'black');


// drawPointIndex(linkPoints);

// drawPoint([3891, 4224], "red");
// drawPoint([4224, 4224], "red");

function drawPoint(p, color) {
    var x = (p[0] - minX) * ratio + 5,
        y = (p[1] - minY) * ratio + 5;
    ctx.fillStyle = color || 'grey';
    ctx.fillRect(x - 2, y - 2, 4, 4);
}

function drawPoly(rings, color, fill) {

    ctx.strokeStyle = color;
    if (fill) ctx.fillStyle = fill;
    for (var k = 0; k < rings.length; k++) {

        var points = rings[k];
        if (points.length===1){
            drawPoint(points[0], color);
        }else {
            ctx.beginPath();
            for (var i = 0; i < points.length; i++) {
                var x = (points[i][0] - minX) * ratio + 5,
                    y = (points[i][1] - minY) * ratio + 5;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();
        }
        // if (k>0){
            // break;
        // }
    }

    if (fill) ctx.fill('evenodd');
}

function drawPointIndex(points){
    ctx.closePath();
    ctx.fillStyle = "black"
    var index = 0;
    var $next = function(){
        var p = points.pop();
        if (!p){
            return;
        }
        if (index>18){
            ctx.fillText(index, p[0]+10, p[1]+10);
        }else if (index>8){
            ctx.fillText(index, p[0], p[1]);
        }else{
            ctx.fillText(index, p[0]-15, p[1]);
        }
        index++;
        setTimeout(function(){
            $next();
        }, 1000)
    }
    $next();
}

