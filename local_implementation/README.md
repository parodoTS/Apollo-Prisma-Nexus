# Local test:
This folder contains the files used to test the app in a local environment.

## Steps to launch the app:

 1. Install dependencies: 

 `npm install`

 2. It uses a PostgreSQL database to store the data, so you firstly need an instance running (for example in your local computer) and generate a file ".env" with its connection info. For PostgreSQL, it looks like: 

  `DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public"` 

 so Prisma can connect to it.
 
 3. Migrate the DB using Prisma: 

 `npx prisma migrate dev`

 This command will also generate the **"@prisma/client"** neccesary for our app and store it to node_modules.
 
 4. Run the app: 

 `npm run dev`

 It will launch the server using "nodemon" so you can make changes and the server will be restarted automatically.


 ![image.png](./image.png)

 ### Susbscription with Postman:

  ![Captura2.PNG](./Captura2.PNG)
 
