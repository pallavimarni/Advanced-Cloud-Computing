package com.example.a3;

import java.util.List;

public class StoreProductsRequest {

    private List<Product> products;

    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }
}
