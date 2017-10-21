//Enemy class - handles AI, collisions and movement
"use strict"


function Enemy(game, properties)
{
	GameObject.call(this, game, properties);

	//Position
	this.LoadVectorProperty("position");
	this.startingPosition = vec3.clone(this.position);
	
	//Direction
	this.LoadProperty("yaw", 0);
	this.LoadProperty("pitch", 0);

	//Set up collisions
	this.physics = new PhysicsObject(new Sphere(this.position, 1), this);
    game.physics.AddPhysicsObject(this.physics);
    this.physics.OnCollision = this.OnCollision.bind(this);
    
    //Load model, texture and shader
	//TODO: Reference centralised assets
	this.LoadProperty("scale", 2);
	var modelFile = this.GetProperty("model", "Models/Billboard.json");
	this.model = new Model(game.renderer.gl, modelFile, this.scale);
	var textureFile = this.GetProperty("texture", "Images/EyeBall.png");
	this.texture = new Texture(game.renderer.gl, textureFile);
	this.shader = new Shader(game.renderer.gl);
	this.shader.textures = [this.texture.texture];

	//Health
	this.LoadProperty("health", 3);
};

Enemy.prototype = Object.create(GameObject.prototype);
Enemy.prototype.constructor = Enemy;


Enemy.prototype.Draw = function()
{
	var modelMatrix = mat4.create();
	mat4.translate(modelMatrix, modelMatrix, this.position);
	this.game.renderer.DrawModel(this.model, this.shader, modelMatrix);
}


Enemy.prototype.OnCollision = function(object, intersect)
{
	//Damage the player
	if(object.owner.constructor.name == "Player")
	{
		//TODO: Damage the player!
		this.game.logger.log("Damaged player!");
	}
}


//Take damage from bullets etc
Enemy.prototype.Damage = function(amount)
{
	//Take damage	
	this.health -= amount;

	//Die
	if(this.health <= 0)
	{
		this.game.RemoveObject(this);
	}
}


Enemy.prototype.Destroy = function()
{
	this.game.physics.RemovePhysicsObject(this.physics);
}
