//Player class, responsible for movement, shooting, health etc
"use strict"


function Player(game, properties)
{
	GameObject.call(this, game, properties);
	
	//Ready for input
	this.SetupInput();

	//Position
	this.LoadVectorProperty("position");
	this.startingPosition = vec3.clone(this.position);
	
	//Direction
	this.LoadProperty("yaw", 0);
	this.LoadProperty("pitch", 0);
	
	//Offset from player position to camera position
	this.cameraOffset = vec3.fromValues(0, 1.1, 0);
	
	//The angle of the sine wave to set the yaw to
	this.suspendedYawChangeAngle = 0.0;

	//Set up collisions
	this.physics = new PhysicsObject(new Sphere(this.position, 0.5));
	game.physics.AddPhysicsObject(this.physics);

	//TODO: Move me to a different object
	this.floor = new PhysicsObject(new Plane(vec3.fromValues(0, 1, 0), 0));
	game.physics.AddPhysicsObject(this.floor);

	//Initial mouse position
	this.mousePosition = undefined;
	this.previousMousePosition = undefined;

	//Register mouse move event
	//TODO: Move to input
	//$("body").mousemove(this.OnMouseMove.bind(this));
	/*game.window.bind("touchmove", this.OnTouchMove.bind(this));
	$("body").bind("touchbegin", this.OnTouchBegin.bind(this));
	$("body").bind("touchend", this.OnTouchEnd.bind(this));*/
};

Player.prototype = Object.create(GameObject.prototype);
Player.prototype.constructor = Player;


//Bind events and set up input actions
Player.prototype.SetupInput = function()
{
	//Define inputs
	var KeyW = [119, 87];
	var KeyA = [97, 65];
	var KeyS = [115, 83];
	var KeyD = [100, 68];
	var KeyLeft = [37];
	var KeyUp = [38];
	var KeyRight = [39];
	var KeyDown = [40];
	var KeySpace = [32];
	var KeyEscape = [27];
	
	//Bind keys
	this.game.input.BindKeys(KeyW, "Forward");
	this.game.input.BindKeys(KeyA, "Left");
	this.game.input.BindKeys(KeyS, "Backward");
	this.game.input.BindKeys(KeyD, "Right");
	this.game.input.BindKeys(KeySpace, "Jump");
	this.game.input.BindKeys(KeyLeft, "LookLeft");
	this.game.input.BindKeys(KeyRight, "LookRight");
	this.game.input.BindKeys(KeyUp, "LookUp");
	this.game.input.BindKeys(KeyDown, "LookDown");
	this.game.input.BindKeys(KeyEscape, "Menu");
	
	//Register buttons
	this.game.input.BindElement($("#jumpButton"), "Jump");
	this.game.input.BindElement($("#forwardButton"), "Forward");
	this.game.input.BindElement($("#backwardButton"), "Backward");
	this.game.input.BindElement($("#leftButton"), "Left");
	this.game.input.BindElement($("#rightButton"), "Right");
}


//TODO: Consider registering and deregistering this event based on mouse up/down. (And maybe hide the cursor)
Player.prototype.OnMouseMove = function(event)
{
	if(this.mousePosition == undefined)
	{
		//Store initial value
		this.mousePosition = vec2.fromValues(event.clientX, event.clientY);
		this.previousMousePosition = vec2.clone(this.mousePosition);
	}
	else
	{
		//Store subsequent values
		this.previousMousePosition = vec2.clone(this.mousePosition);
		this.mousePosition = vec2.fromValues(event.clientX, event.clientY);
	}

	//Mouse must be held
	if(event.which == 1)
	{
		//TODO: Extract this to a preferences window?
		var mouseSensitivity = 0.002;
		this.yaw += mouseSensitivity * (this.mousePosition[0] - this.previousMousePosition[0]);
		this.pitch -= mouseSensitivity * (this.mousePosition[1] - this.previousMousePosition[1]);
	}
	
	if(!this.game.suspended)
	{
		event.preventDefault();
	}
}


Player.prototype.OnTouchBegin = function(event)
{
	this.touchPosition = undefined;
	
	if(!this.game.suspended)
	{
		event.preventDefault();
	}
}



Player.prototype.OnTouchEnd = function(event)
{
	this.touchPosition = undefined;
	
	if(!this.game.suspended)
	{
		event.preventDefault();
	}
}

Player.prototype.OnTouchMove = function(event)
{
	//alert(JSON.stringify(event.touches[0]));
	var touch = event.touches.item(0);
	if(this.touchPosition == undefined)
	{
		//Store initial value
		this.touchPosition = vec2.fromValues(touch.clientX, touch.clientY);
		this.previousTouchPosition = vec2.clone(this.touchPosition);
	}
	else
	{
		//Store subsequent values
		this.previousTouchPosition = vec2.clone(this.touchPosition);
		this.touchPosition = vec2.fromValues(touch.clientX, touch.clientY);
	}

	//TODO: Extract this to a preferences window?
	var touchSensitivity = 0.02;
	this.yaw += touchSensitivity * (this.touchPosition[0] - this.previousTouchPosition[0]);
	this.pitch -= touchSensitivity * (this.touchPosition[1] - this.previousTouchPosition[1]);
	
	event.preventDefault();
}


//Main update - move, jump, shoot etc
Player.prototype.Update = function(deltaTime)
{
	//Keyboard look controls
	var yawChange =
		(this.game.input.GetActionValue("LookRight") ? 1 : 0)
		- (this.game.input.GetActionValue("LookLeft") ? 1 : 0);
	this.yaw += 2 * deltaTime * yawChange;
	var pitchChange =
		(this.game.input.GetActionValue("LookUp") ? 1 : 0)
		- (this.game.input.GetActionValue("LookDown") ? 1 : 0);
	this.pitch += 2 * deltaTime * pitchChange;
	
	//Touch look controls
	this.pitch += this.game.input.touchDelta[1];
	this.yaw += this.game.input.touchDelta[0];
	
	//Movement controls
	var speed = 3;
	var forward =
		(this.game.input.GetActionValue("Forward") ? speed : 0)
		- (this.game.input.GetActionValue("Backward") ? speed : 0);
	var right =
		(this.game.input.GetActionValue("Right") ? speed : 0)
		- (this.game.input.GetActionValue("Left") ? speed : 0);
	
	//Build final velocity
	var ySpeed = this.physics.velocity[1];
	this.physics.velocity.set([right, 0, -forward]);
	vec3.rotateY(this.physics.velocity, this.physics.velocity, vec3.create(), -this.yaw);
	this.physics.velocity[1] = ySpeed;
	
	//Jump
	if(this.game.input.GetActionValue("Jump") && Math.abs(this.physics.velocity[1]) < 0.01)
	{
		this.physics.velocity[1] = 5;
	}

	//Gravity
	this.physics.velocity[1] -= 9.8 * deltaTime;

	//Move the camera
	vec3.add(this.game.renderer.camera.position, this.position, this.cameraOffset);
	this.game.renderer.camera.pitch = this.pitch;
	this.game.renderer.camera.yaw = this.yaw;
	
	//Suspend the game
	if(this.game.input.GetActionValue("Menu"))
	{
		this.game.Suspend();
	}
}


//Suspended update - spin slowly
Player.prototype.UpdateSuspended = function(deltaTime)
{
	//Position camera
	vec3.add(this.game.renderer.camera.position, this.cameraOffset, this.startingPosition);
	
	//Slowly spin the camera
	this.suspendedYawChangeAngle += deltaTime * 0.1;
	this.game.renderer.camera.yaw = Math.sin(this.suspendedYawChangeAngle) * 1.0;
}
    
    
