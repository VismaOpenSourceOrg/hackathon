package no.tripletex.teamhacker.web.filters;

import no.tripletex.teamhacker.service.AuthService;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import java.io.IOException;

@Component
public class LoggingFilter implements Filter {

	@Autowired
	private AuthService authService;

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		try {
			authService.getOptionalLoggedInUser().ifPresent((auth) -> {
				String mdcData = String.format("[uuid:%s | email:%s] ", auth.getUuid(), auth.getEmail());
				MDC.put("authInfo", mdcData);
			});
			chain.doFilter(request, response);
		} finally {
			MDC.clear();
		}
	}

	@Override
	public void destroy() {
	}

}
