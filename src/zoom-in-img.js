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

  var isIE = (/msie ([\d.]+)/gi).test(navigator.userAgent);

  window.onload = function() {
    zoomImg = d.getElementsByClassName ? d.getElementsByClassName("zoom-in-img") : d.querySelectorAll("." + "zoom-in-img");

    zoomedImg = d.getElementById("zoomed-img") || d.createElement("div");
    zoomedImg.id = "zoomed-img";
    zoomedImg.style.position = "fixed";
    zoomedImg.style.border = "1px solid white";
    zoomedImg.style["box-shadow"] = "1px 1px 5px #333333";
    d.body.appendChild(zoomedImg);

    var length = zoomImg.length;
    for (var i = 0; i < length; i++) {
      bindEvent.call(zoomImg[i], "mouseenter", zoomInImgEnter);
      bindEvent.call(zoomImg[i], "mouseleave", zoomInImgLeave);
      bindEvent.call(zoomImg[i], "mousemove", zoomInImg);

      if (/zoom-in-click/gi.test(zoomImg[i].className)) {
        zoomImg[i].canZoom = false;
        bindEvent.call(zoomImg[i], "click", zoomInImgClick);
      } else {
        zoomImg[i].canZoom = true;
      }

      zoomImg[i].naturalSize = {
        w: 0,
        h: 0
      }
      zoomImg[i].scale = 0;
      zoomImg[i].zoomedInWidth = 0;
      getNaturalSize(zoomImg[i]);
    }
  };

  function bindEvent(type, callback) {
    this.addEventListener ? this.addEventListener(type, callback) : this.attachEvent("on" + type, callback);
  }

  function zoomInImgClick(event) {
    event = event || window.event;
    target = event.target || event.srcElement;
    target.canZoom = !target.canZoom;
  }

  function zoomInImgEnter(event) {
    event = event || window.event;
    target = event.target || event.srcElement;
    zoomedImg.style.height = zoomedImg.style.width = target.zoomedInWidth + "px";
    zoomedImg.style.visibility = target.zoomedInWidth ? "visible" : "collapse";
  }

  function zoomInImgLeave(event) {
    event = event || window.event;
    target = event.target || event.srcElement;
    zoomedImg.style.visibility = "collapse";
  }

  function zoomInImg(event) {
    event = event || window.event;
    target = event.target || event.srcElement;

    if (target.canZoom) {
      target.style.cursor = "crosshair";
      zoomedImg.style.visibility = "visible";
    } else {
      target.style.cursor = isIE ? "pointer" : "zoom-in";
      zoomedImg.style.visibility = "collapse";
      return;
    }

    if(target.style.visibility === "collapse" || zoomedImg.style.height === "0px") {
			zoomedImg.style.height = zoomedImg.style.width = target.zoomedInWidth + "px";
    	target.style.visibility = target.zoomedInWidth ? "visible" : "collapse";
    }

    startX = event.offsetX - RADIUS;
    startX = startX > 0 ? startX : 0;
    endX = event.offsetX + RADIUS;
    startX = (endX > target.width ? target.width - RADIUS * 2 : startX) * target.scale;

    startY = event.offsetY - RADIUS;
    startY = startY > 0 ? startY : 0;
    endY = event.clientY + RADIUS;
    startY = (endY > target.height ? target.height - RADIUS * 2 : startY) * target.scale;

    if (Math.abs(startX - previewX) > STABILIZER || Math.abs(startY - previewY) > STABILIZER) {
      left = event.clientX - target.zoomedInWidth / 2;
      top = event.clientY - target.zoomedInWidth - STABILIZER;
      top = top < 0 ? top + target.zoomedInWidth + STABILIZER * 2 : top;
      left = left < 0 ? 0 : left;
      left = left > width ? width : left;
      zoomedImg.style.left = left + "px";
      zoomedImg.style.top = top + "px";
      zoomedImg.style.background = "url(" + target.realSrc + ")" + " -" + startX + "px -" + startY + "px no-repeat";

      previewX = startX;
      previewY = startY;
    }
  }

  function getNaturalSize(element) {
    var largeSrc = element.dataset && element.dataset.large || element.getAttribute("data-large");
    element.realSrc = largeSrc || element.src;
    if (largeSrc) {
      var temp = document.createElement("img");
      temp.src = largeSrc;
      temp.onload = function() {
        element.naturalSize = {
          w: this.width,
          h: this.height
        };
        element.scale = element.naturalSize.w / element.width;
        element.zoomedInWidth = element.scale * RADIUS * 2;
      };
    } else {
      if (element.naturalWidth) {
        element.naturalSize = {
          w: element.naturalWidth,
          h: element.naturalHeight
        }
        element.scale = element.naturalSize.w / element.width;
        element.zoomedInWidth = element.scale * RADIUS * 2;
      } else {
        var temp = new Image();
        temp.src = element.src;
        element.naturalSize = {
          w: temp.width,
          h: temp.height
        };
        element.scale = element.naturalSize.w / element.width;
        element.zoomedInWidth = element.scale * RADIUS * 2;
      }
    }

  }
})();
