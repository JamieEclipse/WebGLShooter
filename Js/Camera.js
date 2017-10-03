//Camera - handles view and projection matrices
"use strict"

//Constructor
function Camera()
{
	this.position = vec3.create();
	
	//TODO: Add pitch and roll, or use a vec3 or quaternion.
	this.yaw = 0;
}


Camera.prototype.GetProjectionMatrix = function(width, height)
{
	const projectionMatrix = mat4.create();
	
	// Create a perspective matrix, a special matrix that is
	// used to simulate the distortion of perspective in a camera.
	// Our field of view is 45 degrees, with a width/height
	// ratio that matches the display size of the canvas
	// and we only want to see objects between 0.1 units
	// and 100 units away from the camera.
	const fieldOfView = 45 * Math.PI / 180; // in radians
	const aspect = width / height;
	const zNear = 0.001;
	const zFar = 100.0;

	// note: glmatrix.js always has the first argument
	// as the destination to receive the result.
	mat4.perspective(projectionMatrix,
		fieldOfView,
		aspect,
		zNear,
		zFar);
	
	return projectionMatrix;
}


Camera.prototype.GetViewMatrix = function()
{
	var viewMatrix = mat4.create();
	
	//Rotate to account for the camera's orientation
	mat4.rotate(viewMatrix,
		viewMatrix,
		this.yaw,
		[0, 1, 0]);
		
	//Translate to account for the camera's position
	var translateBy = vec3.clone(this.position);
	vec3.negate(translateBy, translateBy);
	mat4.translate(viewMatrix, viewMatrix, translateBy);
		
	return viewMatrix;
}
