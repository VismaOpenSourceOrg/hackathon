package no.tripletex.teamhacker.web.interceptors;

import no.tripletex.teamhacker.entity.User;
import no.tripletex.teamhacker.service.AuthService;
import no.tripletex.teamhacker.service.UserService;
import no.tripletex.teamhacker.web.GoogleOAuthLoginInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Optional;

@Configuration
public class SuccessfulLoginInterceptor implements HandlerInterceptor {

	@Autowired
	private AuthService authService;

	@Autowired
	private UserService userService;

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
		Optional<GoogleOAuthLoginInfo> loginInfo = authService.getLoggedInOAuthInfo();

		if (!loginInfo.isPresent()) return true;

		User user = loginInfo.map(userService::getOrCreateUser)
				.orElseThrow(() -> new SecurityException("Could not get logged in user"));

		response.sendRedirect("/index.html");
		return false;
	}
}
