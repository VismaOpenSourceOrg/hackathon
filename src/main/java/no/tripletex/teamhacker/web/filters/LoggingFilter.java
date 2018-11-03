package no.tripletex.teamhacker.web.filters;

import no.tripletex.teamhacker.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.UUID;

public class LoggingFilter implements Filter {

	private static final Logger log = LoggerFactory.getLogger(LoggingFilter.class);

	@Autowired
	private AuthService authService;

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		try {
			String requestId = UUID.randomUUID().toString();
			authService.getOptionalLoggedInUser().ifPresent((auth) -> {
				String mdcData = String.format("[request:%s, email:%s] ", requestId, auth.getEmail());
				MDC.put("authInfo", mdcData);
			});
			HttpServletRequest hsr = (HttpServletRequest)request;
			log.info("Request " + hsr.getMethod() + " " + hsr.getRequestURI());
			chain.doFilter(request, response);
		} finally {
			MDC.clear();
		}
	}

	@Override
	public void destroy() {
	}

}
