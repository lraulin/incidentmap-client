var incidentTypes = {
    fatalCrash: {
        displayName: "Fatal Crash",
        searchString: "(fatal %26 crash)|(fatal %26 car %26 crash)|(fatal %26 car %26 accident)|(Pedestrian %26 killed)|(Fatal %26 truck %26 accident)|(Fatal %26 truck %26 crash)|(Truck %26 kill)|(Bus %26 kill)|(Cyclist %26 killed)|(Bicyclist %26 killed)",
        crisisType: "HIGHWAY",
        regex: /^(?=.*fatal)(?=.*crash)|(?=.*fatal)(?=.*car)(?=.*crash)|(?=.*fatal)(?=.*car)(?=.*accident)|(?=.*pedestrian)(?=.*killed)|(?=.*fatal)(?=.*truck)(?=.*accident)|(?=.*fatal)(?=.*truck)(?=.*crash)|(?=.*truck)(?=.*kill)|(?=.*bus)(?=.*kill)|(?=.*cyclist)(?=.*killed)|(?=.*bicyclist)(?=.*killed).*$/i
    },
    pedestrianCrash: {
        displayName: "Pedestrian Crash",
        searchString: "(Pedestrian %26 crash)|(Pedestrian %26 killed)",
        crisisType: "HIGHWAY",
        regex: /^(?=.*pedestrian)(?=.*crash)|(?=.*pedestrian)(?=.*killed).*$/i
    },
    cyclistCrash: {
        displayName: "Cyclist Crash",
        searchString: "(Bicyclist %26 crash)|(Bicyclist %26 killed)|(Cyclist %26 crash)|(Cyclist %26 killed)",
        crisisType: "HIGHWAY",
        regex: /^(?=.*bicyclist)(?=.*crash)|(?=.*bicyclist)(?=.*killed)|(?=.*cyclist)(?=.*crash)|(?=.*cyclist)(?=.*killed).*$/i
    },
    truckCrash: {
        displayName: "Truck Crash",
        searchString: "(Truck %26 crash)|(Truck %26 kill)|(Fatal %26 truck %26 crash)|(Fatal %26 truck %26 accident)",
        crisisType: "MOTORCARRIER",
        regex: /^(?=.*truck)(?=.*crash)|(?=.*truck)(?=.*kill)|(?=.*fatal)(?=.*truck)(?=.*crash)|(?=.*fatal)(?=.*truck)(?=.*accident).*$/i
    },
    busCrash: {
        displayName: "Bus Crash",
        searchString: "(Bus %26 crash)|(Bus %26 kill)",
        crisisType: "MOTORCARRIER",
        regex: /^(?=.*bus)(?=.*crash)|(?=.*bus)(?=.*kill).*$/i
    },
    transitCrash: {
        displayName: "Transit Crash",
        searchString: "(Transit %26 Crash)|(Transit %26 crash)|(Transit %26 kill)",
        crisisType: "TRANSIT",
        regex: /^(?=.*transit)(?=.*crash)|(?=.*transit)(?=.*crash)|(?=.*transit)(?=.*kill).*$/i
    },
    transSuicide: {
        displayName: "Transportation-related Suicide",
        searchString: "(Rail %26 suicide)|(Transit %26 suicide)",
        crisisType: "OTHER",
        regex: /^(?=.*rail)(?=.*suicide)|(?=.*transit)(?=.*suicide).*$/i
    },
    pipeline: {
        displayName: "Pipeline Incident",
        searchString: "(Pipeline %26 explosion)|(pipeline %26 spills)",
        crisisType: "PIPELINE",
        regex: /^(?=.*pipeline)(?=.*explosion)|(?=.*pipeline)(?=.*spills).*$/i
    },
    hazmat: {
        displayName: "HAZMAT Incident",
        searchString: "(Hazardous %26 spill)|(Hazardous %26 spills)",
        crisisType: "NONE",
        regex: /^(?=.*hazardous)(?=.*spill)|(?=.*hazardous)(?=.*spills).*$/i
    },
    rail: {
        displayName: "Rail Incident",
        searchString: "(Train %26 explosion)|(Train %26 explode)",
        crisisType: "RAIL",
        regex: /^(?=.*train)(?=.*explosion)|(?=.*train)(?=.*explode).*$/i
    },
    road: {
        displayName: "Road Hazard or Closure",
        searchString: "(Bike %26 lane %26 blocked)|(Bus %26 lane %26 blocked)|(road %26 closed)|(road %26 closure)|(road %26 flooded)|(road %26 washed)|(bridge %26 closed)|(bridge %26 out)",
        crisisType: "HIGHWAY",
        regex: /^(?=.*bike)(?=.*lane)(?=.*blocked)|(?=.*bus)(?=.*lane)(?=.*blocked)|(?=.*road)(?=.*closed)|(?=.*road)(?=.*closure)|(?=.*road)(?=.*flooded)|(?=.*road)(?=.*washed)|(?=.*bridge)(?=.*closed)|(?=.*bridge)(?=.*out).*$/i
    },
    unsafe: {
        displayName: "Unsafe Behavior",
        searchString: "(ran %26 red %26 light)|(blew %26 red %26 light)|(blew %26 through %26 red %26 light)",
        crisisType: "HIGHWAY",
        regex: /^(?=.*ran)(?=.*red)(?=.*light)|(?=.*blew)(?=.*red)(?=.*light)|(?=.*blew)(?=.*through)(?=.*red)(?=.*light).*$/i
    },
    drone: {
        displayName: "Drone Incident",
        searchString: "(Drone %26 unauthorized)",
        crisisType: "NONE",
        regex: /^(?=.*drone)(?=.*unauthorized).*$/i
    }
};
module.exports = incidentTypes;
