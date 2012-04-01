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
			xhr.responseType = "arraybuffer";
			xhr.onload = __bind(function() {
				var data = new Uint8Array(xhr.response || xhr.mozResponseArrayBuffer);
				return callback(new OBJ(data));
			}, this);
			return xhr.send(null);
		};
		
		function OBJ(data) {
			this.NUM_VERTEX = 118;
			this.NUM_FACE = 102;
		
			this.data = data;
			this.list_v = new Array();
			this.list_f = new Array();
		}
		
		// return true/false for finding/loading vertex
		OBJ.prototype.readVertex = function(index) {
			var VERTEX_TYPE_LEN = 2;
			var sttPos = this.list_v[index];
			var endPos = this.findEndPos(sttPos);		// return EOF pos if not found
			var vString = this.bin2String(sttPos+VERTEX_TYPE_LEN, endPos);
			var list = vString.split(" ");
			
			if(list.length!=3&&list.length!=4)
				return null;							// invalid vertex
				
			var vertex = new Array();
			for(var i=0; i<list.length; i++) 
				vertex.push(Number(list[i]));
				
			return vertex;
		};
		
		OBJ.prototype.readFace = function(index) {
			var FACE_TYPE_LEN = 2;
			var sttPos = this.list_f[index];
			var endPos = this.findEndPos(sttPos);
			var vString = this.bin2String(sttPos+FACE_TYPE_LEN, endPos);
			var face = vString.split(" ");
			return face;
		};

		OBJ.prototype.bin2String = function(sttPos, endPos) {
			var buf="";
			for(var i=sttPos; i<endPos; i++) {
				var char = this.data[i].toString();
				buf += String.fromCharCode(char);
			}
			return buf;
		};
		
		// return upon first non number, non dot, not space
		OBJ.prototype.findEndPos = function(stt) {
			var i = stt;
			while(i<(this.data.length-1)) {
				// seek linefeed
				if(this.data[i]==10)
					return i;
				i++;
			}			
			return this.data.length-1;
		};
		
		OBJ.prototype.getVertexIndex = function(str) {
			var pos = str.indexOf("/");
			var numStr = str;
			
			if(pos>0)
				numStr = str.substr(0, pos);
			
			var num = Number(numStr);
			return num;
		}
		
		OBJ.prototype.drawTriangles = function(face,
							context,		// [in] canvas context 
							w, 			// [in] canvas width
							h, 			// [in] canvas height
							mag,			// [in] magnification
							rX,			// [in] amount of rotation X
							rY,			// [in] amount of rotation Y
							rZ){			// [in] amount of rotation Z
			var offX = w/2;
			var offY = h/2
			context.beginPath();
			
			// convert rotation from degrees to radian
			var radX = PI / 180.0 * rX;
			var radY = PI / 180.0 * rY;
			var radZ = PI / 180.0 * rZ;	
						
			var vtx0 = [0,0,0];
			var vtx1;
			if(face.length<3)										// must be at least a triangle
				return false;
			
			// draw 
			for(j=0; j<face.length; j++) {  
				// retrieve vertices
				var vIndex = this.getVertexIndex(face[j])-1;
				if(vIndex>=this.list_v.length||vIndex<0)
					return false;
				
				// retrieve vertex
				var vtx1 = this.readVertex(vIndex);
			
				//vtx1[0] = vtx1[0];
				var y = vtx1[1];
				var z = vtx1[2];
				vtx1[1] = Math.cos(radX)*y-Math.sin(radX)*z;
				vtx1[2] = Math.sin(radX)*y+Math.cos(radX)*z
				
				var x = vtx1[0];
				z = vtx1[2];
				vtx1[0] = Math.cos(radY)*x+Math.sin(radY)*z;
				//vtx1[1] = vtx1[1];
				vtx1[2] = -Math.sin(radY)*x+Math.cos(radY)*z;
				
				// draw 2 lengths of a triangle
				if(j==0) {
					context.moveTo(vtx1[0]*mag+ offX, 
						       vtx1[1]*mag+ offY);				// move to 1st triangle corner
					vtx0[0] = vtx1[0];
					vtx0[1] = vtx1[1];
					vtx0[2] = vtx1[2];
				}
				else 
					context.lineTo(vtx1[0]*mag+ offX, 
						       vtx1[1]*mag+ offY);				// render only (x,y)
			} 
			// complete triangle
			context.lineTo(vtx0[0]*mag+ offX, 
				       vtx0[1]*mag+ offY);						// complete triangle
			
			// render on canvase
			context.stroke();
			context.closePath();
			return true;
		};
		
		OBJ.prototype.getLineType = function(sttPos, endPos) {
			var str = "";
			for(var i=sttPos; i<endPos; i++) {
				var char = String.fromCharCode(this.data[i]);	
				if(char==' ')
					return str;
				else
					str += char;
			}
		};
		
		OBJ.prototype.categorize = function() {
			this.pos = 0;								// begin of a line
			this.list_v = new Array();
			this.list_vt = new Array();
			this.list_vn = new Array();
			this.list_f = new Array();
			this.list_s = new Array();
			// parse entire file info.
			while(this.pos < this.data.length-1) {
				var endPos = this.findEndPos(this.pos);
				var type = this.getLineType(this.pos, endPos);
				
				switch(type) {
					case "v":
					this.list_v.push(this.pos);
					break;
					
					case "vt":
					this.list_vt.push(this.pos);
					break;
					
					case "vn":
					this.list_vn.push(this.pos);
					break;
					
					case "f":
					this.list_f.push(this.pos);
					break;
					
					case "s":
					this.list_s.push(this.pos);
					break;
					
					default:
				}
				this.pos = ++endPos;
			}			
			return this.list_f.length;
		};
		
		OBJ.prototype.drawWireFrame = function(context,		// [in] canvas context 
											   w, 			// [in] canvas width
											   h, 			// [in] canvas height
											   mag,			// [in] magnification
											   rX,
											   rY,
											   rZ) {
			this.pos = 0;
			for(var i=0; i<this.list_f.length; i++) {
				var face = this.readFace(i);
				
				if(!this.drawTriangles(face, context, w, h, mag, rX, rY, rZ))
					return -1;
			}
			return this.list_f.length;
		};
		
		return OBJ;
	})();
	
	window.OBJ = OBJ;
}).call(this);
// JavaScript Document