package no.tripletex.teamhacker.web;

import no.tripletex.teamhacker.entity.User;
import no.tripletex.teamhacker.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {

	@Autowired
	private AuthService authService;

	@GetMapping("/auth")
	public User getLoginInfo() {
		return authService.getLoggedInUser();
	}


}
