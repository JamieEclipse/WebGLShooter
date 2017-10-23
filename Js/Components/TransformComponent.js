//Stores the position an orientation of an object
"use strict"

function TransformComponent(gameObject, properties)
{
	Component.call(this, gameObject, properties);

	this.LoadVectorProperty("position");
	this.LoadVectorProperty("rotation");
}

TransformComponent.prototype = Object.create(GameObject.prototype);
TransformComponent.prototype.constructor = TransformComponent;


var ToRadians = 180 / Math.PI;
TransformComponent.prototype.GetTransform = function()
{
	//Convert rotation to quaternion
	var rotationQuat = quat.create();
	quat.fromEuler(rotationQuat,
		ToRadians * this.rotation[0],
		ToRadians * -this.rotation[1],
		ToRadians * this.rotation[2]);

	//Create translation and rotation matrix
	var transform = mat4.create();
	mat4.fromRotationTranslation(transform, rotationQuat, this.position);
	
	return transform;
}