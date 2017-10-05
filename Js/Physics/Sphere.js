//Sphere shape with intersection tests
"use strict"

function Sphere(position, radius)
{
	PhysicsShape.call(this);

    this.position = position;
    this.radius = radius;
}

//Sphere-sphere intersection check
//Returns { intersects:bool, [penetration:number, normal:vec3] } (Normal points toward this)
Sphere.prototype.IntersectSphere = function(sphere)
{
    //Detect intersection
    var difference = vec3.create();
    vec3.subtract(difference, this.position, sphere.position);
    var squaredDistance = vec3.squaredLength(difference);
    var radii = this.radius + sphere.radius;
    var squaredRadii = radii * radii;
    var output = { intersects: squaredDistance < squaredRadii };

    //Produce intersection parameters
    if(output.intersects)
    {
        //TODO: Implement fast inverse square root?
        var distance = Math.sqrt(squaredDistance);
        output.penetration = radii - distance;
        output.normal = vec3.create();
        vec3.scale(output.normal, difference, 1 / distance);
    }

    return output;
}


//Sphere-plane intersection check
//Returns { intersects:bool, [penetration:number, normal:vec3] } (Normal points toward this)
Sphere.prototype.IntersectPlane = function(plane)
{
    //Detect intersection
    var distance = vec3.dot(this.position, plane.normal) - plane.offset;
    var output = { intersects: distance < this.radius };

    //Produce intersection parameters
    if(output.intersects)
    {
        output.penetration = this.radius - distance;
        output.normal = vec3.clone(plane.normal);
    }

    return output;
}


