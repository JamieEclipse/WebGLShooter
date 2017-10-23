//Utility for loading GameObject and Component properties from JSON
"use strict"

function PropertyLoader()
{
    //Try to find the named property's value, fall back to defaultValue
    this.GetProperty = function(name, defaultValue)
    {
        //Fall back to default value
        var value = defaultValue;

        //Attempt to get value from properties
        if(this.properties !== undefined)
        {
            if(name in this.properties)
            {
                value = this.properties[name];
            }
        }
        
        return value;
    }

    //Write the property called "name" into this[name] if it exists, otherwise use defaultValue.
    this.LoadProperty = function(name, defaultValue)
    {
        this[name] = this.GetProperty(name, defaultValue);
    }

    //Same as LoadProperty, but constructs a vector from the loaded value - default value must be of the form [x, y, z]
    this.LoadVectorProperty = function(name, defaultValue = [0, 0, 0])
    {
        this[name] = vec3.fromValues(...this.GetProperty(name, defaultValue));
    }
}
