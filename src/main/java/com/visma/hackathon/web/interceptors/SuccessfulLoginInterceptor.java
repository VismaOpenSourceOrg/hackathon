package com.visma.hackathon.web.interceptors;

import com.visma.hackathon.service.AuthService;
import com.visma.hackathon.web.GoogleOAuthLoginInfo;
import com.visma.hackathon.entity.User;
import com.visma.hackathon.service.UserService;
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

		response.sendRedirect("/");
		return false;
	}
}
