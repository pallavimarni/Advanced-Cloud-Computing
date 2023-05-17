package com.A1.docker1;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.stereotype.Component;
@Component
public class Input {
    String file;

    String product;
    String error;

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

    @Override
    public String toString() {
        return "Input{" +
                "file='" + file + '\'' +
                ", product='" + product + '\'' +
                '}';
    }
    public String errortoString() {
        return "Input{" +
                "file='" + file + '\'' +
                ", error='" + product + '\'' +
                '}';
    }

}
