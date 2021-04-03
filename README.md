# ProHealer
This platform aims to help people facing mental health issues due to the lockdown, by providing a suite of functions such as an A.I. powered diagnostic quiz, accompanied by fully functional discussion forums that allow people to open up anonymously and also helping people who really need professional help by connecting then to the certified and verified psychiatrists on our platform through a one-on-one video session, or recommend them doctors closest to them based on their location.
### LINK TO DEMO: https://youtu.be/kF2s0bGUDaI

## Runnig/Viewing the project: 
The front-end is deployed to netlify and the backend to heroku: https://dazzling-poincare-a6281f.netlify.app/#/home which is completely functional , expect for the A.I. powered Quizes.
Due to several reasons we were not able to deploy the flask-server(for the A.I. powered quiz), so we ran it on Google Colab using flask-ngrok.
LINK TO GOOGLE COLAB: https://colab.research.google.com/drive/1JRds6Va7KnmKXPQkDKZhGwQr2XHVi7jh?usp=sharing

#### Running the project locally:
- Install node.js and npm on the system 
- To install angular-cli run: npm install angular-cli or checkout how to install angular on your OS
- Clone the project and run the following commands inside the Frontend directory: 
    - npm install
    - ng serve
- Now open up Google Colab Notebook(link above) and run the first cell, copy the link from the output which looks like this http://*******.ngrok.io 
- Find the consult-ai.component.ts file and replace the variable "flask_server_url" with the link above and save the file.
- Now the app is completely functional and running at http://localhost:4200/
