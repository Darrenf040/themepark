# Themepark Management 

## Project description 

Our themepark management web app has 3 different roles for users to manage and be apart of our themepark 

## Customers
Customers can view details about the park, buy tickets for their next visit, and register/login an account with us to keep track of your tickets. customer login is required to buy tickets. if you are logged in as an admin or employee you are unable to buy tickets, you must register and login 

## Employee
Our Employee dashboard requires employees login using their employee email and password. Employees main role in the dashboard is to perform database operations such as create, read, update, delete (soft delete). The employees are able to also view more park information such as ride popularity, upcoming events, and upcoming maintenance on park rides for our technicians.   

## Admin
Just like employees, admins are required to login using their username and password. Admins have access to reports of the park that are generated based on filters from the user interface. Admins are able to perform data entry to create, update, read, delete new employees. Admins are also in charge of setting park operation days. The park operations days require the admins to create a park day, and the weather that day will have. The Admins are able to view more park details such as capacity, which is dependent on the weather type and opening/closing time (constant time). Admins are also able to edit the park operation days. The last thing admins are able to do is view the park visits and ticket availibility.

# Installation & Setup
## Prerequisites
Node.js installed on your system.<br>
MySQL server set up on your system<br>
A package manager like npm or yarn.<br>
## setup steps 
1: fork the respository <br>
2: clone the forked repository <br>
```git clone https://github.com/your-repo```<br>
3: go into the root project folder in working directory of a code editor <br>
4: install frontend dependencies<br>
```cd frontend``` <br>
```npm install```<br>
5: install backend dependencies <br>
```cd backend``` <br>
```npm install```  <br>


# Technology used 
Frontend: React.js <br>
backend: node.js<br>
Database: mysql<br>
hosting:<br>
    database:azure database for mysql<br>
    frontend: netlify<br>
    backend: render<br>

# env variables 
## backend variables
DB_HOST
DB_USER
DB_PASSWORD
DB_NAME
DB_PORT
DB_SSL_CERT (needed if db host requires it)
ACCESS_TOKEN_SECRET

# database design 
Themepark Schema.pdf

# scripts 
## start backend server
```npm run dev```

## start frontend server
```npm run dev```


