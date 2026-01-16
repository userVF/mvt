This is example of generating, displaying and data change tracking of vector tiles (Mapbox Vector Tile format).

## Prerequisites
- PostgreSQL with PostGIS
- Node.js

## Database setup

Initialize database
   ```bash
   psql -v ON_ERROR_STOP=ON -U postgres -f db/init.sql
   ```
Create tables, load data and create triggers
  ```bash
  psql --single-transaction -v ON_ERROR_STOP=ON -U tileset -c '\i db/tables.sql' -c '\i db/data.sql' -c '\i db/triggers.sql'
  ```
Adjust connectection
- Replace `<YOUR_DB_HOST>` placeholder in `.env` file with your own value.
- Replace `<YOUR DB_PASSWORD>` placeholder in `.env` file with your own value, if your database setting requires password authentication and change password:
```bash
psql -U tileset -c "ALTER ROLE tileset WITH PASSWORD '<YOUR DB_PASSWORD>'"
```

The data in the database is stored as follows:   
<img width="1058" height="595" alt="db" src="https://github.com/user-attachments/assets/e16c8537-c968-4ae7-a834-be79c3cf8495" />

## Code setup

Install dependencies
```bash
npm ci
```
Build bundles
```bash
npm run build
```
Relationships between CTEs and style layers:
<img width="1058" height="595" alt="code" src="https://github.com/user-attachments/assets/0e3b0edf-8d4f-4791-9c4d-74d0d80b8b60" />

## Live example
Run application server
```bash
node ./server/app-server.js
```
Run static server (in new terminal tab)
```bash
node ./server/static-server.js
```
Open in a browser
```bash
http://localhost:3000
```
The map should looks like this:
<img width="1021" height="594" alt="live-example" src="https://github.com/user-attachments/assets/ce14a4a1-5700-4d8c-8224-2927cb38f972" />

Full example: [Topohub.kz](https://topohub.kz/en#15/43.21826/76.64832)

## Changed tiles
Changes in the data are tracked. Based on a specific tileset and zoom range of a layer, the tiles impacted by these changes are calculated.

The tiles that affected by data changes:
<img width="1024" height="597" alt="tile-changes" src="https://github.com/user-attachments/assets/e96e3837-69e1-40d7-88e9-7e61fd742c24" />


   
