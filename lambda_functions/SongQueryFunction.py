import boto3
from boto3.dynamodb.conditions import Key, And

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
    table = dynamodb.Table('music')
    

    s3_client = boto3.client('s3')
    bucket_name = 'artist-images-s3436258'
    
    title = event.get('title','')
    artist = event.get('artist','')
    year = event.get('year','')


    filter_expressions = []
    expression_attribute_values = {}
    expression_attribute_names = {}  # For reserved keyword 'Year'

    if title:
        filter_expressions.append("#t = :title")
        expression_attribute_values[":title"] = title
        expression_attribute_names["#t"] = "title"
    if artist:
        filter_expressions.append("#a = :artist")
        expression_attribute_values[":artist"] = artist
        expression_attribute_names["#a"] = "artist"
    if year:
        filter_expressions.append("#y = :year")
        expression_attribute_values[":year"] = year
        expression_attribute_names["#y"] = "year"

    # Combine all conditions with AND
    if filter_expressions:
        filter_expression = " AND ".join(filter_expressions)
        response = table.scan(
            FilterExpression=filter_expression,
            ExpressionAttributeValues=expression_attribute_values,
            ExpressionAttributeNames=expression_attribute_names
        )
        items = response.get('Items', [])
        

        for item in items:
            image_key = item.get('artist')  
            pre_signed_url = s3_client.generate_presigned_url('get_object', Params={'Bucket': bucket_name, 'Key': image_key}, ExpiresIn=3600)
            item['presigned_image_url'] = pre_signed_url
        
        return {
            'statusCode': 200,
            'body': items,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        }
    else:
        return {
            'statusCode': 400,
            'body': "Invalid query parameters",
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        }

