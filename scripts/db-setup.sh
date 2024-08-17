#!/bin/bash

echo "Running migrations..."
npx sequelize-cli db:migrate

echo "Seeding database..."
npx sequelize-cli db:seed:all

echo "Database setup complete."
