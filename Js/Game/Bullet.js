//Bullet - physical object which knows who fired it
"use strict"


function Bullet(game, properties)
{
	this.properties = { };
	this.properties.physics = [{ "shape": "Sphere", "radius": 0.1 }];
	this.properties.model = "Models/Billboard.json";
	this.properties.texture = "Images/Bullet.png";

	GameObject.call(this, game, properties);
	
	//The object which fired the bullet
	this.owner = null;

	//Components
	this.AddComponent("TransformComponent", "transform");
	this.AddComponent("PhysicsComponent", "physics");
	this.AddComponent("ModelComponent", "model");

	//Set up collisions
	this.physics.physicsObject.OnCollision = this.OnCollision.bind(this);
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
