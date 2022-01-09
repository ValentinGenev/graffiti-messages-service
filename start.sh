echo "Wait for the database"
while ! nc -z database 3306; do sleep 5; done;
echo "Start the API"
node dist/index.js;