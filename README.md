# Serverless AWS program

This repository contains a simple music subscription application implemented to practise AWS cloud services **(DynamoDB, S3, EC2, Lambda, API Gateway)**

Scripts were written using AWS SDK for Java to create and upload song items to DynamoDB and images to S3.

It features a barebones frontend written in react.

Backend functionality is serverless, implemented using AWS SDK for Python (boto3) with Lambda and triggered by AWS API Gateway. REST APIs were created to allow users register/login, add/remove song subscriptions, query songs.

Application was fully hosted on nginx and run on EC2.

AWS services were utilised with a free learners account.
