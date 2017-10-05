//Base physics shape - defines generalised intersect function
"use strict"

function PhysicsShape()
{
	this.Intersect = function(other)
	{
		//Use a local intersection function
		var thisFunctionName = "Intersect" + other.constructor.name;
		if(thisFunctionName in this)
		{
			return this[thisFunctionName](other);
		}

		//Use other's intersection function
		var intersect = other.Intersect(this);
		if(intersect.intersects)
		{
			vec3.negate(intersect.normal, intersect.normal);
		}
		return intersect;
	}
}