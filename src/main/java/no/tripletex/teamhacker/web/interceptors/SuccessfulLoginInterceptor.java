package no.tripletex.teamhacker.web.interceptors;

import no.tripletex.teamhacker.entity.User;
import no.tripletex.teamhacker.service.AuthService;
import no.tripletex.teamhacker.service.UserService;
import no.tripletex.teamhacker.web.GoogleOAuthLoginInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;
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
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

@Configuration
public class SuccessfulLoginInterceptor implements HandlerInterceptor {

	@Autowired
	private AuthService authService;

	@Autowired
	private UserService userService;


	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth != null) {
			GoogleOAuthLoginInfo loginInfo = authService.getOAuthLoginInfo((OAuth2AuthenticationToken) auth);
			User user = userService.createUser(loginInfo);
			System.out.println("Created user");

			response.sendRedirect("/index.html");
			return false;
		}

		return true;
	}
}
