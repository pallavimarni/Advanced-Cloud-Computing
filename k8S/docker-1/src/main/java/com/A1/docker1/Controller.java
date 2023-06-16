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

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.regex.Pattern;

@RestController
public class Controller {
@PostMapping(value = "/store-file")
public String storeFile(@RequestBody Input input) {
    if (input.getFile() != null && input.getData() != null) {
        try {
            String containerFilePath = "/app/" + input.getFile().toString(); // Assuming the file path within the container starts with "/app/"
            Path file = Paths.get(containerFilePath);
            Files.writeString(file, input.getData(), StandardOpenOption.CREATE);
            input.setProduct("Success");
            return input.storetoString();
        } catch (IOException e) {
            input.setProduct(e.getStackTrace().toString());
        
            return input.errortoString();
        }
    } else {
        input.setProduct("Invalid JSON input.");
        return input.errortoStringNull();
    }
}

    @PostMapping(value = "/calculate")
    public String validate(@RequestBody Input input) {
        if(input.getFile() == null){
            input.setProduct("Invalid JSON input.");
            return input.errortoStringNull();
        }
        //Logic to check if JSON input is valid
        if ( input.getFile() == "null" || input.getFile() == "") {
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

        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            String line;
            int lineNumber = 1;
            boolean isValidFormat = true;

            while ((line = br.readLine()) != null) {
                String[] values = line.split(",");
                if (values.length != 2 || values[0].trim().isEmpty() || values[1].trim().isEmpty()) {
                    isValidFormat = false;
                    break;
                }
                lineNumber++;
            }

            if (!isValidFormat) {
                input.setProduct("Input file not in CSV format.");
                input.errortoString();
                return input.errortoString();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }


        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            String firstLine = br.readLine();

            if (firstLine != null) {
                String[] headers = firstLine.split(",");

                if (headers.length != 2 || !headers[0].trim().equalsIgnoreCase("product")
                        || !headers[1].trim().equalsIgnoreCase("amount")) {
                    {
                        input.setProduct("Input file not in CSV format.");
                        input.errortoString();
                        return input.errortoString();
                    }
                }
            }
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
            String line;
            int lineNumber = 0;
            while ((line = reader.readLine()) != null) {
                if(lineNumber == 0){
                    lineNumber++;
                    continue;
                }

                String[] values = line.split(",");
                if (values.length == 2) {
                    String product = values[0].trim();
                    String amountStr = values[1].trim();

                    if (!Pattern.matches("\\d+", amountStr)) {
                        input.setProduct("Input file not in CSV format.");
                        input.errortoString();
                        return input.errortoString();
                    }
                }

            }
        } catch (IOException e) {
            e.printStackTrace();
        }


        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {


            String line;
            while ((line = br.readLine()) != null) {

                int commaCount = line.length() - line.replace(",", "").length();
                if (commaCount < 1) {
                    input.setProduct("Input file not in CSV format.");
                    input.errortoString();
                    return input.errortoString();
                }
            }

        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("An error occurred while reading the file.");
        }

        String url = "http://34.135.203.228:6001/cal";
        String payload = "{\"file\":\"" + input.getFile().toString() + "\",\"product\":\"" + input.getProduct().toString() + "\"}";

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
