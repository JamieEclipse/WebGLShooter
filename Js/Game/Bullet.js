//Bullet - physical object which knows who fired it
"use strict"


function Bullet(game, properties)
{
	GameObject.call(this, game, properties);

	//The object which fired the bullet
	this.owner = null;

	//Transform
	this.AddComponent("TransformComponent", "transform");

	//Model
	this.properties.model = "Models/Billboard.json";
	this.properties.texture = "Images/Bullet.png";
	this.AddComponent("ModelComponent", "model");

	//Set up collisions
	this.physics = new PhysicsObject(new Sphere(this.transform.position, 0.1), this);
    this.game.physics.AddPhysicsObject(this.physics);
	this.physics.OnCollision = this.OnCollision.bind(this);
};

Bullet.prototype = Object.create(GameObject.prototype);
Bullet.prototype.constructor = Bullet;


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
