package com.visma.hackathon.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class IndexController {

	@RequestMapping(path = {
			"/",
			"/ideas/**",
			"/people/**"
	})
	public String indexPage() {
		// Routing is done in the frontend, so just redirect all requests to the base HTML page
		return "/index.html";
	}

	@RequestMapping("/logged-out")
	public String loggedOutPage() {
		return "/logged-out.html";
	}

}
