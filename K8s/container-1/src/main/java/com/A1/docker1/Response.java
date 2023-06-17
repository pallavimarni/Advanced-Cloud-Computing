package com.A1.docker1;


    public class Response {
        private String file;
        private String sum;

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

        @Override
        public String toString() {
            return "{" +
                    "file='" + file + '\''+
                    "sum=" + sum +
                    '}';
        }
    }

    