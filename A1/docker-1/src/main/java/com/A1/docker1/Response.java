package com.A1.docker1;


    public class Response {
        private String file;
        private int sum;

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
            return "{" +
                    "file='" + file + '\'' +
                    ", sum=" + sum +
                    '}';
        }
    }
