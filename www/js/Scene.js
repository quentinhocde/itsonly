'use strict';

let createAnalyser = require('web-audio-analyser'); //hughsk 
let average = require('analyser-frequency-average'); //Jam3

import { frequencyAverages } from './audio-utils'


let start = Date.now();


class Scene {
	init(){

		let self = this;

		this.scene = new THREE.Scene();
		this.scene.rotation.y = Math.PI/4;
		this.camera();
		
		this.light();

		this.initShapes();

		this.events();		
	}

	camera(){
		this.camera = new THREE.PerspectiveCamera( 45 , window.innerWidth / window.innerHeight, 1, 5000 );
		this.camera.position.y = 500;
		this.camera.position.z = 500;
		this.camera.position.x = 500;
		this.camera.updateProjectionMatrix();
		this.camera.lookAt(this.scene.position);
	}

	renderer(){
		this.renderer = new THREE.WebGLRenderer({antialias: true});
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.renderer.setClearColor( 0xefefef , 1 );
		this.renderer.shadowMapEnabled = true;
		this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
		this.renderer.domElement.className = "c-exp";


		this.controls = new THREE.TrackballControls( this.camera );
		this.controls.maxDistance = 1000;
		this.controls.minDistance = 100;
		this.controls.dynamicDampingFactor = .15;

		this.controls.addEventListener('change', this.render);

		document.body.appendChild(this.renderer.domElement);


		// Init Wagner (by Spite)
		this.composer = new WAGNER.Composer( this.renderer );
		this.composer.setSize( window.innerWidth, window.innerHeight ); // or whatever resolution

		this.multiPassBloomPass = new WAGNER.MultiPassBloomPass();
		this.multiPassBloomPass.params.blurAmount = 0.2;

		this.vignettePass = new WAGNER.VignettePass();
		this.vignettePass.params.amount = 0.5;

		this.renderer.autoClearColor = true;
		this.composer.toScreen();


	}

	light(){

		this.shadowlight = new THREE.DirectionalLight( 0xffffff, 0 );
		this.shadowlight.position.set( -500, 500, 0 );
		this.shadowlight.castShadow = true;
		this.shadowlight.shadowDarkness = 0.1;
		this.scene.add(this.shadowlight);

		this.light = new THREE.DirectionalLight( 0xffffff, 1 );
		this.light.position.set( -200, 200, 200 );
		this.scene.add(this.light);
	  
	  	this.backLight = new THREE.DirectionalLight( 0xffffff, 1 );
		this.backLight.position.set( 20, 0, 20 );
		this.scene.add(this.backLight);

		this.tl = new TimelineMax({repeat:-1});
		this.tl.to(this.shadowlight.position,20,{
			x: 500
		});
		this.tl.to(this.shadowlight.position,20,{
			x: -500
		});

	}

	floor() {
	 	let geometry = new THREE.PlaneGeometry( 10000, 10000, 1, 1 );
		let material = new THREE.MeshBasicMaterial( { color: 0xefefef } );
		this.floor = new THREE.Mesh( geometry, material );
		this.floor.material.side = THREE.DoubleSide;
		this.floor.position.y = -200;

		this.floor.rotation.x = 90*Math.PI/180;
		this.floor.rotation.y = 0;
		this.floor.rotation.z = 0;
		this.floor.doubleSided = true;
	    this.floor.receiveShadow = true;
		this.scene.add(this.floor);

	}

	initShapes(){

		// Init Geomeotry  
		this.geometry = new THREE.IcosahedronGeometry( 100, 6);
		this.tinySphere = new THREE.SphereGeometry( 5, 5, 5 );
		this.hugeSphere = new THREE.IcosahedronGeometry( 400, 1);
		this.middleSphere = new THREE.IcosahedronGeometry( 200, 2);
		this.iconoSphereGeometry = new THREE.IcosahedronGeometry( 250, 0);


		// Init Materials

		this.basicMaterial = new THREE.MeshBasicMaterial({color : 0x000000, shading: THREE.FlatShading});
		this.wireframeMaterial = new THREE.MeshBasicMaterial({color : 0x626262, shading: THREE.FlatShading, wireframe: true, wireframeLinewidth: 1});

		// Shader material
		this.shaderMaterial = new THREE.ShaderMaterial( {

		    uniforms: { 
		        tShine: { 
		            type: 't', 
		            value: THREE.ImageUtils.loadTexture( '../images/degrade.jpg' ) 
		        },
		        time: { type: "f", value: 0 },
		        weight: { type: "f", value: 0 }
		    },
		    vertexShader: document.getElementById( 'vs' ).textContent,
		    fragmentShader: document.getElementById( 'fs' ).textContent,
		    shading: THREE.SmoothShading
		    
		} );

		this.shaderMaterial.uniforms.tShine.value.wrapS = 
		this.shaderMaterial.uniforms.tShine.value.wrapT = 
		THREE.ClampToEdgeWrapping;


		// Init Mesh
	 	this.shaderShape = new THREE.Mesh(this.geometry, this.shaderMaterial);
		this.iconoSphere = new THREE.Mesh(this.iconoSphereGeometry, this.wireframeMaterial);

		
		this.middleSpheresArray = new THREE.Group();
		this.verticesMiddleSphere = this.middleSphere.vertices;

		this.hugeSpheresArray = new THREE.Group();
		this.verticesHugeSphere = this.hugeSphere.vertices;

		for (var i = 0; i < this.verticesMiddleSphere.length - 1; i++) {
			this.sphere = new THREE.Mesh(this.tinySphere, this.basicMaterial);
			this.sphere.position.x = this.verticesMiddleSphere[i].x;
			this.sphere.position.y = this.verticesMiddleSphere[i].y;
			this.sphere.position.z = this.verticesMiddleSphere[i].z;
			this.middleSpheresArray.add(this.sphere);
		}

		for (var i = 0; i < this.verticesHugeSphere.length - 1; i++) {
			this.sphere = new THREE.Mesh(this.tinySphere, this.basicMaterial);
			this.sphere.position.x = this.verticesHugeSphere[i].x;
			this.sphere.position.y = this.verticesHugeSphere[i].y;
			this.sphere.position.z = this.verticesHugeSphere[i].z;
			this.hugeSpheresArray.add(this.sphere);
		}


		//Init TimelineMax just for global rotation

		this.tlSpheres = new TimelineMax({repeat : -1});
		this.tlSpheres.to(this.middleSpheresArray.rotation,100,{
			y : - 2 * Math.PI,
			z : - 2 * Math.PI,
			ease: Power0.easeNone
		});

		this.tlHugeSpheres = new TimelineMax({repeat : -1});
		this.tlHugeSpheres.to(this.hugeSpheresArray.rotation,100,{
			y : 2 * Math.PI,
			z : 2 * Math.PI,
			ease: Power0.easeNone
		});

		

		this.tlIconoSphere = new TimelineMax({repeat : -1});
		this.tlIconoSphere.to(this.iconoSphere.rotation,200,{
			x : 2 * Math.PI,
			z : 2 * Math.PI,
			ease: Power0.easeNone
		});



		// Add all meshs to to the scene

		this.scene.add(this.iconoSphere);
		this.scene.add(this.middleSpheresArray);
		this.scene.add(this.hugeSpheresArray);

    	this.scene.add(this.shaderShape);
    	this.scene.add(this.sphere);	

	}

	audio(urlSoundcloud){

		let self = this;

		let url;
		if(urlSoundcloud != null){
			url = urlSoundcloud;
		}else{
			url = 'https://soundcloud.com/odesza/its-only'
		}
		
		this.soundcloud = require('soundcloud-badge')({
			client_id: 'a709052797c1b5999fe7ef4c88722dd9',
			song: url,
			dark: true,
			getFonts: false
		}, function(err, src, data, div) {
		  if (err) throw err

		  	// Play the song on
		  	// a modern browser
		  	console.log(src);

		  	self.player = new Audio();
			self.player.crossOrigin = 'Anonymous'
		  	self.player.src = src;

			// Set up our AnalyserNode utility
			self.analyser = createAnalyser(self.player, {
				stereo: false
			});

			self.player.play();	

			self.analyserNode = self.analyser.analyser;
			let sampleRate = self.analyser.ctx.sampleRate;
			let fftSize = self.analyserNode.fftSize;

			self.getAverage = frequencyAverages(sampleRate, fftSize)

			self.renderer();
			self.render();

			document.getElementsByTagName('body')[0].classList.add('is-launched');

		});

		console.log(this.player);



	}

	render(){

		try{
			// grab our byte frequency data for this frame
		    this.freqs = this.analyser.frequencies()

		    // Get different range of frequencies
		    this.bass = this.getAverage(this.freqs, 40, 200);
		    this.midBass = this.getAverage(this.freqs, 200, 600);
		    this.voice = this.getAverage(this.freqs, 600, 2000 );
		    this.drum = this.getAverage(this.freqs, 2000, 16000 );

		    // Animation
		    for (var i = 0; i < this.middleSpheresArray.children.length - 1; i++) {
		    	this.middleSpheresArray.children[i].scale.y = 1.3 - ( 3*Math.exp(this.bass)/8);
		    	this.middleSpheresArray.children[i].scale.x = 1.3 - ( 3*Math.exp(this.bass)/8);
		    	this.middleSpheresArray.children[i].scale.z = 1.3 - ( 3*Math.exp(this.bass)/8);
		    }

		    for (var i = 0; i < this.hugeSpheresArray.children.length - 1; i++) {
		    	this.hugeSpheresArray.children[i].scale.y = 1.3 - ( 4*Math.exp(this.bass)/10);
		    	this.hugeSpheresArray.children[i].scale.x = 1.3 - ( 4*Math.exp(this.bass)/10);
		    	this.hugeSpheresArray.children[i].scale.z = 1.3 - ( 4*Math.exp(this.bass)/10);
		    }
		    
		    this.middleSpheresArray.scale.y = 1 - ( Math.exp(this.bass)/10) ;
		    this.middleSpheresArray.scale.x = 1 - ( Math.exp(this.bass)/10) ;
		    this.middleSpheresArray.scale.z = 1 - ( Math.exp(this.bass)/10) ;

		    this.hugeSpheresArray.scale.y = 1 + ( Math.exp(this.midBass)/15) ;
		    this.hugeSpheresArray.scale.x = 1 + ( Math.exp(this.midBass)/15) ;
		    this.hugeSpheresArray.scale.z = 1 + ( Math.exp(this.midBass)/15) ;

		    this.iconoSphere.scale.x = 1 + (this.drum);
		    this.iconoSphere.scale.y = 1 + (this.drum);
		    this.iconoSphere.scale.z = 1 + (this.drum);

		    // Shader animation
		    this.shaderMaterial.uniforms[ 'time' ].value = .00025 * ( Date.now() - start );
		    this.shaderMaterial.uniforms[ 'weight' ].value = ( Math.exp(this.voice * 5)/4);

		    // Rerender wagner pass
		    this.composer.reset();
			this.composer.render( this.scene, this.camera );
			this.composer.pass( this.multiPassBloomPass );
			this.composer.pass(this.vignettePass);
			this.composer.toScreen();


			// Update orbit control
			this.controls.update();

		    requestAnimationFrame(this.render.bind(this));
	    }
	    catch(e){

	    }
	}

	events(){
		let self = this;
		document.getElementById('submit-button').addEventListener('click', function(e) {
			e.preventDefault();

		    var value = document.getElementById('input-url').value;
		    self.audio(value);
		});

		document.getElementById('submit-demo').addEventListener('click', function(e) {
		    self.audio(null);
		});
	}
	
}


export default Scene;



