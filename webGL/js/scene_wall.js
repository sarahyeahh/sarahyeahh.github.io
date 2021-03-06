
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

			// Variabler
			var max_of_glitter = 5000;
			var glitter = [];
			var time = 0;
			var radius = 10;
			var container;
			var camera, controls, scene, renderer;
			var sky, sunSphere, sphere;
			var distance = 400000;
	
			init();
			render();

			function initSky() {
				// Add Sky Mesh
				sky = new THREE.Sky();
				scene.add( sky.mesh);

				// Add sphere for sun
				sunSphere = new THREE.Mesh(
					new THREE.SphereBufferGeometry( 20000, 16, 8 ),
					new THREE.MeshBasicMaterial( { color: 0xffffff } )
					);

				// add sun to scene
				sunSphere.position.y = - 700000;
				sunSphere.visible = false;
				scene.add( sunSphere );
				// change sunlight
				var uniforms = sky.uniforms;
				uniforms.turbidity.value = 10;
				uniforms.reileigh.value = 5;
				uniforms.luminance.value = 1;
				uniforms.mieCoefficient.value = 0.005;
				uniforms.mieDirectionalG.value = 0.8;
				var theta = Math.PI * ( 0.49 - 0.5 );
				var phi = 2 * Math.PI * ( 0.25 - 0.5 );

				sunSphere.position.x = distance * Math.cos( phi );
				sunSphere.position.y = distance * Math.sin( phi ) * Math.sin( theta );
				sunSphere.position.z = distance * Math.sin( phi ) * Math.cos( theta );
				sunSphere.visible = ! true;

				sky.uniforms.sunPosition.value.copy( sunSphere.position );
			}

			function init() {
			// Add scene
			camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 100, 2000000 );
			camera.position.set( 0, 0, 130);
			scene = new THREE.Scene();
			renderer = new THREE.WebGLRenderer();
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( window.innerWidth, window.innerHeight );
			document.body.appendChild( renderer.domElement );

			initSky();

				//add light
	 			var light = new THREE.SpotLight(0xFFFFFF, 1, 1000); //Vitt ljus och intensitet (jättestarkt!).
	 			light.position.copy(camera.position);
	 			scene.add(light);
	 			light.castShadow = true;
	 			light.shadowDarkness = 0.7;
	 			renderer.render( scene, camera );

				//Ambient ljus
				var lightamb = new THREE.AmbientLight( 0xFFFFFF, 2, 1000 ); // soft white light
				scene.add( lightamb ); 

				var texture = THREE.ImageUtils.loadTexture('texture/green_2.jpg');
				var material = new THREE.MeshPhongMaterial({
				    ambient: 0x404040,
				    map: texture,
				    specular: 0x000000,
				    shininess: 30,
				    shading: THREE.SmoothShading,
				});
				var geometry = new THREE.PlaneGeometry( 20, 40, 32 );
				var plane = new THREE.Mesh( geometry, material );
				scene.add(plane);

				// Add controls
				controls = new THREE.OrbitControls( camera, renderer.domElement );
				controls.addEventListener( 'change', render );
				controls.enableZoom = true;
				controls.enablePan = true;
				window.addEventListener( 'resize', onWindowResize, false );	

				//Add Texture
				var loader = new THREE.TextureLoader();
				var tex = loader.load('texture/goldglitter2.jpg');
				var mat = new THREE.MeshPhongMaterial({color: 0xFFFF00, map:tex, specular: 0xFFFF00, shininess: 30, shading: THREE.FlatShading, emissiveIntensity: 1});
				var geo = new THREE.BoxGeometry( 1.25, 0.1, 1.25);

				// Create boxes and push into a array
				for (var i = 0; i < max_of_glitter; i++) {
 				    var box = {};

 				    box.obj = new THREE.Mesh( geo, mat);
 				   	// start conditions pos
 				   	box.x = Math.floor((Math.random() * 300) - 150);
 				   	box.y = 140;
 				   	box.z = Math.floor((Math.random() * 300) - 150);
 				    // start conditions veolcity
 				    box.dx = 0;
 				    box.dy = Math.random();
 				    box.dz = 0;

 				    box.rotation = Math.random();
 				    box.fall = true;
 				    box.obj.position.set( box.x, box.y, box.z);
 				    scene.add(box.obj);
 				    // add shadow
 				    box.obj.castShadow = true;
 				    box.obj.recieveShadow = true;
 				    glitter.push(box);
 				};
 			}
 			

			// update per frame
			function update_scene () {
				update_pos();
				renderer.render(scene, camera); // render the scene
				window.requestAnimationFrame(update_scene, renderer.domElement);
			}

			update_scene();

			var update = 0;
			function update_pos () {
				for (var i = 0; i < max_of_glitter; i++) {
					//update positions
					glitter[i].x = glitter[i].x  + glitter[i].dx;  
					glitter[i].y = glitter[i].y  + glitter[i].dy;
					glitter[i].z = glitter[i].z  + glitter[i].dz;

					check_floor(glitter[i]);
					add_wind(glitter[i]);
					check_wall(glitter[i]);

					update +=0.0004;
					if(glitter[i].y > -49 && glitter[i].fall == true){
						glitter[i].dy =  glitter[i].dy - 9.82/2000; // add gravity
						glitter[i].obj.rotation.set(glitter[i].rotation * update, 1, 1); // Set initial rotation
						glitter[i].obj.matrix.makeRotationFromEuler(glitter[i].obj.rotation); // Apply rotation to the object's matrix
					}
					else {
						glitter[i].obj.rotation.set(0,0,0);
						glitter[i].obj.matrix.makeRotationFromEuler(glitter[i].obj.rotation);
					}	
					glitter[i].obj.position.set(glitter[i].x , glitter[i].y , glitter[i].z);
				}; 
			}

			function check_floor (box) {
				if(box.y <= -200)
				{
					box.y = -200;
				 	box.dx = 0;
				 	box.dz = 0;
				}
			}
				function add_wind (box) {
				if(box.y >20 && box.y <40)
				{
					box.dz = -2;
				}
			}

				function check_wall (box, i) { 
				var friction = 0.1;

 			     	if(check_collision(box) == true)
 			     	{
 			     		//hasteghetsvektorn för glitter
 			     		var v = new THREE.Vector3( box.dx, box.dy, box.dz );
 			     		//positionsvektorn för glitter
 			     		var pos = new THREE.Vector3( box.x, box.y, box.z);

 			     		//längden av hastighetsvektorn
 			     		var l = v.length();
 			     		l *= friction;

 			     		//Normaliserar båda vektorerna
 			     		v.normalize();
			     		pos.normalize();

			     		//projicerar hastighetsvektorn på positions vektorn
			     		var projPos= v.projectOnVector(pos);
			  
			     		//Skapar en ny vektor som är positionerna av den projicerade vektorn
			     		var posNew = new THREE.Vector3(projPos.x, projPos.y, projPos.z);

			     		//sätter den nya poitions vektorn till samma längd som hastighets vektorn
			     		posNew.setLength(l);
			     		
			     		box.rotation = 0;

			     		box.fall = false;

			     		//box.dx = 1;//posNew.x;
			     		//box.dy = posNew.y*9;
			     		//box.dz = 1;//posNew.z;

			     		box.dx = 0;
			     		box.dy = 0;
			     		box.dz = 0;

			     		box.x += pos.x;
			     		box.y += pos.y;
			     		box.z += pos.z;
 			     	}
			}

			     function check_collision(glitter)
			     {
			     	var distance = new THREE.Vector3( glitter.x, glitter.y, glitter.z );

			     	if(glitter.y < 20 && glitter.y > -20 && glitter.x < 10 && glitter.x > -10 && glitter.z < 2 && glitter.z > -2){
		    		//console.log(distance.length());
		    		console.log("hej");
		    		return true;
		    	}
		    	else
		    		return false;
		    }



		    function onWindowResize() {
		    	camera.aspect = window.innerWidth / window.innerHeight;
		    	camera.updateProjectionMatrix();
		    	renderer.setSize( window.innerWidth, window.innerHeight );
		    	render();
		    }

		    function render() {
		    	renderer.render( scene, camera );
		    }