package com.example.a3;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public void storeProducts(List<Product> products) {
        for (Product product : products) {
            productRepository.save(product);
        }
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
}
