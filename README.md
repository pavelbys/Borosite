## Deployment
To deploy the website, you have to be logged into the heroku account by running:

    heroku login
on the command line and putting in the email and password.
Assuming some changes where made to the website and you would like to put them online, run the following command:

	git push heroku master

Any changes made should always be put on Github as well (weather they are live or not), by running:

    git push origin master

## Running the website
The directory "public" contains all files related to the website content. 
To run the website locally simply run:

    node app.js

from the project directory. Then open localhost:3000 to view the website.

## Setting Up
Requirements:
 - Node.js
 - Git
 - Heroku toolbelt

Once Node.js, Git and Heroku are installed run, install Gulp (a nodejs libary by running:

    npm install -g gulp
Clone the code from github by running:

    git clone https://github.com/pavelbys/Borosite.git
Once the code has been cloned run the following command to install the required libraries:   
 
    npm install

## File structure
---

 - app.js: nodejs code for running the website
 - .gitignore: tells github which files should be ignored and not saved (eg the libaries that are installed when setting up)
 - gulpfile.js: when running "gulp default" this file has the code for optimizing the "public" directory and creating the "dist" directory 
 - Procfile: tells heroku where what command should be run to fire up the website
