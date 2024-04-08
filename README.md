# coding-challenge
Coding Challenge for Krikey AI

# Question 1
Answers to the questions 1 sql theories are in the question1.sql file

# Question 2
The API endpoint for question 2 is in coding-challenge/backend/server/index.js with comments to explain
modifications and optimizations 

# Question 3
The frontend for the small webpage is in coding-challenge/src folder with comments to explain code decisions. 
The website is hosted (only the frontend) on https://main--spiffy-figolla-ac687c.netlify.app/

# How to test code locally 
- cd into coding-challenge/backend
- npm install 
- npm start
- cd into coding-challenge
- npm install
- npm run dev
- Make sure the local server is running on http://localhost:5173/ (vite will default to this unless you are running multiple vite server instances)
- Open http://localhost:5173/ in a browser


## Using the web app
- Entering a valid team members name (like John Doe or Emily Taylor) or no team member, then pressing search or hitting enter
 will load the team member list 
- Entering a name that is not in the list will result in an error message
- Once the list is displayed, pressing the back arrow on the list will bring the user back to the search
- All of the other elements of the UI are purely frontend and do not have any functionality 

### How I deployed the web page
I used the free hosting service Netlify to look at my dist folder for this GitHub branch and gave it the command `npm run build` for starting the application. Unfortunately, Netlify does not supporting hosting databases so I explain in my app.jsx my work around for this. I use a dummy data version for the frontend of the site hosted on Netlify but I used a real database and API endpoint approach for the backend when the site is being run locally.