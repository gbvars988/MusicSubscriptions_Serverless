package com.amazonaws.task1and2;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.SdkClientException;
import com.amazonaws.auth.profile.ProfileCredentialsProvider;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.CreateBucketRequest;
import com.amazonaws.services.s3.model.GetBucketLocationRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;


import java.io.File;
import java.io.InputStream;
import java.io.IOException;
import java.net.URL;
import java.net.HttpURLConnection;

public class UploadImagesS3 {

    public static void main(String[] args) throws IOException {

        // 1. Create new bucket for artist images
        Regions clientRegion = Regions.US_EAST_1;
        String bucketName = "artist-images-s3436258";

        try {
            AmazonS3 s3Client = AmazonS3ClientBuilder.standard()
                    .withCredentials(new ProfileCredentialsProvider())
                    .withRegion(clientRegion)
                    .build();

            if (!s3Client.doesBucketExistV2(bucketName)) {
                s3Client.createBucket(new CreateBucketRequest(bucketName));

                String bucketLocation = s3Client.getBucketLocation(new GetBucketLocationRequest(bucketName));
                System.out.println("Bucket location: " + bucketLocation);
            }
        } catch (AmazonServiceException e) {
            e.printStackTrace();
        } catch (SdkClientException e) {
            e.printStackTrace();
        }

        //2. Fetch images from "img_url" and upload to S3

        AmazonS3 s3Client = AmazonS3ClientBuilder.standard()
                .withCredentials(new ProfileCredentialsProvider())
                .withRegion(clientRegion)
                .build();

        JsonParser parser = new JsonFactory().createParser(new File("a1.json"));
        JsonNode rootNode = new ObjectMapper().readTree(parser);
        JsonNode songNode = rootNode.path("songs");

        if (songNode.isArray()) {
            for (JsonNode node : songNode) {
                ObjectNode currNode = (ObjectNode) node;
                String img_url = currNode.path("img_url").asText();
                String fileObjKeyName = currNode.path("artist").asText();

                try {
                    URL url = new URL(img_url);
                    HttpURLConnection httpURLConnection = (HttpURLConnection) url.openConnection();
                    httpURLConnection.setRequestMethod("GET");
                    httpURLConnection.connect();

                    InputStream inputStream = httpURLConnection.getInputStream();
                    ObjectMetadata metadata = new ObjectMetadata();
                    metadata.setContentLength(httpURLConnection.getContentLengthLong());
                    s3Client.putObject(new PutObjectRequest(bucketName, fileObjKeyName, inputStream, metadata));
                    System.out.println("Image uploaded successfully to S3: " + fileObjKeyName);


                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
