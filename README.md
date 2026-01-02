This is example of generating, displaying and data change tracking of vector tiles(Mapbox Vector Tile format).

## Prerequisites
- PostgreSQL with PostGIS
- Node.js

## Database setup

Initialize database
   ```bash
   psql -v ON_ERROR_STOP=ON -U postgres < db/init.sql
   ```
Create tables
  ```bash
  psql -v ON_ERROR_STOP=ON -U tileset < db/tables.sql
  ```
Load data
  ```bash
  psql -v ON_ERROR_STOP=ON -U tileset < db/data.sql
  ```
Create triggers
  ```bash
  psql -v ON_ERROR_STOP=ON -U tileset < db/triggers.sql
  ```
Replace `<YOUR_DB_PASSWORD>` and `<YOUR_DB_HOST>` placeholders in `.env` file with your own values.

The data in the database is stored as follows:   
<img width="1058" height="595" alt="db" src="https://github.com/user-attachments/assets/2a0d9c5e-69c5-441f-a751-5d925e06678a" />

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
<img width="1058" height="595" alt="code" src="https://github.com/user-attachments/assets/091aa6bd-ac45-4dc8-a147-402397002462" />


## Live example
Run application server
```bash
node ./server/app-server.js
```
Run static server (in new terminal tab)
```bash
node ./server/static-server.js
```
Open in your browser
```bash
http://localhost:3000
```
The map should looks like this:
<img width="1024" height="597" alt="live-example" src="https://github.com/user-attachments/assets/2fe5e6c7-0cdc-4a48-9a20-29c216285644" />

## Changed tiles
Changes in the data are tracked. Based on a specific tileset and zoom range of a layer, the tiles impacted by these changes are calculated.

The tiles that affected by changes:
<img width="1024" height="597" alt="tile-changes" src="https://github.com/user-attachments/assets/e96e3837-69e1-40d7-88e9-7e61fd742c24" />


   
