var cinegui = angular.module('angular-cinegui', []);
cinegui.directive('cinegui', function() {
  return {
      scope: {
        callback: '&success'
      },
      restrict: 'AE',
      replace: 'true',
      templateUrl: '/module/cinegui/template-cinegui.html',
      link: function(scope, element, attrs) {
            // unwrap the function
            scope.callback = scope.callback(); 
        }
  };
}).controller('angular-cinegui', function($scope) {
}).directive('cinebutton', function() {
	 return {
	      restrict: 'E',
	      transclude: true,
	      scope: {   
			pos: '=',
			callback: '&',
			mode: '@',
			width: '=',
			icon: '=',
			image: '=',
			out: '='
	      }, template: '<div style="float:left;text-align:center;line-height:28px;" ng-transclude height="48px" class="cinebutton"></div>',
	      link: function(scope, element, attrs) {
		   element.bind('touchstart click', function(event){
			event.preventDefault();
			event.stopPropagation();
			if (scope.mode =='toggle') {
			}
			scope.$apply(attrs["ngClick"]);
		   });
	      }
	  
	  }

	}).directive('cinetimeline', function() {
	 return {
	      restrict: 'E',
	      scope: {   
			pos: '=',
			callback: '&',
			in: '=',
			mode: '@',
			width: '=',
			out: '='
	      },
	      template: '<div style="float:left;height:48px;padding:2px;margin-bottom:3px;background-color:#999;" height=48px><canvas width="{{width}}" height="48px" style="cursor:pointer;notheight:48px; background-color:#ca3; border-radius:5px;" ></canvas></div>',

	      link: function(scope, element, attrs) {
		    scope.canvas = element.find('canvas')[0];
		    scope.context = scope.canvas.getContext('2d');
		    scope.callback = scope.callback();
		    scope.tpos = 0;

	CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
	  if (w < 2 * r) r = w / 2;
	  if (h < 2 * r) r = h / 2;
	  this.beginPath();
	  this.moveTo(x+r, y);
	  this.arcTo(x+w, y,   x+w, y+h, r);
	  this.arcTo(x+w, y+h, x,   y+h, r);
	  this.arcTo(x,   y+h, x,   y,   r);
	  this.arcTo(x,   y,   x+w, y,   r);
	  this.closePath();
	  return this;
	}

		    scope.render = function() { 
			scope.context.fillStyle = '#000';
			scope.context.fillRect(0, 0, scope.canvas.width, scope.canvas.height);
			scope.context.fillStyle = "#0A0";
			var y1 = 10;
			var y1 = 0;
			var hei = scope.canvas.height;
			var wid = 5;
			//var x1  = scope.canvas.width / (out - in) * attrs.pos;
			//var x1  = scope.canvas.width / (out - in) * attrs.pos;
			//var x1  = scope.pos;
			var cleft = 15;
			var cright = 20;
			var cwid = scope.canvas.width - cleft - cright;
			var x1  = cwid / (scope.out - scope.in) * scope.tpos + cleft;
			if (scope.mode == 'volume') {
			    y1 += 10;
			    hei = 25;
			    wid = 25;
			    var bwid = scope.canvas.width - 20;
			    scope.context.fillStyle = "#555";
			    scope.context.roundRect(cleft, y1 +5, cwid, hei -10, 5).fill();
			    scope.context.fillStyle = "#888";
			    scope.context.roundRect(x1 - 12, y1, wid, hei, 5).fill();
			} else {
			    scope.context.fillRect(x1, y1, wid, hei);
			}
		    };
	/*	
		    scope.render = function() {
			scope.context.fillStyle = "#0A0";
			scope.context.fillStyle = '#000';
			scope.context.fillRect(0, 0, scope.canvas.width, scope.canvas.height);
			var y1 = 10;
			var y1 = 0;
			var hei = scope.canvas.height;
			var wid = 5;
			var x1  = scope.canvas.width / (out - in) * pos;

		    }
	*/
		    scope.setPos = function( tpos, do_cb ) {
			 if (tpos > scope.out) tpos = scope.out;
			 if (tpos < scope.in) tpos = scope.in;
			 scope.tpos = tpos;
			 if (do_cb && scope.callback) scope.callback(tpos);
			 scope.render();
		    }

		    scope.touch = function (event) {
			
		    }
		var tracking = 0;
		var last_tm = 0;;
		element.bind('touchstart', function(event){
		    tracking = 1;
		    var lastX;
		    var lastY;
		    if(event.offsetX!==undefined){
			lastX = event.offsetX;
			lastY = event.offsetY;
		     } else { // Firefox compatibility
			lastX = event.layerX - event.currentTarget.offsetLeft;
			lastY = event.layerY - event.currentTarget.offsetTop;
		     }
		     var pos = (lastX / scope.canvas.width) * (scope.out - scope.in) +  scope.in;
		      scope.setPos(pos, 1);

		});
		element.bind('touchmove', function(event){
		    if (!tracking) return;
		    var dd = new Date();
		    var tm = dd.getTime();
		    //console.log((tm));
		    var lastX;
		    var lastY;
		    if(event.offsetX!==undefined){
			lastX = event.offsetX;
			lastY = event.offsetY;
		     } else { // Firefox compatibility
			lastX = event.layerX - event.currentTarget.offsetLeft;
			lastY = event.layerY - event.currentTarget.offsetTop;
		     }
		     var pos = (lastX / scope.canvas.width) * (scope.out - scope.in) +  scope.in;
		     var do_cb = 1;
	/*
		     if ((tm - last_tm) < 340)  do_cb = 0;
		     else last_tm = tm;
	*/

		     scope.setPos(pos, do_cb);
		
		});
		element.bind('touchend', function(event){
		    tracking = 0;
		});
		element.bind('mousemove', function(event){
		    if (!tracking) return;
		    var dd = new Date();
		    var tm = dd.getTime();
		    //console.log((tm));
		    var lastX;
		    var lastY;
		    if(event.offsetX!==undefined){
			lastX = event.offsetX;
			lastY = event.offsetY;
		     } else { // Firefox compatibility
			lastX = event.layerX - event.currentTarget.offsetLeft;
			lastY = event.layerY - event.currentTarget.offsetTop;
		     }
		     var pos = (lastX / scope.canvas.width) * (scope.out - scope.in) +  scope.in;
		     var do_cb = 1;
	/*
		     if ((tm - last_tm) < 340)  do_cb = 0;
		     else last_tm = tm;
	*/

		     scope.setPos(pos, do_cb);

		});

		element.bind('mouseup', function(event){
		    tracking = 0;
		});

		element.bind('mousedown', function(event){
		    tracking = 1;
		    var lastX;
		    var lastY;
		    if(event.offsetX!==undefined){
			lastX = event.offsetX;
			lastY = event.offsetY;
		     } else { // Firefox compatibility
			lastX = event.layerX - event.currentTarget.offsetLeft;
			lastY = event.layerY - event.currentTarget.offsetTop;
		     }
		     var pos = (lastX / scope.canvas.width) * (scope.out - scope.in) +  scope.in;
		      scope.setPos(pos, 1);

		});

		    
		    scope.$watch('pos', function(val) {
			scope.tpos = val;
			scope.render(val);
		    });
		   
		}
	  };
	}).directive('cineprogress', function() {
	 return {
	      restrict: 'E',
	      scope: {   src: '=',
	      },
	      template: '<div><div ng-controller="cinemeter-controller"><canvas width="100px" height="16px" style="width:100px; height:16px; background-color:#ca3; border-radius:3px;" ></canvas></div></div>',
	      link: function(scope, element, attrs) {
		    scope.canvas = element.find('canvas')[0];
		    scope.context = scope.canvas.getContext('2d');
		    
		    scope.$watch('src', function(newValue) {

			scope.context.fillStyle = '#000';
			scope.context.fillRect(0, 0, scope.canvas.width, scope.canvas.height);

			scope.context.fillStyle = "#0A0";
			var y1 = 0;
			var hei = 24;
			var y3 = scope.canvas.height / 2;;
			var y2 = scope.canvas.height - 10;
			var x = newValue / 100 * (scope.canvas.width);
			scope.context.fillRect(0, y1, x, hei);
		//	scope.context.fillRect(5, y1 + hei + 5, x, hei);
/*
			scope.context.lineStyle = "#000";
			for( var ii = 0; ii < 20; ii++) {
			   var x = 5 + (scope.canvas.width / 20 * ii);
			   scope.context.beginPath();
			   scope.context.moveTo(x, 0);
			   scope.context.lineTo(x, scope.canvas.height);
			   scope.context.stroke();
			}	   
*/

			
			//console.log("SRC CHANGED " + newValue);
		    });




		}
	  };

	}).directive('cinebar', function() {
	 return {
	      restrict: 'E',
	      scope: {   src: '=',
	      },
	      template: '<div><div ng-controller="cinemeter-controller"><canvas width="150px" height="30px" style="width:150px; height:30px; background-color:#ca3; border-radius:5px;" ></canvas></div></div>',
	      link: function(scope, element, attrs) {
		    scope.canvas = element.find('canvas')[0];
		    scope.context = scope.canvas.getContext('2d');
		    
		    scope.$watch('src', function(newValue) {

			scope.context.fillStyle = '#000';
			scope.context.fillRect(0, 0, scope.canvas.width, scope.canvas.height);

			scope.context.fillStyle = "#0A0";
			var y1 = 10;
			var hei = 12;
			var y3 = scope.canvas.height / 2;;
			var y2 = scope.canvas.height - 10;
			var x = newValue / 100 * (scope.canvas.width - 20);
			scope.context.fillRect(5, y1, x, hei);
		//	scope.context.fillRect(5, y1 + hei + 5, x, hei);
/*
			scope.context.lineStyle = "#000";
			for( var ii = 0; ii < 20; ii++) {
			   var x = 5 + (scope.canvas.width / 20 * ii);
			   scope.context.beginPath();
			   scope.context.moveTo(x, 0);
			   scope.context.lineTo(x, scope.canvas.height);
			   scope.context.stroke();
			}	   
*/

			
			//console.log("SRC CHANGED " + newValue);
		    });




		}
	  };
	}).directive('cinemeter', function() {
	 return {
	      restrict: 'E',
	      scope: {   src: '=',
	      },
	      template: '<div><div ng-controller="cinemeter-controller"><canvas width="150px" height="48px" style="width:150px; height:48px; background-color:#ca3; border-radius:5px;" ></canvas></div></div>',
	      link: function(scope, element, attrs) {
		    scope.canvas = element.find('canvas')[0];
		    scope.context = scope.canvas.getContext('2d');
		    
		    scope.$watch('src', function(newValue) {
			scope.context.fillStyle = '#000';
			scope.context.fillRect(0, 0, scope.canvas.width, scope.canvas.height);
			scope.context.fillStyle = "#0A0";
			var y1 = 10;
			var hei = 12;
			var y3 = scope.canvas.height / 2;;
			var y2 = scope.canvas.height - 10;
			var x = newValue / 100 * (scope.canvas.width - 20);
			scope.context.fillRect(5, y1, x, hei);
			scope.context.fillRect(5, y1 + hei + 5, x, hei);
			scope.context.lineStyle = "#000";
			for( var ii = 0; ii < 20; ii++) {
			   var x = 5 + (scope.canvas.width / 20 * ii);
			   scope.context.beginPath();
			   scope.context.moveTo(x, 0);
			   scope.context.lineTo(x, scope.canvas.height);
			   scope.context.stroke();
			}	   

			
			//console.log("SRC CHANGED " + newValue);
		    });




		}
	  };
	}).controller('cinemeter-controller', function($scope, $location, $element ) {



	}).filter('timecode', function() {
	    return function( sec, scope ) {
		//var ndate = new Date() / 1000.;
		if (scope.option && scope.option.offsetSeconds) {
		    sec = Number(sec) + Number(scope.option.offsetSeconds);
			console.log("Have Offset secconds " + scope.option.offsetSeconds);
		}

 		console.log("Sec = " + sec);
		var hr = Math.floor(sec / 60 / 60);
		console.log("HR = " + hr);
		sec -= (hr * 60 * 60) ;
		var min = Math.floor(sec / 60 );
		sec -= (min * 60) ;
		var nsec = Math.floor(sec );
		var sec = sec - nsec;
	        var frm = Math.floor(scope.current.fps * sec);
		var str = hr.toString() + ":";
		if (min < 10) str += "0";
		str += min.toString() + ":";
		if (nsec < 10) str += "0";
		str += nsec.toString() + ":";
		if (frm < 10) str += "0";
		str += frm.toString();
	
		return(str);
/*OLD
	

		var frm = Math.floor((sec - Math.floor(sec)) * scope.current.fps);
		var hr = Math.floor(sec / 60 / 60);
		   console.log("Timecode filter");

		sec -= (hr * 60 * 60);
		var min = Math.floor(sec  / 60);
		var nsec = Math.floor(sec - (min * 60));
		var str = hr.toString() + ":";
		if (min < 10) str += "0";
		str += min.toString() + ":";
		if (nsec < 10) str += "0";
		str += nsec.toString();
		str += ":";
		if (frm < 10) str += "0";
		str += frm.toString();
		//str += " " + scope.videoFPS;
		return (str);
*/
	    }

	});


