# AccrualifyAssignment
Take-Home 

#Install Instructions For Local Hosting

1) In terminal, get into client directory
2) Run 'npm install' | 'yarn install' for the 'client' files & dependencies to install depedencies from package.json file 
3) After installing, run npm start for dev environment

4) In terminal, get into server directory
5) Run 'pip3 install -r requirements.txt' to install dependencies for the server
6) Before running with 'python app.py', ensure you specify a port number like 'app.run(port=5000)' for dev. 

#Important Notes 
- The API_BASE_URL .env variable in the client folder corresponds to the Flask url representing your server 

- The DB_URL in the server folder corresponds to a database URI used with the ORM SQLAlchemy. 

- The TOKEN_KEY corresponds to the JWT token you personally create | generate.