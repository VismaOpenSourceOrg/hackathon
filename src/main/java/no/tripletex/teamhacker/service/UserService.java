package no.tripletex.teamhacker.service;

import no.tripletex.teamhacker.entity.User;
import no.tripletex.teamhacker.repository.UserRepository;
import no.tripletex.teamhacker.web.GoogleOAuthLoginInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;

	public User createUser(GoogleOAuthLoginInfo authInfo) {
		User user = new User();
		user.setCreated(ZonedDateTime.now());
		user.setPictureUrl(authInfo.getPicture());
		user.setFullName(authInfo.getName());
		user.setEmail(authInfo.getEmail());
		user.setFirstName(authInfo.getGivenName());
		user.setLastName(authInfo.getFamilyName());
		return userRepository.save(user);
	}

	public User getOrCreateUser(GoogleOAuthLoginInfo authInfo) {
		return userRepository.findUserByEmail(authInfo.getEmail()).orElseGet(() -> createUser(authInfo));
	}
}
