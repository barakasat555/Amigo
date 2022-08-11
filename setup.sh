#!/bin/bash
sleep 2

# Please make sure you only set this database password at the first setup no more!
DatabasePassword="456987123"

# This is the client Security key for generating the JWT
ClientJWT_SECRET="OWEHGIOPEWHOGPWEJT4owjfgiphegEFOJWQEFJPOH"

# This is the admin dashboard Security key for generating the JWT
AdminJWT_SECRET="QWLMFMNOWQEOFLPQWKDF12312948ujghioenwfqkmpj#)IUG$@J("

sleep 2

get_abs_filename() {
  # $1 : relative filename
  echo "$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
}

pathToReplace=$(get_abs_filename)
pathToReplace=${pathToReplace%/}

echo $pathToReplace

sleep 2
# Accept prompt and make it a varbiale
sudo echo "Enter the Host you want to use for the server"
sleep 2

read host
sleep 2

# if host variable includes "^M" delete it and trim white spaces
host=${host//$'\r'/}
host=${host// /}



# Output the host to the terminal
echo "Host is: $host"
sleep 5

echo "#***************************************************************"
# Run sudo apt update -y && sudo apt upgrade -y
sudo apt update -y && sudo apt upgrade -y
sleep 2
#Set the currentPrograss to the next line
echo "###*************************************************************"

# Run sudo apt install nodejs npm nginx wget git -y
sudo apt install nodejs npm nginx wget git -y
sleep 5

# Run wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
sleep 5
echo "#######*********************************************************"

sudo apt-get install gnupg -y
sleep 5
echo "########********************************************************"

wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
sleep 5
echo "#########*******************************************************"


# Print that the script is running
echo "Added the keys to the system"

# run as command echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sleep 5

echo "##########******************************************************"

sudo apt-get install -y mongodb-org
sleep 5
echo "###########*****************************************************"

sudo systemctl daemon-reload
sleep 5
echo "############****************************************************"

sudo systemctl start mongod
sleep 5
echo "##############**************************************************"

echo "MongoDB, And nginx started"



echo "################************************************************"

sudo sed -i "s/thisIsPassword/$DatabasePassword/g" "$pathToReplace/Mongo/init.js"

sleep 2

# Join mongo command and type use admin
# sudo mongo
sudo mongosh < "$pathToReplace/Mongo/init.js"
echo "###########################*************************************"
sleep 2



sudo cp "$pathToReplace/Nginx/nginx.conf" "/etc/nginx/nginx.conf"

sleep 5

echo "$pathToReplace/dashboard"
echo "$pathToReplace/Nginx/nginx.conf"

sleep 5

echo "#############################***********************************"

echo "###############################*********************************"
sleep 2
# Replace the host that is thisIsAHost. in the nginx.conf file
sudo sed -i "s/thisIsAHost/$host/g" "/etc/nginx/nginx.conf"

sleep 5

EscapedPathToReplace=$(echo $pathToReplace | sed 's/\//\\\//g')

sudo sed -i -e "s/pathToReplace/$EscapedPathToReplace/g" "/etc/nginx/nginx.conf"

echo "s/pathToReplace/$pathToReplace/g"
sleep 2

sudo cp "$pathToReplace/Mongo/mongod.conf" "/etc/mongod.conf"

echo "##################################******************************"
sleep 2

sudo sed -i "s/thisIsAHost/$host/g" "$pathToReplace/App/processes.json"

sleep 2

sudo sed -i "s/thisIsClientJWT_SECRET/$ClientJWT_SECRET/g" "$pathToReplace/App/processes.json"

sleep 2

sudo sed -i "s/thisIsAdminJWT_SECRET/$AdminJWT_SECRET/g" "$pathToReplace/App/processes.json"

sleep 2

sudo sed -i "s/thisIsPassword/$DatabasePassword/g" "$pathToReplace/App/processes.json"


sleep 2
#nproc --all Command will get the number of cores in the system, Get it in a variable
nproc=$(nproc --all)
sleep 1
#convert nproc into integer if its not, Then subtract 3 from it as number
nproc=$((nproc))
sleep 1
# If nproc is less than 2 then it will be set to 1
if [ $nproc -lt 2 ]; then
    nproc=1
fi
sleep 1
echo $nproc

sudo sed -i "s/InstanceNumber/$nproc/g" "$pathToReplace/App/processes.json"

echo "###################################*****************************"
sleep 2
# restart nginx
sudo service nginx restart

echo "#####################################***************************"
sleep 2
sudo service mongod restart

echo "#######################################*************************"
sleep 2

# run sudo npm install -g pm2 n
sudo npm install -g pm2 n
sleep 2
# run sudo n stable
sudo n stable
sleep 2

cd "$pathToReplace/App"
sudo npm i
sleep 2
sudo npm i cors dotenv express geoip-country got helmet mime-db mongodb morgan request-ip path

sleep 3

pm2 stop all

sleep 3
pm2 del all

sleep 2

# Output the server is ready to start
echo "Server is ready to start"

echo "###########################################*********************"
sleep 2

# Run command pm2 start processes.json, Inside the folder App
pm2 start "$pathToReplace/App/processes.json"

echo "##################################################**************"
sleep 2

echo "################################################################"


# output, To check the logs please run, pm2 log 0
echo "To check the logs please run, pm2 log 0"
