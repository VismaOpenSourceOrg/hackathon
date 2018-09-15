package no.tripletex.teamhacker.web;

import no.tripletex.teamhacker.entity.User;
import no.tripletex.teamhacker.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	@Autowired
	private AuthService authService;

	@GetMapping
	public User getLoginInfo() {
		return authService.getLoggedInUser();
	}


}
