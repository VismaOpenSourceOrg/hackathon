package com.visma.hackathon.web;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class CustomErrorController implements ErrorController {

	@RequestMapping({ "/login-error", "/error" })
	public String loginErrorPage() {
		return "/login-error.html";
	}

	@Override
	public String getErrorPath() {
		return "/login-error.html";
	}
}
