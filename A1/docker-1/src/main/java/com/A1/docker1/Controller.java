package com.A1.docker1;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

@RestController
public class Controller {
    @PostMapping(value = "/calculate")
    public String validate(@RequestBody Input input) {
        if (input.getFile() == null || input.getFile() == "null" || input.getFile() == "") {
            input.setProduct("Invalid JSON input.");
        }

        String filePath = "C:/Users/17827/Desktop/group25/marni/A1/docker-1/src/main/java/com/A1/docker1/"+input.getFile().toString();
        File file = new File(filePath);
        if (!file.exists()) {
            input.setProduct("File not found.");
        }

        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            String line;


            while ((line = br.readLine()) != null) {

                int commaCount = line.length() - line.replace(",", "").length();
                if (commaCount < 1) {
                    input.setProduct("Input file not in CSV format.");
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("An error occurred while reading the file.");
        }
        return input.errortoString();
    }

}
