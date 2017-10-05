//Plane with intersection tests
"use strict"

function Plane(normal, offset)
{
	PhysicsShape.call(this);

    this.normal = normal;
    this.offset = offset;
}