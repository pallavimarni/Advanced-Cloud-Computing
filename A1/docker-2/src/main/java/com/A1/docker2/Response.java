package com.A1.docker2;


public class Response {
    private String file;
    private int sum;

    public Response() {
    }

    public Response(String file, int sum) {
        this.file = file;
        this.sum = sum;
    }

    public String getFile() {
        return file;
    }

    public void setFile(String file) {
        this.file = file;
    }

    public int getSum() {
        return sum;
    }

    public void setSum(int sum) {
        this.sum = sum;
    }

    @Override
    public String toString() {
        return "Response [file=" + file + ", sum=" + sum + "]";
    }
}