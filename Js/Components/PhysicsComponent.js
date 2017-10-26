//Component handling the lifetime of a physics object
//TODO: Multiple inherit from PhysicsObject?
"use strict"

function PhysicsComponent(gameObject, properties)
{
	Component.call(this, gameObject, properties);

	//Physics
	if("physics" in this.properties)
	{
		//Loop through physics data
		for(var i = 0; i < this.properties.physics.length; ++i)
		{
			var physicsData = this.properties.physics[i];
			var shape;

			//Load a shape
			//TODO: Other shapes. Architect this properly.
			switch(physicsData.shape)
			{
				case "BoundingBox":
				//TODO: Remove hard reference to transform component?
				shape = new BoundingBox(gameObject.transform.position, vec3.fromValues(...physicsData.size));
				break;

				case "Mesh":
				//TODO: Remove hard reference to model and transform components?
				shape = new Mesh(gameObject.transform.position, gameObject.model.model);
				break;

				case "Plane":
				shape = new Plane(physicsData.normal, physicsData.offset);
				break;

				case "Sphere":
				//TODO: Remove hard reference to transform component?
				shape = new Sphere(gameObject.transform.position, physicsData.radius);
				break;
			}

			//Add a physics object
			if(shape !== undefined)
			{
				this.physicsObject = new PhysicsObject(shape, gameObject);
				this.game.physics.AddPhysicsObject(this.physicsObject);
			}
		}
	}
}

PhysicsComponent.prototype = Object.create(GameObject.prototype);
PhysicsComponent.prototype.constructor = PhysicsComponent;


PhysicsComponent.prototype.Destroy = function()
{
	this.game.physics.RemovePhysicsObject(this.physicsObject);
	delete this.physicsObject;
}