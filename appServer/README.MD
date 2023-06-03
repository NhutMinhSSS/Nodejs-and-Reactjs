<!-- npm init --> 
<!-- install framework express --> npm install express
<!-- set up --> npm install nodemon --save-dev
<!-- install log--> npm i winston
<!-- install variable config --> npm i dotenv
<!-- install package Sequelize ORM  --> npm install --save sequelize
<!-- install driver mssql --> 

<!-->install json web token--> npm i jsonwebtoken

<!-- create file .env --> cp .env.example .env
<!-- Configure Env file according to mysql>
<!-- create database name is "class_room">
<!-- create tables into database--> npm run migration
<!-- start Server-->
<!-- use --> npm start

API Layout
check token 
    headers: {
    'Authorization': 'Bearer <your_token>'
  }
Login function
    -> route: domain/api/login
    client request [GET] json: {
        "email": email,
        "password": password
    }
    server response 
        - Status 200 || 400 || 404 || 500 json: {
                "result_message": message
            }
