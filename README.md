# FTS Admin Dashboard

Designed and developed by our amazing developers in the Tech team :)

## Run Guide

1. Clone the repo locally in your computer

   ```bash
   git clone git@github.com:UTSC-FinTech-Society/admin-dashboard.git
   ```

2. Navigate to the admin dashboard repo

   ```bash
   cd admin-dashboard
   ```

3. Install all the necessary dependencies with npm

   ```bash
   npm install
   ```

   Then, navigate to both the frontend and backend folder to install dependencies

   ```bash
   cd frontend
   npm install
   ```

   ```bash
   cd backend
   npm install
   ```

4. Build the project docker images and run the application locally in containers

   ```bash
   docker compose up
   ```

5. Create a user account in Postman for logging into the admin dashboard

   ```bash
   POST http://localhost:5001/api/admins

   {
      "username": USERNAME VALUE,
      "password": PASSWORD VALUE,
      "name": NAME VALUE,
      "position": POSITION VALUE
   }
   ```

6. Access http://localhost:4000 and login with the account info you have just created

## Deployment Guide

1. SSH into the remote DigitalOcean server (Note: ask VP of Tech to add your ssh key to DigitalOcean if you haven't do so yet)

   ```bash
   ssh root@utscfintech.ca
   ```

2. Navigate to the admin dashboard repo and pull the latest main branch with git

   ```bash
   cd admin-dashboard
   git pull
   ```

3. Navigate to the frontend folder and build the project

   ```bash
   cd frontend
   npm run build
   ```

   In case it pops up an error showing heap space is exceeded, run the below command before building project

   ```bash
   export NODE_OPTIONS="--max-old-space-size=8192"
   ```

4. Run the application using pm2

   ```bash
   cd backend
   pm2 start server.ts --name admin-dashboard
   ```
