package no.tripletex.teamhacker.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
public class AuthController {

	@Autowired
	private OAuth2AuthorizedClientService authorizedClientService;

	@GetMapping("/auth")
	public Map getLoginInfo(OAuth2AuthenticationToken authentication) {
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
		ResponseEntity<Map> response = restTemplate
				.exchange(userInfoEndpointUri, HttpMethod.GET, entity, Map.class);
		Map userAttributes = response.getBody();
		return userAttributes;
	}


}
