 "use strict;"

 // 获取已存json结点数据以及画布
var nodesArray    = JSON.parse(nodes);
var linksArray    = JSON.parse(links);
var colorsArray   = JSON.parse(colors);
var previousSelectedNode;
var isDragging    = false;
var canvas        = document.getElementById('myCanvas'),
	//  计算画布的宽度
	width         = canvas.offsetWidth,
	//  计算画布的高度
	height        = canvas.offsetHeight,
	context       = canvas.getContext('2d')
	ratio         = window.devicePixelRatio || 1
	img           = new Image()		    
	img.src       = "../img/Ras signaling.png";
	//  设置宽高
	canvas.width  = width;
	canvas.height = height; 

	img.onload = function() {
	  	context.drawImage(img, 0, 0, context.canvas.width, context.canvas.height);
	};

	window.onload = function() {
		drawNode();
	    canvas.onmousedown = canvasClick;
	    canvas.onmouseup   = stopDragging;
	    canvas.onmouseout  = stopDragging;
	    canvas.onmousemove = dragNode;
	    //paint_centered_wrap(canvas, 30, 70, 100, 90, "Adon olam, asher malakh, bterem");
	};		

/**
 * @param canvas : The canvas object where to draw . 
 *                 This object is usually obtained by doing:
 *                 canvas = document.getElementById('canvasId');
 * @param x     :  The x position of the rectangle.
 * @param y     :  The y position of the rectangle.
 * @param w     :  The width of the rectangle.
 * @param h     :  The height of the rectangle.
 * @param text  :  The text we are going to centralize.
 * @param fh    :  The font height (in pixels).
 * @param spl   :  Vertical space between lines
 */
function paint_centered_wrap (canvas, x, y, w, h, text, fh, spl) {
    // The painting properties 
    // Normally I would write this as an input parameter
    var Paint = {
        RECTANGLE_STROKE_STYLE : 'black',
        RECTANGLE_LINE_WIDTH : 1,
        VALUE_FONT : '12px Arial',
        VALUE_FILL_STYLE : 'red'
    }
    /*
     * @param ctx   : The 2d context 
     * @param mw    : The max width of the text accepted
     * @param font  : The font used to draw the text
     * @param text  : The text to be splitted   into 
     */
    var split_lines = function(context, mw, font, text) {
        // We give a little "padding"
        // This should probably be an input param
        // but for the sake of simplicity we will keep it
        // this way
        mw = mw - 10;
        // We setup the text font to the context (if not already)
        context.font = font;
        // We split the text by words 
        var words = text.split(' ');
        var new_line = words[0];
        var lines = [];
        for(var i = 1; i < words.length; ++i) {
           if (context.measureText(new_line + " " + words[i]).width < mw) {
               new_line += " " + words[i];
           } else {
               lines.push(new_line);
               new_line = words[i];
           }
        }
        lines.push(new_line);
        // DEBUG 
        // for(var j = 0; j < lines.length; ++j) {
        //    console.log("line[" + j + "]=" + lines[j]);
        // }
        return lines;
    }
    // Obtains the context 2d of the canvas 
    // It may return null
    if (context) {
        // draw rectangular
        context.strokeStyle=Paint.RECTANGLE_STROKE_STYLE;
        context.lineWidth = Paint.RECTANGLE_LINE_WIDTH;
        context.strokeRect(x, y, w, h);
        // Paint text
        var lines = split_lines(context, w, Paint.VALUE_FONT, text);
        // Block of text height
        var both = lines.length * (fh + spl);
        if (both >= h) {
            // We won't be able to wrap the text inside the area the area is too small. We should inform the user about this in a meaningful way
        } else {
            // We determine the y of the first line
            var ly = (h - both)/2 + y + spl*lines.length;
            var lx = 0;
            for (var j = 0, ly; j < lines.length; ++j, ly+=fh+spl) {
                // We continue to centralize the lines
                lx = x+w/2-context.measureText(lines[j]).width/2;
                // DEBUG 
                console.log("context.fillText('"+ lines[j] +"', "+ lx +", " + ly + ")");
                context.fillText(lines[j], lx, ly);
            }
        }
    } else {
    // Do something meaningful
    }
}	

function drawNode() {
	// 清除画布，准备绘制 
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.drawImage(img, 0, 0, context.canvas.width, context.canvas.height);	
	var fillColors   = [];
	var strokeColors = [];
	// 遍历所有结点
	for(var h=0; h < nodesArray.length; h++) {
		var node = nodesArray[h];
	    if (node.color != null) {
	    	context.globalAlpha = 0.95; // 0.0 to 1.0 (fully to no transparent) 
			for (var s=0; s < node.color.length; s++) {
				fillColors.push(node.color[s]);
				strokeColors.push(node.color[s]-100);
			}
			context.fillStyle = "rgb("+ fillColors.join(",")+")";
			context.strokeStyle = "rgb("+ strokeColors.join(",")+")";
			fillColors   = [];
			strokeColors = [];

			context.beginPath();	  	            
			// 绘制椭圆
	        if (node.shape == "ellipse") {	// .ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise);          
				context.ellipse(node.x*width, node.y*height, node.w*width, node.h*height, 0 * Math.PI/180, 0, Math.PI*2);
			}  
			// 绘制矩形
			else if (node.shape == "rectangle") {		
				context.rect(node.x*width, node.y*height, node.w*width, node.h*height);		  
			}     

			context.closePath();
			context.fill();				    

			if (node.isSelected) {
		        context.lineWidth = 4;
		    }
		    else {
		        context.lineWidth = 1;
		    }
		        
		    context.stroke();
				    /*
				    // 绘制文字
				    context.fillStyle = "black"; // font color to write the text with
				    //var font = "bold " + height/60 +"px serif";
				    //context.font = font;
				    context.textAlign="center"; 
					context.textBaseline = "middle";
				    context.fillText(node.text, node.x*width, node.y*height, node.w*width*2);
				    */

			if (context) {
				context.fillStyle="black";
				context.font = "bold " + 12 +"px serif";
				if (node.shape == "ellipse") {
					context.fillText(node.text, node.x*width-node.w*width/1.5,node.y*height-node.h*height/1.5);
				}
				else {
					var mw = node.w*width - 5;
					var words = node.text.split(' ');
					var new_line = words[0];
					var lines = [];
					for(var i = 1; i < words.length; ++i) {
						if (context.measureText(new_line + " " + words[i]).width < mw) {
							new_line += " " + words[i];
					    } 
					    else {
					    	lines.push(new_line);
					        new_line = words[i];
					    }
					}
					lines.push(new_line);
					var fh = 12;
					var spl = 2;
					var both = lines.length * (fh + spl);
					if (both >= node.y*height) {
					// We won't be able to wrap the text inside the area the area is too small. We should inform the user about this in a meaningful way
					} 
					else {// We determine the y of the first line
					    var ly = (node.h*height - both)/2 + node.y*height; // + spl*lines.length
					    var lx = 0;
					    for (var j = 0, ly; j < lines.length; ++j, ly+=fh+spl) {
					        // We continue to centralize the lines
					        lx = node.x*width+node.w*width/2-context.measureText(lines[j]).width/2;
					        // DEBUG 
					        console.log("context.fillText('"+ lines[j] +"', "+ lx +", " + ly + ")");
					        context.fillText(lines[j], lx, ly);
					    }
					}				        	
				}

			} 
			else { console.log("Text cannot be drawn for "+ node.key);}
		}
		// 绘制图片
		else if (node.shape == "no") { 
			    	//var image = new Image()		
			    	//image.src = node.img;
			    	//context.drawImage(image,node.x*width, node.y*height, node.w*width, node.h*height);
			context.rect(node.x*width, node.y*height, node.w*width, node.h*height);
		} 
		// 绘制纯文字
		else {
			context.fillStyle = "black"; // font color to write the text with
			var font = "bold " + node.h*height*1.3 +"px serif";
			context.font = font;
			context.textBaseline = "top";
			context.fillText(node.text, node.x*width-node.w*width+5,node.y*height-node.w*width/3);
		} 		 
	} 
		
	// 绘制连线
	for(var j=0; j < linksArray.length; j++) {         		  
		var linkFromKey = linksArray[j].from; // to get key of each link
	    var linkToKey   = linksArray[j].to;
	    for (var c=0; c < colorsArray.length; c++) {
	    	if (linksArray[j].style==colorsArray[c].style){
	    		context.strokeStyle = colorsArray[c].color;
	        }
	    }
	          	
	    /*
		 * 计算二阶贝塞尔曲线的控制点
		 * @param  sx     起点x坐标
		 * @param  sy     起点y坐标
		 * @param  dx     终点x坐标
		 * @param  dy     终点y坐标
		 * @return point  控制点坐标 
		 * 计算bezier曲线尾端角度
		 * @param  cx   控制点x坐标       
		 * @param  cy   控制点y坐标
		 * @param  dx   线段终点x坐标
		 * @param  dy   线段终点y坐标
		 * @return      返回角度
		 * 画箭头
		 * @param  ctx    canvas绘画上下文
		 * @param  dx     线段终点x坐标
		 * @param  dy     线段终点y坐标
		 * @param  angle  箭头角度
		 * @param  sizeL  箭头长度
		 * @param  sizeW  箭头宽度
		 */
	    var a,cx,cy,X,Y,len;
	    var sw = nodesArray[linkFromKey-1].w*width;
	    var sh = nodesArray[linkFromKey-1].h*height;
	    var dw = nodesArray[linkToKey-1].w*width;
	    var dh = nodesArray[linkToKey-1].h*height;
	    //console.log(nodesArray[linkFromKey-1], nodesArray[linkToKey-1]);
	    // 确定起点
	    if (nodesArray[linkFromKey-1].shape != "ellipse") {
	    	var sx = nodesArray[linkFromKey-1].x*width + nodesArray[linkFromKey-1].w*width/2; // 中心点
	        var sy = nodesArray[linkFromKey-1].y*height + nodesArray[linkFromKey-1].h*height/2; // 中心点
	    }
	    else {
	    	var sx = nodesArray[linkFromKey-1].x*width; // 中心点
			var sy = nodesArray[linkFromKey-1].y*height;
	    }	
	    // 确定终点 
	    if (nodesArray[linkToKey-1].shape != "ellipse") {
	    	var sx = nodesArray[linkToKey-1].x*width + nodesArray[linkToKey-1].w*width/2; // 中心点
	        var sy = nodesArray[linkToKey-1].y*height + nodesArray[linkToKey-1].h*height/2; // 中心点
	    }
	    else {
	    	var dx = nodesArray[linkToKey-1].x*width;
			var dy = nodesArray[linkToKey-1].y*height;
	    }          
		/*				
				// 当起点在终点右上方
				if (sx > dx & sy < dy) {
					if (sx-dx > (sw+dw)/2 & dy-sy > (sh+dh)/2) {
						sx = sx - sw + 0.001*width;
	            		sy = sy + sh + 0.005*height;
	            		dx = dx + dw + 0.005*width;
	            		dy = dy;
					}
					else {
						sx = sx + sw/2+10;
						sy = sy;
					}
	            	
	            }
				// 当起点在终点右下方
				else if (sx > dx & sy > dy) {
	            	sx = sx;
	            	sy = sy;
	            	dx = dx;
	            	dy = dy;
	            }
	            // 当起点在终点左下方
				else if (sx < dx & sy > dy) {
	            	sx = sx + nodesArray[linkFromKey-1].w*width + 0.005*width;
	            	sy = sy;
	            }
	            // 当起点在终点左上方
				else if (sx < dx - nodesArray[linkFromKey-1].w*width/2 & sy < dy) {
	            	sx = sx + nodesArray[linkFromKey-1].w*width + 0.005*width;
	            	sy = sy;
	            	dx = dx - nodesArray[linkToKey-1].w*width - 0.005*width;
	            }
	            */
		X = (sx + dx) / 2;
		Y = (sy + dy) / 2;
		len = -0.2 * Math.sqrt(Math.pow((dy - sy),2) + Math.pow((dx - sx),2)); // 控制贝塞尔曲线曲率
		a = Math.atan2(dy - sy, dx - sx);
		cx = X - len * Math.sin(a);
		cy = Y + len * Math.cos(a);
		var cx = linksArray[j].cx*width;
	    var cy = linksArray[j].cy*height;
	    //console.log(cy);
		context.beginPath();
		context.moveTo(sx,sy); 				
		context.quadraticCurveTo(cx, cy, dx, dy);
		context.lineWidth = 1.8;
		context.stroke();
		var angle = Math.atan2((dy - cy) , (dx - cx));
		var sizeL = 10;
		var sizeW = 10;
		var al = sizeL / 2;
		var aw = sizeW / 2;
		context.save();
		context.translate(dx,dy);
		context.rotate(angle);
		context.translate(-al,-aw);
		context.beginPath();
		context.moveTo(0,0);
		context.lineTo(al,aw);   // 画箭头
		context.lineTo(0,sizeW); // 画箭头
		context.strokeStyle = "maroon";
		context.stroke();
		context.restore();										             
	}	
}

function canvasClick(e) {
	// 取得画布上被单击的点
	var clickX = e.pageX - canvas.offsetLeft;
	var clickY = e.pageY - canvas.offsetTop;	    
	// 查找被单击的结点
	for(var i = nodesArray.length-1; i>=0; i--) {
		var node = nodesArray[i]; 
		// 使用勾股定理计算这个点与结点中心之间的距离
		var distanceFromCenter = Math.sqrt(Math.pow(node.x*width - clickX, 2) + Math.pow(node.y*height - clickY, 2))
	    // 判断被单击的点在哪个结点中
	    if (distanceFromCenter <= node.w*width) {
	    	// 清除之前选择的结点
	    	if (previousSelectedNode != null) previousSelectedNode.isSelected = false;
	    	// 更新结点为当前选择的结点
	    	previousSelectedNode = node;
	    	// 选择新结点
	    	node.isSelected = true;	 
	    	// 允许结点拖拽
	    	isDragging = true;

url = nodesArray[i].url;
$.msgbox({
	type: 'iframe',
	title: 'Node: ' + nodesArray[i].text,
	overlay: false,
	icons: ['min', 'max', 'close']
		});

			// 更新显示 
			drawNode();
			// 停止搜索
			return;
		}
	}
}
	   
function stopDragging() {
	isDragging = false;
} 

function dragNode(e) {
	// 判断结点是否开始拖拽
	if (isDragging == true) {
		// 判断拖拽对象是否存在
		if (previousSelectedNode != null) {
			// 取得鼠标位置
			var x = (e.pageX - canvas.offsetLeft)/width;
			var y = (e.pageY - canvas.offsetTop)/height;	
			// 判断鼠标位置是否超过可拖拽边界
			if ((Math.pow((x*width-width/2),2)/3000+85) < y*height & y*height < (Math.pow((x*width-width/2),2)/6000+600)) {
				// 判断结点是否在组内
				if (previousSelectedNode.group_with != null) {
					// 计算被拖拽结点与鼠标位置差
					var differenceX = x - previousSelectedNode.x;
					var differenceY = y - previousSelectedNode.y;
					// 将结点移动到鼠标相对屏幕的实时位置 
					previousSelectedNode.x = x;
					previousSelectedNode.y = y;
					// 查找与被单击的结点同组的结点
					for (var g=0; g<previousSelectedNode.group_with.length; g++) {
						var groupWithNode = nodesArray[previousSelectedNode.group[g]-1];
						groupWithNode.x = groupWithNode.x + differenceX;
						groupWithNode.y = groupWithNode.y + differenceY;
					}
				}
				else {
					// 将结点移动到鼠标相对屏幕的实时位置
					previousSelectedNode.x = x;
					previousSelectedNode.y = y;
				}
			}
			else { console.log("不可拖拽") }
				// 更新画布
				drawNode();
		}
	}
}