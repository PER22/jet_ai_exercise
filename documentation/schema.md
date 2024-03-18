# Jet Model

This is a Prisma model used for representing a Jet in the database.

## Fields

- `id`: An integer that serves as the unique identifier for each Jet. It is auto-incremented by default.
- `name`: A nullable string that represents the name of the Jet. It is unique for each Jet.
- `wingspan`: A float that represents the wingspan of the Jet.
- `engines`: An integer that represents the number of engines the Jet has.
- `year`: An integer that represents the year the Jet was made.

## Usage

This model is used in the application to interact with the `Jet` table in the database. It allows for creating, reading, updating, and deleting records from the `Jet` table.