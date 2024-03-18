This project uses postgres. To set up a compatible database, you need to create a database, create the Prisma schema, run the following commands:

## Install prisma
```npm install prisma --save-dev```

## Initialize Prisma in project:
```npx prisma init```

## Create Schema
Refer to the schema.md file for an explanation of the schema of this project.

## Create and apply migration
```npx prisma migrate dev --name init```

## Generate Prisma Client
```npx prisma generate```

## Data import:
Using psql, access the database, and run this command:
```\copy public."Jet" (name, wingspan, engines, year) FROM '/path/to/file/jet_facts.csv' DELIMITER ',' CSV HEADER ENCODING 'UTF8';```
