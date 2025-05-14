# WTWR (What to Wear?): Back End
# SE_PROJECT_EXPRESS - WTWR BACK END APPLICATION

The back-end project is focused on creating a server for the WTWR application. You’ll gain a deeper understanding of how to work with databases, set up security and testing, and deploy web applications on a remote machine. The eventual goal is to create a server with an API and user authorization.

## Running the Project

`npm run start` — to launch the server

`npm run dev` — to launch the server with the hot reload feature

### Testing

Before committing your code, make sure you edit the file `sprint.txt` in the root folder. The file `sprint.txt` should contain the number of the sprint you're currently working on. For ex. 12

## PHASE II

Objective
This phase demonstrates the basics of authorization and how to secure the server that hosts your applications. Now it's time to implement this knowledge in the “WTWR” project.

At this stage, you'll:

-Expand the user schema with an email and password
-Create routes and controllers for signing up and signing in
-Create routes and controllers for modifying the current user data
-Protect existing routes

## Deployment phase: Deploying and hosting the cloud

This phase is aimed to create a remote server using google cloud services to apply our code to a virtual machine. Since before this phase, my server for this code was only accessible via IP address for a limited time when the server is up and running. For continuous online process management and avoiding crash reboot I have utilized Pm2 and created a subdomain registered under a public domain for both front and backend.

Technologies and techniques used in this portion includes:
-Google Cloud Services
-DNS
-PM2
-NginX
-Certbot( HTTPS traffic will be encrypted using SSL)
