package com.A1.docker2;

import org.json.JSONObject;
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
        JSONObject jsonPayload = new JSONObject();
        jsonPayload.put("file", file);
        jsonPayload.put("sum", sum);
        return jsonPayload.toString();
    }
}

