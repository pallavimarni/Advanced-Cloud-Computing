package com.A1.docker1;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Controller {
    @PostMapping(value = "/calculate")
    public String validate(@RequestBody Input input ){

        return input.toString();
    }

}
