CREATE TABLE IncidentTypes
(
  Id VARCHAR(50) PRIMARY KEY,
  DisplayName VARCHAR(50),
  SearchString VARCHAR(500),
  CrisisType VARCHAR(50),
  Regex VARCHAR(250)
);

CREATE TABLE Tweets
(
  Id INT PRIMARY KEY,
  IncidentType VARCHAR(50),
  FOREIGN KEY (IncidentType) REFERENCES IncidentTypes (Id),
  Body VARCHAR(300),
  Latitude REAL,
  Longitude REAL,
  Serialized JSON
);

INSERT INTO incidenttypes
  (id, displayname, searchstring, crisistype, regex)
VALUES
  ('fatalCrash', 'Fatal Crash', '(fatal %26 crash)|(fatal %26 car %26 crash)|(fatal %26 car %26 accident)|(Pedestrian %26 killed)|(Fatal %26 truck %26 accident)|(Fatal %26 truck %26 crash)|(Truck %26 kill)|(Bus %26 kill)|(Cyclist %26 killed)|(Bicyclist %26 killed)', 'HIGHWAY', '/^(?=.*fatal)(?=.*crash)|(?=.*fatal)(?=.*car)(?=.*crash)|(?=.*fatal)(?=.*car)(?=.*accident)|(?=.*pedestrian)(?=.*killed)|(?=.*fatal)(?=.*truck)(?=.*accident)|(?=.*fatal)(?=.*truck)(?=.*crash)|(?=.*truck)(?=.*kill)|(?=.*bus)(?=.*kill)|(?=.*cyclist)(?=.*killed)|(?=.*bicyclist)(?=.*killed).*$/i'),
  ('pedestrianCrash', 'Pedestrian Crash', '(Pedestrian %26 crash)|(Pedestrian %26 killed)', 'HIGHWAY', '/^(?=.*pedestrian)(?=.*crash)|(?=.*pedestrian)(?=.*killed).*$/i'),
  ('cyclistCrash', 'Cyclist Crash', '(Bicyclist %26 crash)|(Bicyclist %26 killed)|(Cyclist %26 crash)|(Cyclist %26 killed)', 'HIGHWAY', '/^(?=.*bicyclist)(?=.*crash)|(?=.*bicyclist)(?=.*killed)|(?=.*cyclist)(?=.*crash)|(?=.*cyclist)(?=.*killed).*$/i'),
  ('truckCrash', 'Truck Crash', '(Truck %26 crash)|(Truck %26 kill)|(Fatal %26 truck %26 crash)|(Fatal %26 truck %26 accident)', 'MOTORCARRIER', '/^(?=.*truck)(?=.*crash)|(?=.*truck)(?=.*kill)|(?=.*fatal)(?=.*truck)(?=.*crash)|(?=.*fatal)(?=.*truck)(?=.*accident).*$/i'),
  ('busCrash', 'Bus Crash', '(Bus %26 crash)|(Bus %26 kill)', 'MOTORCARRIER', '/^(?=.*bus)(?=.*crash)|(?=.*bus)(?=.*kill).*$/i'),
  ('transitCrash', 'Transit Crash', '(Transit %26 Crash)|(Transit %26 crash)|(Transit %26 kill)', 'TRANSIT', '/^(?=.*transit)(?=.*crash)|(?=.*transit)(?=.*crash)|(?=.*transit)(?=.*kill).*$/i'),
  ('transSuicide', 'Transportation-related Suicide', '(Rail %26 suicide)|(Transit %26 suicide)', 'OTHER', '/^(?=.*rail)(?=.*suicide)|(?=.*transit)(?=.*suicide).*$/i'),
  ('pipeline', 'Pipeline Incident', '(Pipeline %26 explosion)|(pipeline %26 spills)', 'PIPELINE', '/^(?=.*pipeline)(?=.*explosion)|(?=.*pipeline)(?=.*spills).*$/i'),
  ('hazmat', 'HAZMAT Incident', '(Hazardous %26 spill)|(Hazardous %26 spills)', 'NONE', '/^(?=.*hazardous)(?=.*spill)|(?=.*hazardous)(?=.*spills).*$/i'),
  ('rail', 'Rail Incident', '(Train %26 explosion)|(Train %26 explode)', 'RAIL', '/^(?=.*train)(?=.*explosion)|(?=.*train)(?=.*explode).*$/i'),
  ('road', 'Road Hazard or Closure', '(Bike %26 lane %26 blocked)|(Bus %26 lane %26 blocked)|(road %26 closed)|(road %26 closure)|(road %26 flooded)|(road %26 washed)|(bridge %26 closed)|(bridge %26 out)', 'HIGHWAY', '/^(?=.*bike)(?=.*lane)(?=.*blocked)|(?=.*bus)(?=.*lane)(?=.*blocked)|(?=.*road)(?=.*closed)|(?=.*road)(?=.*closure)|(?=.*road)(?=.*flooded)|(?=.*road)(?=.*washed)|(?=.*bridge)(?=.*closed)|(?=.*bridge)(?=.*out).*$/i'),
  ('unsafe', 'Unsafe Behavior', '(ran %26 red %26 light)|(blew %26 red %26 light)|(blew %26 through %26 red %26 light)', 'HIGHWAY', '/^(?=.*ran)(?=.*red)(?=.*light)|(?=.*blew)(?=.*red)(?=.*light)|(?=.*blew)(?=.*through)(?=.*red)(?=.*light).*$/i'),
  ('drone', 'Drone Incident', '(Drone %26 unauthorized)', 'NONE', '/^(?=.*drone)(?=.*unauthorized).*$/i');

CREATE TABLE crisistypes
(
  id INT PRIMARY KEY,
  name VARCHAR(50)
);

INSERT INTO crisistypes (id, name)
VALUES
  (0, 'HIGHWAY'),
  (1, 'MOTORCARRIER'),
  (2, 'TRANSIT'),
  (3, 'RAIL'),
  (4, 'OTHER'),
  (5, 'PIPELINE'),
  (6, 'NONE');

ALTER TABLE incidenttypes
ADD COLUMN crisis_id INT REFERENCES crisistypes(id);