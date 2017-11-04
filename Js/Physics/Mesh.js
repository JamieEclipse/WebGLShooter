//Triangle mesh physics shape
//TODO: Implement convex hulls instead?
"use strict"

function Mesh(position, model, scale = 1)
{
	PhysicsShape.call(this);

	this.position = position;
	this.model = model;

	//More iterations
	this.iterations = 8;

	//Not initialised until the model is loaded
	this.triangleCount = 0;
	
	//Initialise when the model is loaded
	//TODO: Function extract this into the Model?
	if(this.model.loaded)
	{
		Initialise();
	}
	else
	{
		this.model.loadedCallbacks.push(this.Initialise.bind(this));
	}
}


Mesh.prototype.Initialise = function()
{
	//Get triangle information
	this.triangleCount = this.model.indices.length / 3;
	this.triangleFaces = [ ];
	this.triangleEdges = [ ];
	var normal = vec3.create();
	var tangent = vec3.create();
	var bitangent = vec3.create();
	for(var i = 0; i < this.model.indices.length; i += 3)
	{
		var GetPosition = function(index)
		{
			return vec3.fromValues(
				this.model.positions[index * 3 + 0],
				this.model.positions[index * 3 + 1],
				this.model.positions[index * 3 + 2]);
		}.bind(this);

		//Get vertices
		var triangle = [
			GetPosition(this.model.indices[i + 0]),
			GetPosition(this.model.indices[i + 1]),
			GetPosition(this.model.indices[i + 2])
		];

		//Generate face plane
		vec3.subtract(tangent, triangle[1], triangle[0]);
		vec3.subtract(bitangent, triangle[2], triangle[0]);
		vec3.normalize(tangent, tangent);
		vec3.normalize(bitangent, bitangent);
		vec3.cross(normal, bitangent, tangent);
		vec3.normalize(normal, normal);
		this.triangleFaces.push({ normal: vec3.clone(normal), offset: vec3.dot(triangle[0], normal) });

		//Generate edge planes
		var GenerateEdgePlane = function(v1, v2)
		{
			var edgeTangent = vec3.create();
			vec3.subtract(edgeTangent, v2, v1);
			vec3.normalize(edgeTangent, edgeTangent);
			var edgeNormal = vec3.create();
			vec3.cross(edgeNormal, normal, edgeTangent);
			return { normal: edgeNormal, offset: vec3.dot(edgeNormal, v1) };
		};
		this.triangleEdges.push([
			GenerateEdgePlane(triangle[0], triangle[1]),
			GenerateEdgePlane(triangle[1], triangle[2]),
			GenerateEdgePlane(triangle[2], triangle[0])
		]);
	}
}


//Mesh-sphere intersection check
//Returns { intersects:bool, [penetration:number, normal:vec3] } (Normal points toward this)
Mesh.prototype.IntersectSphere = function(sphere)
{
	var output = { intersects: false };

	for(var i = 0; i < this.triangleCount; ++i)
	{
		var plane = this.triangleFaces[i];

		//Transform sphere into mesh space
		//TODO: Handle mesh rotation
		var spherePosition = vec3.create();
		vec3.subtract(spherePosition, sphere.position, this.position);

		//Test against triangle plane
		var distance = vec3.dot(spherePosition, plane.normal) - plane.offset;
		distance = Math.abs(distance);
		if(distance >= sphere.radius)
		{	
			continue;
		}

		//Get radius on plane
		var radiusOnPlane = Math.sqrt((sphere.radius * sphere.radius) - (distance * distance));

		//Test against triangle edges
		var intersects = true;
		for(var edgeIndex = 0; edgeIndex < 3; ++edgeIndex)
		{
			var edgePlane = this.triangleEdges[i][edgeIndex];
			var edgeDistance = vec3.dot(spherePosition, edgePlane.normal) - edgePlane.offset;
			if(edgeDistance >= radiusOnPlane)
			{
				intersects = false;
				break;
			}
		}

		//Produce intersection parameters
		if(intersects)
		{
			var penetration = sphere.radius - distance;
			if((output.penetration === undefined) || (penetration > output.penetration))
			{
				output.penetration = penetration;
				output.normal = vec3.clone(plane.normal);
				output.intersects = true;
				vec3.negate(output.normal, output.normal);
			}
		}
	}

    return output;
}