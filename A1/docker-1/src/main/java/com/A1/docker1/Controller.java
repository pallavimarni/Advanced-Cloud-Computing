package com.A1.docker1;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

@RestController
public class Controller {
    @PostMapping(value = "/calculate")
    public String validate(@RequestBody Input input) {

        //Logic to check if JSON input is valid
        if (input.getFile() == null || input.getFile() == "null" || input.getFile() == "") {
            input.setProduct("Invalid JSON input.");
            return input.errortoString();
        }


        //Logic to check if file exists
        String filePath = "/app/"+input.getFile().toString();
        File file = new File(filePath);
        if (!file.exists()) {
            input.setProduct("File not found.");
            return input.errortoString();
        }

        //Logic to check if input file is in CSV format

        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = br.readLine()) != null) {

                int commaCount = line.length() - line.replace(",", "").length();
                if (commaCount < 1) {
                    input.setProduct("Input file not in CSV format.");
                    input.errortoString();
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("An error occurred while reading the file.");
        }

        String url = "http://docker2:6001/cal";
        String payload = "{\"file\":\"data.txt\",\"product\":\"wheat\"}";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> requestEntity = new HttpEntity<>(payload, headers);

        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<Response> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                requestEntity,
                Response.class
        );

        Response responseBody = response.getBody();

        input.setSum(responseBody.getSum());
        return input.toString();
    }


}
