import boto3

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
    username = event['user_name']
    password = event['password']
    
    dynamo_client = boto3.resource('dynamodb')
    table = dynamo_client.Table("login")
    
    response = table.get_item(Key={'email': email})
    user = response.get('Item')
    
    if user:
        # Email exists
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body':"Email already exists"
        }
    else:
        table.put_item(Item={'email': email, 'user_name': username, 'password': password})
        return {
            'statusCode': 201,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': "Registration successful"
        }
