//Represents one physicalised object
"use strict"

function PhysicsObject(shape)
{
    //Store shape
    this.shape = shape;

    //Initial position and velocity
    this.velocity =  vec3.create();

    //Start asleep
    this.awake = false;
}