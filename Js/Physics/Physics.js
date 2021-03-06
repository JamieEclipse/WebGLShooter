//Handles all game physics
"use strict"


function Physics(game)
{
    //Store a reference back to the game
    this.game = game;

    //Store a list of physical objects and their velocities
    this.objects = [];

    //Store a zeroed vector
    this.zeroVector = vec3.create();
}


Physics.prototype.Update = function(deltaTime)
{
    //Remove null objects
    for(var i = 0; i < this.objects.length; ++i)
    {
        if(!this.objects[i])
        {
            this.objects.splice(i, 1);
            --i;
        }
    }

    //Move objects and mark them as awake
    for(var i in this.objects)
    {
        var object = this.objects[i];

        //Check for non-zero velocity
        if(!vec3.exactEquals(object.velocity, this.zeroVector))
        {
            object.awake = true;
            vec3.scaleAndAdd(object.shape.position, object.shape.position, object.velocity, deltaTime);
        }
    }

    //Check for and handle intersections
    for(var i = 0; i < this.objects.length; ++i)
    {
        var objectI = this.objects[i];
        if(objectI && objectI.awake)
        {
            for(var j = 0; j < this.objects.length; ++j)
            {
				if(i != j)
				{
					var objectJ = this.objects[j];
                    if(objectJ)
                    {
						//Use max iteration counts
						var iterations = Math.max(objectI.shape.iterations, objectJ.shape.iterations);

						for(var iteration = 0; iteration < iterations; ++iteration)
						{
							var intersect = objectI.shape.Intersect(objectJ.shape);
							if(intersect.intersects)
							{
								//Send callbacks
								if(objectI.OnCollision !== undefined)
								{
									objectI.OnCollision(objectJ, intersect);
								}
								if(objectJ.OnCollision !== undefined)
								{
									objectJ.OnCollision(objectI, intersect);
								}

								vec3.scaleAndAdd(objectI.shape.position, objectI.shape.position, intersect.normal, intersect.penetration);
						
								//Remove velocity in -normal direction
								var speedAlongNormal = vec3.dot(intersect.normal, objectI.velocity);
								vec3.scaleAndAdd(objectI.velocity, objectI.velocity, intersect.normal, Math.max(0, -speedAlongNormal));
							}
						}
                    }
				}
            }
        }
    }
}


//Adds a physics object to the system
Physics.prototype.AddPhysicsObject = function(object)
{
    this.objects.push(object);
}

//Remove a physics object from the system
Physics.prototype.RemovePhysicsObject = function(object)
{
    for(var i = 0; i < this.objects.length; ++i)
    {
        if(this.objects[i] == object)
        {
            this.objects[i] = null;
            return;
        }
    }
}