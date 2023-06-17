package com.A1.docker2;


public class Response {
    private String file;
    private String sum;

    public Response() {
    }

    public Response(String file, String sum) {
        this.file = file;
        this.sum = sum;
    }

    public String getFile() {
        return file;
    }

    public void setFile(String file) {
        this.file = file;
    }

    public String getSum() {
        return sum;
    }

    public void setSum(String sum) {
        this.sum = sum;
    }

}