# FTS Admin Dashboard

Designed and developed by our amazing developers in the Tech team :)

## Stuff to manage

1. DigitalOcean droplet (Our main server to host our official website and admin dashboard)

2. NameCheap domain (Our main service provider for our domain name - utscfintech.ca)

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

0. SSH into the remote DigitalOcean server (Note: ask VP of Tech to add your ssh key to DigitalOcean if you haven't do so yet)

   ```bash
   ssh root@utscfintech.ca
   ```

1. Prerequisites (only need to do once when you are setting up with a new server)

   - Install nodejs & npm
     ```bash
     sudo apt install nodejs
     sudo apt install npm
     ```
   - Install pm2 & bun with npm
     ```bash
     npm install pm2 -g
     npm install bun -g
     ```
   - Setup UFW firewall
     ```bash
     sudo ufw enable
     sudo ufw status
     # (Port 22)
     sudo ufw allow ssh
     #(Port 80)
     sudo ufw allow http 
     #(Port 443)
     sudo ufw allow https
     ```
   - Configure NGINX
     ```bash
     # Install NGINX
     sudo apt install nginx
     ```

     ```bash
     # Configure config file
     sudo nano /etc/nginx/sites-available/default

     # Paste the following lines into the file
     server {
        listen 80;
        listen [::]:80;

        root /var/www/html;

        index index.html index.htm index.nginx-debian.html;

        server_name utscfintech.ca www.utscfintech.ca;

        location / {
                try_files $uri $uri/ =404;
        }

        location /admin {
                proxy_pass http://localhost:5001;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
        }
     }
     ```

     ```bash
     # Test for errors and enable your new configuration
     sudo nginx -t 
     sudo systemctl restart nginx
     ```
   - Add swap space for production build: [link](https://www.digitalocean.com/community/tutorials/how-to-add-swap-space-on-ubuntu-22-04)
   - Generate a SSL certicate with Let's Encrypt: [link](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-22-04)

2. Navigate to the admin dashboard repo and pull the latest main branch with git

   ```bash
   cd admin-dashboard
   git pull
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

4. Setup .env file for the project (only if stuffs in .env have changed, and ask VP of Tech for the .env files)

   ```bash
   cd frontend
   nano .env
   ```

   ```bash
   cd backend
   nano .env
   ```

5. Navigate to the frontend folder and build the project

   ```bash
   cd frontend
   npm run build
   ```

   In case it pops up an error showing heap space is exceeded, run the below command before building project

   ```bash
   export NODE_OPTIONS="--max-old-space-size=8192"
   ```

6. Delete the current running admin-dashboard service in pm2

   ```bash
   pm2 delete admin-dashboard
   ```

7. Run the application using pm2

   ```bash
   cd backend
   pm2 start server.ts --name admin-dashboard
   ```
