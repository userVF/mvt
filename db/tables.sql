CREATE SCHEMA data;
CREATE SCHEMA postgis;
CREATE EXTENSION postgis WITH SCHEMA postgis;

CREATE TABLE data.tile_sets (
	id serial,  
	name character varying NOT NULL,
	tile_source_set_ids integer[] NOT NULL,
	is_enabled boolean NOT NULL,
	PRIMARY KEY (id)
);
INSERT INTO data.tile_sets (name, tile_source_set_ids, is_enabled) VALUES ('map1', ARRAY[1,2,3,4], true);
INSERT INTO data.tile_sets (name, tile_source_set_ids, is_enabled) VALUES ('map2', ARRAY[1,2,3], false);

CREATE TABLE data.tile_source_sets (
	id serial,  
	name character varying NOT NULL,
	PRIMARY KEY (id)
);
INSERT INTO data.tile_source_sets (name) VALUES ('locations');
INSERT INTO data.tile_source_sets (name) VALUES ('road_lines');  
INSERT INTO data.tile_source_sets (name) VALUES ('road_labels');
INSERT INTO data.tile_source_sets (name) VALUES ('collection');

CREATE TABLE data.tile_layers (
	id serial,
	tile_source_set_id integer NOT NULL,
	layer_name character varying NOT NULL,
	table_name character varying NOT NULL,	
	PRIMARY KEY (id),
	FOREIGN KEY (tile_source_set_id) REFERENCES data.tile_source_sets (id)
);
INSERT INTO data.tile_layers(tile_source_set_id, layer_name, table_name) VALUES (1, 'city', 'locations');
INSERT INTO data.tile_layers(tile_source_set_id, layer_name, table_name) VALUES (2, 'highway', 'collection');
INSERT INTO data.tile_layers(tile_source_set_id, layer_name, table_name) VALUES (2, 'street', 'collection');
INSERT INTO data.tile_layers(tile_source_set_id, layer_name, table_name) VALUES (3, 'highway-label', 'locations');
INSERT INTO data.tile_layers(tile_source_set_id, layer_name, table_name) VALUES (3, 'street-label', 'locations');
INSERT INTO data.tile_layers(tile_source_set_id, layer_name, table_name) VALUES (4, 'green', 'collection');
INSERT INTO data.tile_layers(tile_source_set_id, layer_name, table_name) VALUES (4, 'water', 'collection');

CREATE TABLE data.tile_set_layers (
	id serial,    
	zoom_range numrange NOT NULL,
	tile_set_id integer NOT NULL,    
	tile_layer_id integer NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (tile_set_id) REFERENCES data.tile_sets (id),    
	FOREIGN KEY (tile_layer_id) REFERENCES data.tile_layers (id),
	UNIQUE (tile_set_id, tile_layer_id)
);
INSERT INTO data.tile_set_layers (zoom_range, tile_set_id, tile_layer_id) VALUES ('[16,18]', 1, 1);
INSERT INTO data.tile_set_layers (zoom_range, tile_set_id, tile_layer_id) VALUES ('[16,18]', 1, 2);
INSERT INTO data.tile_set_layers (zoom_range, tile_set_id, tile_layer_id) VALUES ('[16,18]', 1, 3);
INSERT INTO data.tile_set_layers (zoom_range, tile_set_id, tile_layer_id) VALUES ('[16,18]', 1, 4);
INSERT INTO data.tile_set_layers (zoom_range, tile_set_id, tile_layer_id) VALUES ('[16,18]', 1, 5);
INSERT INTO data.tile_set_layers (zoom_range, tile_set_id, tile_layer_id) VALUES ('[16,18]', 1, 6);
INSERT INTO data.tile_set_layers (zoom_range, tile_set_id, tile_layer_id) VALUES ('[16,18]', 1, 7);

CREATE TABLE data.locations (
	id bigint NOT NULL,
	parent_id bigint,
	tile_layer_id integer NOT NULL, 
	name character varying,
	geom postgis.geometry(Geometry, 3857) NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (tile_layer_id) REFERENCES data.tile_layers (id)
);
CREATE INDEX ON data.locations USING GIST (geom);
CREATE INDEX ON data.locations (tile_layer_id);

CREATE TABLE data.collection (
	id bigint NOT NULL,
	tile_layer_id integer NOT NULL,
	geom postgis.geometry(Geometry, 3857) NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (tile_layer_id) REFERENCES data.tile_layers (id)
);    
CREATE INDEX ON data.collection USING GIST (geom);
CREATE INDEX ON data.collection (tile_layer_id);

CREATE TABLE data.road_levels (
	id bigint NOT NULL,
	tile_layer_id integer NOT NULL,
	level integer NOT NULL,
	geom postgis.geometry(MultiLineString, 3857) NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (tile_layer_id) REFERENCES data.tile_layers (id)
);    
CREATE INDEX ON data.road_levels USING GIST (geom);
CREATE INDEX ON data.collection (tile_layer_id);

CREATE TABLE data.tile_changes (
	id bigserial,
	tile_path varchar NOT NULL,
	tile_set_id integer NOT NULL,
	geom postgis.geometry(Polygon, 3857),
	PRIMARY KEY (id),
	FOREIGN KEY (tile_set_id) REFERENCES data.tile_sets (id)
);


 