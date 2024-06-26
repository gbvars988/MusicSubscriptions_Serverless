package com.amazonaws.task1and2;

import java.util.Arrays;

import com.amazonaws.auth.profile.ProfileCredentialsProvider;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.model.AttributeDefinition;
import com.amazonaws.services.dynamodbv2.model.KeySchemaElement;
import com.amazonaws.services.dynamodbv2.model.KeyType;
import com.amazonaws.services.dynamodbv2.model.ProvisionedThroughput;
import com.amazonaws.services.dynamodbv2.model.ScalarAttributeType;

public class CreateTableMusic {

    public static void main(String[] args) throws Exception {
        // Using DynamoDB Local:
//        AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard()
//                .withEndpointConfiguration(
//                        new AwsClientBuilder.EndpointConfiguration(
//                                "http://localhost:8000",
//                                Regions.US_EAST_1.getName()))
//                .build();

        // Using DynamoDB Web Service:
        AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard()
                .withRegion(Regions.US_EAST_1)
                .withCredentials(new ProfileCredentialsProvider("default"))
                .build();

        DynamoDB dynamoDB = new DynamoDB(client);

        String tableName = "music";

        try {
            System.out.println("Attempting to create table. Please wait...");
                    Table table = dynamoDB.createTable(tableName,
                            Arrays.asList(new KeySchemaElement("title", KeyType.HASH)),
                            Arrays.asList(new AttributeDefinition("title", ScalarAttributeType.S)),
                            new ProvisionedThroughput(10L, 10L));
            table.waitForActive();
            System.out.println("Success. Table status: " + table.getDescription().getTableStatus());

        } catch (Exception e) {
            System.err.println("Unable to create table: ");
            System.err.println(e.getMessage());
        }

    }

}
