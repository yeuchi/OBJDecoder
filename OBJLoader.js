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
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

var OBJLoader = function() {
}
  
OBJLoader.prototype.load = function(url, callback) {
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

// consume local file:     http://www.html5rocks.com/en/tutorials/file/dndfiles/
OBJLoader.prototype.local = function(evt, callback) {
    var files = evt.target.files; // FileList object

    var f = files[0];
    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function(theFile) {
      //return function(e) {
	
	var result = theFile.target.result;		// my raw file data
	var name = theFile.name;
	return callback(new OBJ(result));
      //};
    });

    // Read in the image file as a data URL.
    reader.readAsText(f);
}