//Bullet - physical object which knows who fired it
"use strict"


function Bullet(game, properties)
{
	GameObject.call(this, game, properties);

	//The object which fired the bullet
	this.owner = null;

	//Transform
	this.transform = new TransformComponent(this, this.properties);

	//Set up collisions
	this.physics = new PhysicsObject(new Sphere(this.transform.position, 0.1), this);
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
	this.game.renderer.DrawModel(this.model, this.shader, this.transform.GetTransform());
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
