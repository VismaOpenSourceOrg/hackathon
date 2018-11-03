package no.tripletex.teamhacker.config;

import no.tripletex.teamhacker.web.filters.LoggingFilter;
import no.tripletex.teamhacker.web.interceptors.SuccessfulLoginInterceptor;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(successfulLoginInterceptor()).addPathPatterns("/oauth-login-success");
	}

	@Bean
	public SuccessfulLoginInterceptor successfulLoginInterceptor() {
		return new SuccessfulLoginInterceptor();
	}

	@Bean
	public FilterRegistrationBean loggingFilterRegistration(){
		FilterRegistrationBean registration = new FilterRegistrationBean();
		registration.setFilter(loggingFilter());
		registration.addUrlPatterns("/api/*", "/csp-report");
		registration.setName("loggingFilter");
		registration.setOrder(1);
		return registration;
	}

	@Bean
	public LoggingFilter loggingFilter() {
		return new LoggingFilter();
	}

}
