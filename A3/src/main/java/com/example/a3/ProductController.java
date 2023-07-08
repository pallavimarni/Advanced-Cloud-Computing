package com.example.a3;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping("/store-products")
    public ResponseEntity<String> storeProducts(@RequestBody StoreProductsRequest request) {
        List<Product> products = request.getProducts();

        try {
            productService.storeProducts(products);
            return ResponseEntity.ok("{\"message\": \"Success.\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error storing products.");
        }
    }

    @GetMapping("/list-products")
    public ResponseEntity<Map<String, List<Product>>> listProducts() {
        List<Product> productList = productService.getAllProducts();

        Map<String, List<Product>> response = new HashMap<>();
        response.put("products", productList);

        return ResponseEntity.ok(response);
    }

}
