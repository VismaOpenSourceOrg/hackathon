package no.tripletex.teamhacker.web;

import no.tripletex.teamhacker.entity.User;
import no.tripletex.teamhacker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.ZonedDateTime;

@RestController
@RequestMapping("/api/user")
public class UserController {

	@Autowired
	private UserRepository userRepository;

	@GetMapping
	public Iterable<User> getUsers() {
		return userRepository.findAll();
	}

	@PostMapping
	public User createUser(@RequestBody User user) {
		user.setCreated(ZonedDateTime.now());
		return userRepository.save(user);
	}

}
