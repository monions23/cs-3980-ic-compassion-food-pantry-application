# cs-3980-ic-compassion-food-pantry-application

## Project Description

Talk about IC Compassion application goals and stuff here


## Overview

This backend powers the Food Pantry Management System, providing APIs for:

- User authentication & authorization
- Pantry record tracking
- Inventory (stock) management
- Scheduling system
- File upload/download system

Built with FastAPI, MongoDB, and Beanie, it follows a router-based architecture.

## Tech Stack
- Framework: FastAPI
- Database: MongoDB
- Object-Document Mapper: Beanie (with Motor and Pydantic)
- Auth: JWT (JSON Web Tokens)
- Server: Uvicorn
- HTML5, CSS3, JavaScript 
- React 
- Chart.js – data visualization (trends and stock graphs)
- Flatpickr – interactive scheduling calendar
- Fetch API – Frontends backend communication
- LocalStorage – JWT token storage

## Set Up

After cloning this repository, create a virtual environment in your local project folder. Enter the following terminal command:

```
python -m venv venv
```

To activate the venv, run the following command on MacOS:

```
source venv/bin/activate
```

Or, on Windows, run:

```
.\venv\Scripts\activate
```

Next, it should be noted project uses FastAPI and Uvicorn. All necessary libraries are listed in `requirements.txt`. To install them, run the following command:

```
pip install -r requirements.txt
```
## FRONTEND
### Folder Structure
frontend-react/ <br>
|──
|──


### Key Features
- Dynamic dashboard with sidebar navigation
- Interactive scheduling calendar using Flatpickr
- Data visualization powered by Chart.js
- File upload and download system
- Print-friendly archive page
<br>

### UI/UX Design Decisions
- Clean dashboard layout with clear navigation
- Separation of admin and user views for usability
- Visual feedback for user actions (loading, errors)
- The UI was modeled after the IC Compassion website to create a familiar experience for users, reducing the learning curve and improving accessibility for both the community and volunteers

### PAGES

### Sign up and Log in Page
![Sign up and Log in Page Screenshot](screenshots/sign-up-in-demo.gif)
<br>

### Main Pages
### Welcome Page (Logged out main page)
![Logged out Welcome Screen Screenshot](screenshots/Main-logged-out-view.jpg)
<br>

### User Main Page (Logged in User)
#### Features
- ![Main BasicUser Page- Scheduler](screenshots/scheduler-demo.gif)
- Scheduling Time to go into the Pantry
- This uses Flatpickr to gray out the other days in the calendar
<br> <br>

- ![Main BasicUser Page- Sidebar](screenshots/Main-Basic-Page-Sidebar-View.jpg)
- Dashboard links and sidebar

<br>

### Admin Main Page (Logged in Admin)
![Main Admin Page- demo](screenshots/admin-main-demo.gif)
- A table to see how many people have signed up for each time slot. This greatly helps the pantry know how the day will go and how many volunteers they may need.
 - It automatically goes only for the time slot of the next wednesday when the Pantry opens 
- The Admin has full range to all of the pages in the dashboard and on the side menu
<br>

### Account Page Admin View
![Account Page View](screenshots/account-view.jpg)
- This is the Admin view of the Account Page. It has a table on the bottom to manage accounts that have signed up. Using username the Admin can update a certain user easily if they are a volunteer and need access to the Pantry to check out community members
- Basic view doesnt have the bottom table but it has the Account information and settings. 
<br>

### Downloads Page
![Basic Files Page Demo](screenshots/basic-files-demo.gif)
- Basic User (Above)
 - Can download files cant delete or upload
 - We were told this was for brochures in different languages that show how to use the pantry
 <br>
 
![Admin Files Page Demo](screenshots/files-demo.gif)
- Admin (Above)
 - Can download files, delete and upload 

<br>

### Restricted to Admin veiw pages
### Pantry 
![Admin Pantry Page Demo](screenshots/pantry-demo.gif)
- Volunteers can ask the community at the door their name and how many people are in their family. That is inputted and shown on the side in case of mistakes they can easily redo it. 
- This information is stored in pantry_record, and is used to calculate how many returning visitors depending on name and how many families the pantry has supported. This information is logged in Archive and displayed on the Trends page for easy viewing and checking.
<br>

### Archive
![Admin Archive Page View](screenshots/Archive-view.jpg)
- Shows the time stamped logs of the Pantry without names. 
- Print button for printing records
<br>

![Admin Archive Page Print example](screenshots/Archive-print-example.jpg)
- Above is an example of printing the information

<br>

### Trends
![Admin Trends Page Demo](screenshots/trends-demo-1.gif)
- This uses chart.js to create the graphs
- This is updated with ifnormation from the pantry_records, determining distict visitors versus repeated. It is displayed in a graph that can change shapes from showing how many visitors to the pantry versus how many people supported by the pantry and by month or by year. 
- This also has a search feature to go back to previous months to be able to compare data from the past.
<br>

### Stock
![Admin Stock Page Demo](screenshots/Stock-demo.gif)
- This uses chart.js to create the graphs
- This is a side feature where:
 - The pantry can update its stock whenever they get new shipments or edit existing stock and be able to search on the side how much they have in storage so they dont have to go looking. 
 - Target stock is for now inputted but with enough data on how items run out the idea was to make it the ammount desired by the community.
<br>

### Frontend Setup
HTML/CSS/JS Version
- Navigate to the frontend/ folder
- Open main-logged-out.html in your browser

React Version 
```
cd frontend-react
npm install
npm run dev
```


## BACKEND
### Folder Structure
backend/<br>
│── auth/  # Authentication (JWT, password hashing)<br>
│── models/                # Beanie models (User, PantryRecord, etc.)
<br> 
│── routers/              # API route handlers<br>
│── database.py           # MongoDB connection setup<br> 
│── main.py                # FastAPI app entry point<br>
│── tests/                # Pytest test suite<br> 
│── uploads/               # Stored uploaded files<br>


### Authentication
Uses JWT-based authentication. Token must be included in headers: Authorization: Bearer <access_token> <br>
Roles:
- BasicUser – standard user access
- SuperAdmin – full system access (admin privileges)

### API Models

Users <br>
![Users Models Code Snippet](screenshots/user_models.png)

Pantry Records
![Pantry Records Models Code Snippet](screenshots/pantry_record_models.png)

Stock
![Stock Models Code Snippet](screenshots/stock_models.png)

Scheduling
![Scheduling Models Code Snippet](screenshots/schedule_model.png)

Files<br>
![Files Models Code Snippet](screenshots/files_model.png)


### API Routes
Stored as collections in our food_pantry_db

Authentication
- Users can sign up and sign in
- Users can access only their own account 
- Users can change password only when signed in
- Users can get an email sent to them to reset their password and update it

<br> 

Users
- Change email (authenticated, user can only change their own)
- Get current user (authenticated, user can only change their own)
- Admin: view all users (authenticated, only admin can view all)
- Admin: update user roles (authenticated, only admin can view all)

<br>

Pantry Records (admin only access)
- Create pantry visit records
- View all records
- Update records
- Delete records

<br>

Stock (admin only access)
- Track inventory items
- Create new stock entries
- Update quantities
- Delete stock entries

<br>

Scheduling
- Users schedule appointments (can only schedule appointments for themselves)
- Users view their own schedule (/me)
- Admin: view all schedules
- Admin: update schedules 
- Admin: delete schedules


<br>

Files
- Users can only upload files when signed in 
- Users can view and download files when signed in 
- Users can delete their own files
- Admin: upload files (visible in all accounts)
- Admin: can delete any file

## MAJOR FEATURES