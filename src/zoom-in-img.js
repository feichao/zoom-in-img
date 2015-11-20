(function() {
  var zoomImg;
  var d = document;
  var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

  var RADIUS = 20;
  var STABILIZER = 10;

  var startX = 0;
  var startY = 0;

  var endX = 0;
  var endY = 0;

  var left = 0;
  var top = 0;

  var previewX = 0;
  var previewY = 0;

  var zoomedImg;
  var target;

  window.onload = function() {
    zoomImg = d.getElementsByClassName ? d.getElementsByClassName("zoom-in-img") : d.querySelectorAll("." + "zoom-in-img");

    zoomedImg = d.getElementById("zoomed-img") || d.createElement("div");
    zoomedImg.id = "zoomed-img";
    zoomedImg.style.position = "fixed";
    zoomedImg.style.border = "1px solid white";
    zoomedImg.style["box-shadow"] = "1px 1px 5px #333333";
    document.body.appendChild(zoomedImg);

    var length = zoomImg.length;
    for (var i = 0; i < length; i++) {
    	bindEvent.call(zoomImg[i], "mouseenter", zoomInImgEnter);
    	bindEvent.call(zoomImg[i], "mouseleave", zoomInImgLeave);
      bindEvent.call(zoomImg[i], "mousemove", zoomInImg);
      zoomImg[i].naturalSize = getNaturalSize(zoomImg[i]);
      zoomImg[i].scale = zoomImg[i].naturalSize.w / zoomImg[i].width;
      zoomImg[i].zoomedInWidth = zoomImg[i].scale * RADIUS * 2;
    }
  };

  function bindEvent(type, callback) {
    this.addEventListener ? this.addEventListener(type, callback) : this.attachEvent("on" + type, callback);
  }

  function zoomInImgEnter(event) {
  	event = event || window.event;
		target = event.target || event.srcElement;
		zoomedImg.style.height = zoomedImg.style.width = target.zoomedInWidth + "px";
  }

  function zoomInImgLeave(event) {
  	event = event || window.event;
		target = event.target || event.srcElement;
		zoomedImg.style.height = zoomedImg.style.width = 0;
  }

  function zoomInImg(event) {
    event = event || window.event;
		target = event.target || event.srcElement;

    startX = event.offsetX - RADIUS;
    startX = startX > 0 ? startX : 0;
    endX = event.offsetX + RADIUS;
    startX = (endX > target.width ? target.width - RADIUS * 2 : startX) * target.scale;

    startY = event.offsetY - RADIUS;
    startY = startY > 0 ? startY : 0;
    endY = event.offsetY + RADIUS;
    startY = (endY > target.height ? target.height - RADIUS * 2 : startY) * target.scale;

    if (Math.abs(startX - previewX) > STABILIZER || Math.abs(startY - previewY) > STABILIZER) {
    	left = event.clientX - target.zoomedInWidth / 2;
    	top = event.clientY - target.zoomedInWidth - STABILIZER;
    	top = top < 0 ? top + target.zoomedInWidth + STABILIZER * 2 : top;
    	left = left < 0 ? 0 : left;
    	left = left > width ? width : left; 
      zoomedImg.style.left = left + "px";
      zoomedImg.style.top = top + "px";
      zoomedImg.style.background = "url(" + target.src + ")" + " -" + startX + "px -" + startY + "px no-repeat";

      previewX = startX;
      previewY = startY;
    }
  }

  function getNaturalSize(element) {
    if (element.naturalWidth) {
      return {
        w: element.naturalWidth,
        h: element.naturalHeight
      }
    } else {
      var temp = new Image();
      temp.src = element.src;
      return {
        w: temp.width,
        h: temp.height
      };
    }
  }

})();
