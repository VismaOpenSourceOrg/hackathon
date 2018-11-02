package no.tripletex.teamhacker.service;

import no.tripletex.teamhacker.entity.User;
import no.tripletex.teamhacker.repository.UserRepository;
import no.tripletex.teamhacker.web.GoogleOAuthLoginInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

@Service
public class AuthService {

	@Autowired
	private OAuth2AuthorizedClientService authorizedClientService;

	@Autowired
	private UserRepository userRepository;



	private Optional<OAuth2AuthenticationToken> getAuthorizationToken() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth == null) return Optional.empty();
		return Optional.of((OAuth2AuthenticationToken) auth);
	}

	public Optional<GoogleOAuthLoginInfo> getLoggedInOAuthInfo() {
		return getAuthorizationToken().map(this::getOAuthLoginInfo);
	}

	private GoogleOAuthLoginInfo getOAuthLoginInfo(OAuth2AuthenticationToken authentication) {
		OAuth2AuthorizedClient client = authorizedClientService
				.loadAuthorizedClient(
						authentication.getAuthorizedClientRegistrationId(),
						authentication.getName());

		String userInfoEndpointUri = client.getClientRegistration()
				.getProviderDetails().getUserInfoEndpoint().getUri();

		if (StringUtils.isEmpty(userInfoEndpointUri)) {
			throw new InsufficientAuthenticationException("Not logged in");
		}

		RestTemplate restTemplate = new RestTemplate();
		HttpHeaders headers = new HttpHeaders();
		headers.add(HttpHeaders.AUTHORIZATION, "Bearer " + client.getAccessToken()
				.getTokenValue());
		HttpEntity entity = new HttpEntity("", headers);
		ResponseEntity<GoogleOAuthLoginInfo> response = restTemplate
				.exchange(userInfoEndpointUri, HttpMethod.GET, entity, GoogleOAuthLoginInfo.class);
		GoogleOAuthLoginInfo userAttributes = response.getBody();
		return userAttributes;
	}

	public User getLoggedInUser() {
		return getAuthorizationToken()
				.map((auth) -> (String) auth.getPrincipal().getAttributes().get("email"))
				.map(email -> userRepository.findUserByEmail(email)
						.orElseThrow(() -> new RuntimeException("Could not find user in database")))
				.get();
	}
	public Optional<User> getOptionalLoggedInUser() {
		return getAuthorizationToken()
				.map((auth) -> (String) auth.getPrincipal().getAttributes().get("email"))
				.map(email -> userRepository.findUserByEmail(email)
						.orElseThrow(() -> new RuntimeException("Could not find user in database")));
	}


}
