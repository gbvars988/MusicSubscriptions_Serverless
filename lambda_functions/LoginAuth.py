import boto3
import json

def lambda_handler(event, context):
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST',
                'Access-Control-Max-Age': '86400'  
            },
            'body': None
        }
    
    email = event['email']
    password = event['password']
    
    dynamo_client = boto3.resource('dynamodb')
    table = dynamo_client.Table("login")
    
    response = table.get_item(Key={'email': email})
    user = response.get('Item', None)

    if user and user['password'] == password:
        # Credentials are correct
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': {
                'message': "Login successful",
                'username': user['user_name']
            }
        }
    else:
        # Credentials are incorrect or user doesn't exist
        return {
            'statusCode': 401,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': "Invalid credentials"
        }

