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
	this.cameraOffset = vec3.fromValues(0, 1.3, 0);

	//Offset from player position to bullet position
	this.weaponOffset = vec3.fromValues(0, 1.15, 0);
	
	//The angle of the sine wave to set the yaw to
	this.suspendedYawChangeAngle = 0.0;

	//Set up collisions
	this.physics = new PhysicsObject(new Sphere(this.position, 0.5), this);
	game.physics.AddPhysicsObject(this.physics);
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
	var KeyF = [102, 70];
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
	//TODO: Use left click instead. Add mobile button.
	this.game.input.BindKeys(KeyF, "Shoot")
	
	//Register buttons
	this.game.input.BindElement($("#jumpButton"), "Jump");
	this.game.input.BindElement($("#forwardButton"), "Forward");
	this.game.input.BindElement($("#backwardButton"), "Backward");
	this.game.input.BindElement($("#leftButton"), "Left");
	this.game.input.BindElement($("#rightButton"), "Right");
}


//Main update - move, jump, shoot etc
Player.prototype.Update = function(deltaTime)
{
	//TODO: Make these configurable
	var keyboardSensitivity = 2;
	var mouseSensitivity = 0.01;
	var touchSensitivity = 0.01;

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
	this.yaw += this.game.input.touch.delta[0] * touchSensitivity;
	this.pitch -= this.game.input.touch.delta[1] * touchSensitivity;
	
	//Mouse look controls
	this.yaw += this.game.input.mouseDrag.delta[0] * mouseSensitivity;
	this.pitch -= this.game.input.mouseDrag.delta[1] * mouseSensitivity;
	this.yaw += this.game.input.mouse.delta[0] * mouseSensitivity;
	this.pitch -= this.game.input.mouse.delta[1] * mouseSensitivity;
	
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

	//Shoot
	//TODO: Add support for "click" inputs
	var shoot = this.game.input.GetActionValue("Shoot");
	if(shoot && (shoot != this.shootPrevious))
	{
		//Create bullet
		var bullet = new Bullet(this.game);
		this.game.objects.push(bullet);

		//Calculate direction
		//TODO: Move these calculations into the bullet?
		var direction = vec3.fromValues(0, 0, -1);
		vec3.rotateX(direction, direction, vec3.create(), this.pitch);
		vec3.rotateY(direction, direction, vec3.create(), -this.yaw);

		//Calculate velocity
		vec3.scale(bullet.physics.velocity, direction, 40);

		//Calculate position
		vec3.add(bullet.position, this.position, this.weaponOffset);

		//Set bullet's orientation
		bullet.yaw = this.yaw;
		bullet.pitch = this.pitch;
	}
	this.shootPrevious = shoot;
	
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
