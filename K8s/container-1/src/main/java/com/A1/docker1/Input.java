package com.A1.docker1;
import org.json.JSONObject;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.stereotype.Component;
import org.json.JSONObject;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.stereotype.Component;
@Component
public class Input {
    String file;
    String product;
 String data;
    String sum;

    public String getFile() {
        return file;
    }

    public void setFile(String file) {
        this.file = file;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }


    public String getProduct() {
        return product;
    }

    public void setProduct(String product) {
        this.product = product;
    }
    public String getSum() {
        return sum;
    }

    public void setSum(String sum) {
        this.sum= sum;
    }

    @Override
    public String toString() {

        JSONObject jsonPayload = new JSONObject();
        jsonPayload.put("file", file);
        jsonPayload.put("sum", sum);
        return jsonPayload.toString();
    }

    public String errortoStringNull() {
        JSONObject jsonPayload = new JSONObject();
        jsonPayload.put("file", JSONObject.NULL);
        jsonPayload.put("error", product);
        return jsonPayload.toString();
    }

    public String storetoString() {
        JSONObject jsonPayload = new JSONObject();
        jsonPayload.put("file", file);
        jsonPayload.put("message", product);
        return jsonPayload.toString();
    }
    public String errortoString() {
        JSONObject jsonPayload = new JSONObject();
        jsonPayload.put("file", file);
        jsonPayload.put("error", product);
        return jsonPayload.toString();
    }

}
