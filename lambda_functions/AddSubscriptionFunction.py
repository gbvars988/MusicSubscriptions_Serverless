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
        
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('subscription')  
    
    
    user_email = event['email']
    music_title = event['musictitle']
    
    
    response = table.put_item(
        Item={
            'email': user_email,
            'musictitle': music_title
        }
    )
    
    return {
        'statusCode': 200,
        'body': 'Subscription added successfully',
      'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST',              
        }
    }
