//Bullet - physical object which knows who fired it
"use strict"


function Bullet(game, properties)
{
	GameObject.call(this, game, properties);

	//The object which fired the bullet
	this.owner = null;

	//Position
	this.LoadVectorProperty("position");
	this.startingPosition = vec3.clone(this.position);
	
	//Direction
	this.LoadProperty("yaw", 0);
	this.LoadProperty("pitch", 0);

	//Set up collisions
	this.physics = new PhysicsObject(new Sphere(this.position, 0.1), this);
    game.physics.AddPhysicsObject(this.physics);
    this.physics.OnCollision = this.OnCollision.bind(this);
    
    //Load model, texture and shader
	//TODO: Reference centralised assets
	this.LoadProperty("scale", 0.2);
	var modelFile = this.GetProperty("model", "Models/Billboard.json");
	this.model = new Model(game.renderer.gl, modelFile, this.scale);
	var textureFile = this.GetProperty("texture", "Images/Bullet.png");
	this.texture = new Texture(game.renderer.gl, textureFile);
	this.shader = new Shader(game.renderer.gl);
	this.shader.textures = [this.texture.texture];
};

Bullet.prototype = Object.create(GameObject.prototype);
Bullet.prototype.constructor = Bullet;


Bullet.prototype.Draw = function()
{
	var modelMatrix = mat4.create();
	mat4.translate(modelMatrix, modelMatrix, this.position);
	mat4.rotate(modelMatrix,
		modelMatrix,
		this.yaw,
		[0, -1, 0]);
	mat4.rotate(modelMatrix,
		modelMatrix,
		this.pitch,
		[1, 0, 0]);
	
	this.game.renderer.DrawModel(this.model, this.shader, modelMatrix);
}


Bullet.prototype.OnCollision = function(object, intersect)
{
	//Damage enemies
	if(object.owner != this.owner && object.owner && "Damage" in object.owner)
	{
		object.owner.Damage(1);
	}
	
	//Remove
	this.game.RemoveObject(this);
}
