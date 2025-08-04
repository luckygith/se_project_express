# WTWR (What to Wear?) – Back End

The WTWR (What to Wear?) back-end project is focused on creating a secure server and RESTful API for the WTWR application. This project demonstrates working with databases, implementing authorization, setting up server security, and deploying applications to a cloud environment.

The goal is to create a robust back-end service that handles user authentication, protects routes, and reliably serves the WTWR front-end application.

# Table of Contents

Overview
Project Features
Technologies Used
Implementation
Running the Project
Screenshots / API Demo
Results
Future Improvements

# Overview

The WTWR back-end application powers the server side of the project. It is designed to handle API requests, manage users, and process clothing item data. This also implements user authorization and protected routes to ensure secure interactions.

Deployed using Google Cloud Services with SSL and process management for 24/7 uptime.

# Domain and Endpoints:

[api.wtwr.bnene.com](https://api.wtwr.bnene.com)
[wtwr.bnene.com](https://wtwr.bnene.com)
[www.wtwr.bnene.com](https://www.wtwr.bnene.com)

# Project Features

- REST API with CRUD operations for WTWR app data

- User authentication and authorization (signup, login, protected routes)

- Secure server deployment with SSL certificates

- Cloud hosting with process management for reliable uptime

# Technologies Used

Node.js & Express.js for server and routing

MongoDB & Mongoose for database management

PM2 for process management

Nginx as a reverse proxy

Certbot (SSL) for HTTPS security

Google Cloud Services for remote hosting

DNS configuration for custom domain and subdomains

# Implementation

Phase I – Core Back-End Setup
Built a Node.js + Express server

Implemented initial routes and controllers

Connected to MongoDB for data storage

Phase II – Authorization and Security
Expanded user schema with email and password

Added signup and login routes

Created controllers to modify user data

Protected existing routes with JWT-based authorization

Deployment Phase – Hosting in the Cloud
Deployed the server to a Google Cloud VM

Configured Nginx reverse proxy and DNS for subdomains

Used PM2 for uptime and crash recovery

Secured traffic with SSL via Certbot

# Running the Project

Local development commands:

npm run start # Launches the server
npm run dev # Launches the server with hot reload

## Screenshots / API Demo

(Add screenshots of API testing or terminal output here, e.g., Postman calls or deployed site preview)

## Results

- Successfully deployed a fully functional back-end server with secure routes

- Achieved continuous uptime with PM2 and SSL-encrypted endpoints

- Completed Phase II authorization and security requirements

## Future Improvements

Add rate limiting and logging for enhanced security
Implement unit and integration testing for reliability
Explore CI/CD automation for faster deployment cycless
Add comprehensive API documentation for future developers
