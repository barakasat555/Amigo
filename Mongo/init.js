use admin
db.createUser( { user: "admin", pwd: "thisIsPassword", roles: [ "root" ] } )
use Main
db.createCollection("test")
