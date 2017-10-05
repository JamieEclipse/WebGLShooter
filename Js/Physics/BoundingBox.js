//AABB with intersection tests
"use strict"

function BoundingBox(position, size)
{
	PhysicsShape.call(this);

	this.position = position;
	this.size = size;
}


//Finds the closest point on or in the box to the specified point
BoundingBox.prototype.FindClosestPoint = function(to)
{
	//Get bounds
	var min = vec3.create();
	var max = vec3.create();
	vec3.subtract(min, this.position, this.size);
	vec3.add(max, this.position, this.size);

	//Clamp each co-ordinate
	var point = vec3.create();
	for(var i in point)
	{
		point[i] = Math.min(Math.max(min[i], to[i]), max[i]);
	}
	return point;
}


//BoundingBox-sphere intersection check
//Returns { intersects:bool, [penetration:number, normal:vec3] } (Normal points toward this)
BoundingBox.prototype.IntersectSphere = function(sphere)
{
	//Get closest point on box to sphere's centre
	var closestPoint = this.FindClosestPoint(sphere.position);

    //Detect intersection
    var difference = vec3.create();
    vec3.subtract(difference, closestPoint, sphere.position);
    var squaredDistance = vec3.squaredLength(difference);
    var squaredRadius = sphere.radius * sphere.radius;
    var output = { intersects: squaredDistance < squaredRadius };

    //Produce intersection parameters
    if(output.intersects)
    {
        //TODO: Implement fast inverse square root?
        var distance = Math.sqrt(squaredDistance);
		output.penetration = sphere.radius - distance;
		output.normal = vec3.create();
        vec3.scale(output.normal, difference, 1 / distance);
	}

    return output;
}