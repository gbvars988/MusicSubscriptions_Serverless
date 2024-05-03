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
    music_table = dynamodb.Table('music')
    subscription_table = dynamodb.Table('subscription')
    
    user_email = event['email']
    
    
    response = subscription_table.query(
        KeyConditionExpression='email = :email', # :email is a placeholder, this line defines the primary key (optionally sort key as well)
        ExpressionAttributeValues={':email': user_email} # placeholder defined. 
    )
    
    subscribed_items = response['Items']
    detailed_items = []
    

    for item in subscribed_items:
        print(item['musictitle'])
        music_response = music_table.get_item(
            Key={
                'title': item['musictitle']
            }
        )
        music_item = music_response.get('Item')
        if music_item:
            s3_client = boto3.client('s3')
            bucket_name = 'artist-images-s3436258'
            pre_signed_url = s3_client.generate_presigned_url('get_object',
                Params={'Bucket': bucket_name, 'Key': music_item['artist']}, ExpiresIn=3600)
            music_item['presigned_image_url'] = pre_signed_url
            detailed_items.append(music_item)
    
    return {
        'statusCode': 200,
        'body': detailed_items,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    }