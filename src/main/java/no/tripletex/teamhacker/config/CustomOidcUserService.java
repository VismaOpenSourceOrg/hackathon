package no.tripletex.teamhacker.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;

import java.util.List;

public class CustomOidcUserService extends OidcUserService {

	@Value("#{'${security.allowed-domains}'.split(',')}")
	private List<String> allowedDomains;

	@Override
	public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
		OidcUser user = super.loadUser(userRequest);

		String hostDomain = (String) user.getAttributes().getOrDefault("hd", "gmail.com");
		if (!allowedDomains.contains(hostDomain)) {
			throw new BadCredentialsException("Unsupported OAuth domain: " + hostDomain);
		}

		return user;
	}
}