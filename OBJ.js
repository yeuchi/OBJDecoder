(function() {
  /*
  #	Module:			OBJ.js
  #	
  #	Description:	decode OBJ 3D file
  #					modified Devon Govett's bmp.js
  #
  #	Reference:
  # 	BMP.js		http://devongovett.github.com/bmp.js/
  #		OBJ specs	http://www.martinreddy.net/gfx/3d/OBJ.spec
  #		article		http://paulbourke.net/dataformats/obj/
  #		samples		http://people.sc.fsu.edu/~jburkardt/data/obj/obj.html
  #      
  # Author(s):		Devon Govett provide a bmp decoding example.
  # 				C.T. Yeung modify to decode OBJ.
  #  
  # History:		
  # 21Jan12			able to decode vertices and face data... but not rendering correctly... buggy
  #	22Jan12			able to render monkey_vtn.obj.  decode only vertices and face info.	
  #					able to render the same capability as STL file decoder... next to look at texture, curves, etc.
  #
  # MIT LICENSE
  # Copyright (c) 2012 CT Yeung
  # Copyright (c) 2011 Devon Govett
  # 
  # Permission is hereby granted, free of charge, to any person obtaining a copy of this 
  # software and associated documentation files (the "Software"), to deal in the Software 
  # without restriction, including without limitation the rights to use, copy, modify, merge, 
  # publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons 
  # to whom the Software is furnished to do so, subject to the following conditions:
  # 
  # The above copyright notice and this permission notice shall be included in all copies or 
  # substantial portions of the Software.
  # 
  # THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING 
  # BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
  # NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
  # DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
  # OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  */  
  
  var OBJ;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  var PI = 3.14159265;
	
	OBJ = (function() {
		OBJ.load = function(url, callback) {
			var xhr;
			xhr = new XMLHttpRequest;
			xhr.open("GET", url, true);
			xhr.responseType = "text";
			xhr.onload = __bind(function() {
				var data = (xhr.responseText);
				return callback(new OBJ(data));
			}, this);
			return xhr.send(null);
		};
		
		function OBJ(data) {
		  this.data = data.split('\n');
	
		  this.list_v = new Array();
		  this.list_f = new Array();
		}
		
		OBJ.prototype.decode = function() {
		  this.listVertex = [];
		  this.list_vt = [];
		  this.list_vn = [];
		  this.listFace = [];
		  this.list_s = [];
		  
		  // parse entire file info.
		  for( var i=0; i<this.data.length; i++) 
		    this.parseLine(i);
					  
		  return this.listFace.length;
		};
		
		OBJ.prototype.parseLine = function(i) {
		  var list = this.data[i].replace("\r", "");
		  list = list.split(" ");
		  var type = list[0];
		  
		  switch(type){
		    case "v":
		      var v = [	parseFloat(list[1]),
				parseFloat(list[2]),
				parseFloat(list[3])];
		      if(list.length==5)
			v.push(parseFloat(list[4]));
		      this.listVertex.push(v);
		    break;
		    
		    case "vt":
		      var vt = [parseFloat(list[1]),
				parseFloat(list[2]),
				parseFloat(list[3])];
		      this.list_vt.push(vt);
		    break;
		    
		    case "vn":
		      var vn = [parseFloat(list[1]),
				parseFloat(list[2]),
				parseFloat(list[3])];
		    this.list_vn.push(vn);
		    break;
		  
		    case "vp":
		      var vp = [parseFloat(list[1]),
				parseFloat(list[2])];
		      if(list.length==4)
			v.push(parseFloat(list[3]));
		      this.list_vp.push(vp);
		    break;
		    
		    case "f":
		      var face = [list.length];
		      for(var j=1; j<list.length; j++)
			face.push(parseInt(list[j])-1);
		    this.listFace.push(face);
		    break;
		    
		    case "s":
		    this.list_s.push(list);
		    break;
		    
		    default:
		  }			
		};
		
		return OBJ;
	})();
	
	window.OBJ = OBJ;
}).call(this);
// JavaScript Document