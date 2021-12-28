echo "Wait for the database"
dockerize -wait tcp://database:3306 -timeout 20s

echo "Start the API"
node dist/index.js