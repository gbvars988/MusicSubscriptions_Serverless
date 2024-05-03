package com.amazonaws.task1and2;

import java.io.File;

import com.amazonaws.auth.profile.ProfileCredentialsProvider;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class LoadDataMusic {

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
        Table table = dynamoDB.getTable(tableName);

        JsonParser parser = new JsonFactory().createParser(new File("a1.json"));

        JsonNode rootNode = new ObjectMapper().readTree(parser);
        JsonNode songNode = rootNode.path("songs");

        ObjectNode currentNode;

        if (songNode.isArray()) {
            for (JsonNode node : songNode) {
                currentNode = (ObjectNode) node;

                String title = currentNode.path("title").asText();
                String artist = currentNode.path("artist").asText();
                String year = currentNode.path("year").asText();
                String web_url = currentNode.path("web_url").asText();
                String img_url = currentNode.path("img_url").asText();


                try {
                    table.putItem(new Item().withPrimaryKey("title", title)
                            .withString("artist", artist)
                            .withString("year", year)
                            .withString("web_url", web_url)
                            .withString("img_url", img_url));

                    System.out.println("PutItem succeeded: " + title + " " + artist);
                } catch (Exception e) {
                    System.err.println("Unable to add movie: " + title + " " + artist);
                    System.err.println(e.getMessage());
                    break;
                }
            }
        } else {
            System.err.println("'songs' is not an array or is missing");
        }

        parser.close();
    }
}

