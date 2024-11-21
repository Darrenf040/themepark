# Themepark Management 
[Web App Link](https://gleaming-lokum-158537.netlify.app)
## Project description 

Our themepark management web app has 3 different roles for users to manage and be apart of our themepark 

## Customers
- Customers can view details about the park, buy tickets for their next visit, and register/login an account with us to manage their tickets. 
- Customer login is required to buy tickets. 
- if you are logged in as an admin or employee you are unable to buy tickets, you must register and login as a customer

## Employee
- Our Employee dashboard requires employees login using their employee email and password. 
- Employees main role in the dashboard is to perform database operations such as create, read, update, delete (soft delete).
- The employees are able to also view more park information such as ride popularity, upcoming events, and upcoming maintenance on park rides for our technicians.   

## Admin
- Just like employees, admins are required to login using their username and password.
- Admins have access to reports of the park that are generated based on filters from the user interface.
- Admins are able to perform data entry to create, update, read, delete new employees.
- Admins are also in charge of setting park operation days.
- The park operations days require the admins to create a park day, and the weather that day will have. 
- The Admins are able to view more park details such as capacity, which is dependent on the weather type and opening/closing time (constant time).
- Admins are also able to edit the park operation days.
- The last thing admins are able to do is view the park visits and ticket availibility.

## Installation & Setup
### Prerequisites
-- Ensure node.js is installed on your system.<br>
-- MySQL server set up on your system<br>
-- A package manager like npm or yarn.<br>
## Setup steps 
1. **Fork and Clone the Repository**  
```bash 
git clone https://github.com/your-repo
```
2. **Open Project in code editor**
Navigate into the project's root folder in working directory of a code editor <br>
3. **install frontend dependencies**
```bash 
cd frontend 
npm install
```
4. **install backend dependencies**
 ```bash
cd backend
npm install
```
## Technology Used

- **Frontend**: React.js
- **Backend**: Node.js
- **Database**: MySQL

- **Hosting**:
  - **Database**: Azure Database for MySQL
  - **Frontend**: Netlify
  - **Backend**: Render

  
## Environment Variables
Define the following environment variables in your backend `.env` file:

```plaintext
DB_HOST             # Database host

DB_USER             # Database username

DB_PASSWORD         # Database password

DB_NAME             # Database name

DB_PORT             # Database port

DB_SSL_CERT         # SSL certificate (if required by your database host)

ACCESS_TOKEN_SECRET # Secret key for generating access tokens
```

# Database design 
[Database Schema](https://drive.google.com/file/d/1kFCGiRiFf-O_fZnsMHOMbAG5TTLdTte1/view?usp=sharing)

## Scripts 
### start backend server
```npm run dev```

### start frontend server
```npm run dev```
# Admin Dashboard
![image](https://github.com/user-attachments/assets/7bdd5290-9f79-4c3a-86ce-49522fa8339f)
![image](https://github.com/user-attachments/assets/95a5ca13-a02f-497c-99ae-7ff93fb462fd)
![image](https://github.com/user-attachments/assets/d3ce42c7-6103-414c-86bc-74adbc58da00)
![image](https://github.com/user-attachments/assets/8006bb5f-f3fa-4169-9aa9-d6bc2156069b)
![image](https://github.com/user-attachments/assets/e84ff8e6-5489-488c-b636-a5f2db6b0f13)
# Employee Dashboard
![image](https://github.com/user-attachments/assets/dbfb35b3-9074-4e20-b025-f609eb1d971c)
![image](https://github.com/user-attachments/assets/2d5bd372-d183-46a0-a819-a92d7add2d01)
![image](https://github.com/user-attachments/assets/0b427d40-41b1-41f3-8bbc-0453de79b626)
![image](https://github.com/user-attachments/assets/acb23085-7b4a-4c73-a4ad-808f18341c69)








