# How to Deploy a Next.js App on Render cloud with Docker

- Create Dockerfile and dockerignore inside the app 
- Connect the project with Github or gitlab 
- Create a web service on render 
- Connect the database to the web service 
- Deploy the app on render 

# More Details :- 

# MySQL Database Deployment Guide (TiDB & Render)

This guide explains how to host a free MySQL database using TiDB Cloud and connect it to your project on the Render platform.

## Step 1: Get a Free MySQL Database
We will use **TiDB Cloud** as it provides a powerful and free (Serverless) MySQL database.

1.  Go to [TiDB Cloud](https://tidbcloud.com/).
2.  Sign up for a new account (you can use your Google account for speed).
3.  After logging in, click on **Create Cluster**.
4.  Select the **Serverless** free plan (usually selected by default).
5.  Choose a Region close to you (e.g., Europe).
6.  Click **Create**.
7.  **Important:** A window will appear to create a password for the database. Write down a strong password and save it in a secure place as we will need it.
8.  After creation, click the **Connect** button (usually in the top corner).
9.  A connection window will appear. Select the **Prisma** tab (since we are using Prisma in the project) or **General**.
10. Copy the long URL shown. This is your `DATABASE_URL`.
    *   It will look something like this: `mysql://username:password@gateway.tidbcloud.com:4000/test?sslaccept=strict`
    *   **Note:** If the URL contains `[password]` or asterisks, replace them with the password you created in step 7.

## Step 2: Connect Database to Render
Now we will tell Render to use this new database.

1.  Go to your [Render Dashboard](https://dashboard.render.com/).
2.  Open your project (Web Service) that we created.
3.  From the side menu, select **Environment**.
4.  Find the `DATABASE_URL` variable.
5.  Click **Edit**, delete the old value, and paste the **long URL** you copied from TiDB in the previous step.
6.  Click **Save Changes**.

## Step 3: Database Migration
The new database is completely empty. We need to send the table design (Schema) from your code to it.

1.  On the same project page on Render, go to the **Shell** tab (in the side menu).
2.  Wait a moment until a black screen (terminal) appears and is ready for input.
3.  Copy and paste the following command there, then press Enter:
    ```bash
    npx prisma@6.0.1 migrate deploy
    ```
4.  If you see a green success message, it means the tables have been successfully created in the new database!
