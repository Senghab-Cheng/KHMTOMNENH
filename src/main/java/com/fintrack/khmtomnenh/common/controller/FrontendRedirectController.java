package com.fintrack.khmtomnenh.common.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FrontendRedirectController {

    private final String frontendBaseUrl;

    public FrontendRedirectController(
            @Value("${app.frontend.base-url:http://localhost:3000}") String frontendBaseUrl
    ) {
        this.frontendBaseUrl = frontendBaseUrl;
    }

    @GetMapping({"/", ""})
    public String redirectRoot() {
        return "redirect:" + frontendBaseUrl;
    }

    @GetMapping({"/auth/signin", "/auth/signup", "/login"})
    public String redirectAuthPages(HttpServletRequest request) {
        String targetPath = "/login".equals(request.getRequestURI())
                ? "/auth/signin"
                : request.getRequestURI();
        return "redirect:" + frontendBaseUrl + targetPath;
    }
}
