package com.example.container2;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
public class Controller {
    @PostMapping(value = "/cal")
    public ResponseEntity<Response> sum(@RequestBody Input input) {
        String filePath = "/app/"+input.getFile().toString();

        String targetProduct = input.getProduct().toString();
        int total = 0;
        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            String line;
            Map<String, Integer> productMap = new HashMap<>();
            br.readLine();

            while ((line = br.readLine()) != null) {
                String[] split = line.split(",");
                String product = split[0].trim();
                int qty = Integer.parseInt(split[1].trim());

                productMap.put(product, productMap.getOrDefault(product, 0) + qty);
            }

            total = productMap.getOrDefault(targetProduct, 0);
            input.setSum(total);
        } catch (IOException e) {
            e.printStackTrace();
        }

        Response response = new Response(input.getFile(), total);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}