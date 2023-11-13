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

4. Run the application locally and get to see all the amazing contents

   ```bash
   npm run dev
   ```

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

4. Run the application using pm2

   ```bash
   cd backend
   pm2 start server.ts
   ```
