  CREATE ROLE tileset WITH CREATEDB CREATEROLE LOGIN NOINHERIT VALID UNTIL 'infinity' SUPERUSER;
  GRANT connect ON database postgres TO tileset; 
  CREATE DATABASE tileset OWNER tileset;
