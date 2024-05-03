import boto3

def lambda_handler(event, context):
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,DELETE',
                'Access-Control-Max-Age': '86400'
            },
            'body': None
        }

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('subscription')

    
    user_email = event['email']
    music_title = event['musictitle']

    print(f"Attempting to delete: email={user_email}, musictitle={music_title}")

    
    try:
        response = table.delete_item( #must specifcy primary key to delete_item
            Key={
                'email': user_email,
                'musictitle': music_title
            },
            ConditionExpression="attribute_exists(email) AND attribute_exists(musictitle)",
            ReturnValues="ALL_OLD"
        )
        print("Delete response:", response)
        if 'Attributes' in response:
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,DELETE',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                'body': 'Subscription successfully removed'
            }
        else:
            return {
                'statusCode': 404,
                'body': 'No such subscription found to delete'
            }
    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': 'Error removing subscription'
        }
