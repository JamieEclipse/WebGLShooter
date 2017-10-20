//Represents one physicalised object
"use strict"

function PhysicsObject(shape, owner)
{
    //Store shape
    this.shape = shape;

    //Initial position and velocity
    this.velocity =  vec3.create();

    //Start asleep
    this.awake = false;

    //Store a context for this physics object
    this.owner = owner;
    
    //Collision callback
    this.OnCollision = undefined;
}