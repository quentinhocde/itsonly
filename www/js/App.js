'use strict';
import Utils from "./Utils";
import Scene from "./Scene";

var utils = new Utils();
var raf = Utils.Raf();

var scene = new Scene();

class App {
	init(){
		scene.init();
	}
}


var app = new App();


window.onload=app.init();
