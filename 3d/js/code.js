var scene = null;

function init()
{
	//create the rendering context
	var context = GL.create({width: window.innerWidth, height:window.innerHeight});
	var renderer = new RD.Renderer(context);
	document.body.appendChild(renderer.canvas); //attach

	//create a scene
	scene = new RD.Scene();

	//get shaders from a single text file	
	renderer.loadShaders("shaders.txt");

	//folder where stuff will be loaded	(textures, meshes, shaders )
	renderer.setDataFolder("data");
	renderer.default_texture_settings.magFilter = gl.NEAREST;
	renderer.default_texture_settings.minFilter = gl.NEAREST_MIPMAP_NEAREST;

	//create camera
	var camera = new RD.Camera();
	camera.perspective( 45, gl.canvas.width / gl.canvas.height, 1, 1000 );
	camera.lookAt( [0,20,100],[0,20,0],[0,1,0] );
	
	//global settings
	var bg_color = vec4.fromValues(0.1,0.1,0.1,1);

	//var skybox = new RD.Skybox({texture: "blursky_CUBEMAP.png" }); //warning: name must contain "CUBEMAP"!
	//scene.root.addChild( skybox );

	//add some objects to the scene
	var knight = new RD.SceneNode({
		position: [-40,0,0],
		scaling: 1,
		color: [1,1,1,1],
		mesh: "knight.obj",
		texture: "knight.png",
		shader: "phong_texture"
	});
	scene.root.addChild( knight );

	var floor = new RD.SceneNode({
		position: [0,0,0],
		scaling: [25,25,25],
		color: [1,1,1,1],
		mesh: "fondo.obj",
		texture: "fondo-pixelart.png",
		tiling: 1,
		shader: "phong_texture"
	});
	scene.root.addChild( floor );

	var sprite = new RD.Sprite({
		position: [0,0,0],
		size: [16,32],
		sprite_pivot: RD.BOTTOM_CENTER,
		texture: "javi-spritesheet.png",
		frame: 0
	});
	sprite.flags.pixelated = true;
	sprite.createFrames([16,4]);
	scene.root.addChild( sprite );


	// main loop ***********************
	
	//main draw function
	context.ondraw = function(){
		//clear
		renderer.clear(bg_color);
		//render scene
		renderer.render(scene, camera);
	}


	var walking = [2,3,4,5,6,7,8,9];

	//main update
	context.onupdate = function(dt)
	{
		scene.update(dt);

		var now = getTime() * 0.001;
		sprite.frame = walking[ Math.floor(now*15) % walking.length ];
	}

	//user input ***********************

	//detect clicks
	context.onmouseup = function(e)
	{
		if(e.click_time < 200) //fast click
		{
			//compute collision with floor plane
			var ray = camera.getRay(e.canvasx, e.canvasy);
			if( ray.testPlane( RD.ZERO, RD.UP ) ) //collision
			{
				sprite.position = ray.collision_point;
			}
		}
	}
	
	context.onmousemove = function(e)
	{
		if(e.dragging)
		{
			//orbit camera around
			//camera.orbit( e.deltax * -0.01, RD.UP );
			//camera.position = vec3.scaleAndAdd( camera.position, camera.position, RD.UP, e.deltay );
			camera.moveLocal([-e.deltax*0.1, e.deltay*0.1,0]);
		}
	}
	
	context.onmousewheel = function(e)
	{
		//move camera forward
		camera.moveLocal([0,0,e.wheel < 0 ? 10 : -10] );
	}
	
	//capture mouse events
	context.captureMouse(true);

	//launch loop
	context.animate(); 

}

/* example of computing movement vector
	var delta = vec3.sub( vec3.create(), target, sprite.position );
	vec3.normalize(delta,delta);
	vec3.scaleAndAdd( sprite.position, sprite.position, delta, dt * 50 );
	sprite.updateMatrices();
	sprite.flags.flipX = delta[0] < 0;
*/