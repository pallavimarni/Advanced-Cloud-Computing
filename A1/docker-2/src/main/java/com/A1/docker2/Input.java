package com.A1.docker2;


import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.stereotype.Component;
@Component
public class Input {
    String file;

    String product;

    int sum;

    public String getFile() {
        return file;
    }

    public void setFile(String file) {
        this.file = file;
    }

    public String getProduct() {
        return product;
    }

    public void setProduct(String product) {
        this.product = product;
    }
    public int getSum() {
        return sum;
    }

    public void setSum(int sum) {
        this.sum= sum;
    }
    @Override
    public String toString() {
        return "{" +
                "file='" + file + '\'' +
                ", sum='" + sum + '\'' +
                '}';
    }
}
