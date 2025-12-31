CREATE OR REPLACE FUNCTION data.set_tile_changes() RETURNS trigger AS $$
	DECLARE
		set_id integer;
		feature_tile_layer_id integer;
		feature_geom postgis.geometry(Geometry, 3857);
		zoom integer;
		zoom_arr integer[];    
		meter_per_tile numeric;
		meter_per_tile_arr numeric[] DEFAULT ARRAY[
			40075016.685578488,
			20037508.342789244,
			10018754.171394621,
			5009377.085697311,
			2504688.542848655,
			1252344.271424328,
			626172.135712164,
			313086.067856082,
			156543.033928041,
			78271.51696402,
			39135.75848201,
			19567.879241005,
			9783.939620503,
			4891.969810251,
			2445.984905126,
			1222.992452563,
			611.496226281,
			305.748113141,
			152.87405657,
			76.437028285,
			38.218514143,
			19.109257071,
			9.554628536
		];
		tiles_per_semiaxis integer;
		semiaxis_length numeric DEFAULT 20037508.342789244;
	BEGIN    
		IF TG_OP = 'INSERT' THEN
			feature_tile_layer_id = NEW.tile_layer_id;
			feature_geom = NEW.geom;
		END IF;
		IF TG_OP = 'UPDATE' THEN
			feature_tile_layer_id = NEW.tile_layer_id;
			IF postgis.ST_Equals(NEW.geom, OLD.geom) = false THEN
				feature_geom = postgis.ST_SymDifference(NEW.geom, OLD.geom);
			ELSE
				feature_geom = NEW.geom;
			END IF;
		END IF;
		IF TG_OP = 'DELETE' THEN
			feature_tile_layer_id = OLD.tile_layer_id;
			feature_geom = OLD.geom;
		END IF;      
		FOR set_id IN SELECT id FROM data.tile_sets WHERE is_enabled = true LOOP
			SELECT ARRAY(SELECT generate_series(lower(zoom_range), upper(zoom_range))) 
			INTO zoom_arr FROM data.tile_set_layers WHERE tile_set_id = set_id AND tile_layer_id = feature_tile_layer_id;        
			IF zoom_arr IS NOT NULL AND cardinality(zoom_arr) > 0 THEN
				FOREACH zoom IN ARRAY zoom_arr LOOP
					meter_per_tile = meter_per_tile_arr[zoom + 1];
					tiles_per_semiaxis = semiaxis_length / meter_per_tile;      
					INSERT INTO data.tile_changes(tile_path, tile_set_id, geom)
					SELECT (zoom||'/'||tiles_per_semiaxis + grid.i)||'/'||(tiles_per_semiaxis - grid.j - 1), set_id, grid.geom 
					FROM (
						SELECT (postgis.ST_SquareGrid(meter_per_tile, feature_geom)).*
					) grid WHERE postgis.ST_Intersects(feature_geom, grid.geom);
				END LOOP;
			END IF;
		END LOOP;
		RETURN NULL;
	END; 
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_tile_changes AFTER INSERT OR UPDATE OR DELETE ON data.locations
	FOR EACH ROW EXECUTE FUNCTION data.set_tile_changes();
CREATE TRIGGER set_tile_changes AFTER INSERT OR UPDATE OR DELETE ON data.collection
	FOR EACH ROW EXECUTE FUNCTION data.set_tile_changes();
CREATE TRIGGER set_tile_changes AFTER INSERT OR UPDATE OR DELETE ON data.road_levels
	FOR EACH ROW EXECUTE FUNCTION data.set_tile_changes();

CREATE OR REPLACE FUNCTION data.validate_and_prepare_geom() RETURNS trigger AS $$
	BEGIN
		IF NOT postgis.ST_IsValid(NEW.geom) THEN		
			RAISE EXCEPTION 'Wrong geom: %', postgis.ST_IsValidReason(NEW.geom);
		END IF;
		IF postgis.ST_GeometryType(NEW.geom) IN ('ST_MultiCurve', 'ST_MultiSurface') THEN
			NEW.geom = postgis.ST_CurveToLine(NEW.geom);
		END IF;
		IF TG_TABLE_NAME IN ('locations', 'collection') THEN
			NEW.geom = postgis.ST_Multi(NEW.geom);
		END IF;
		RETURN NEW;
	END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_and_prepare_geom BEFORE INSERT OR UPDATE ON data.locations
  FOR EACH ROW EXECUTE FUNCTION data.validate_and_prepare_geom();
CREATE TRIGGER validate_and_prepare_geom BEFORE INSERT OR UPDATE ON data.collection
	FOR EACH ROW EXECUTE FUNCTION data.validate_and_prepare_geom();
CREATE TRIGGER validate_geom BEFORE INSERT OR UPDATE ON data.road_levels
	FOR EACH ROW EXECUTE FUNCTION data.validate_and_prepare_geom();