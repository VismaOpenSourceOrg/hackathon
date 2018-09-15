package no.tripletex.teamhacker.config;

import no.tripletex.teamhacker.web.interceptors.SuccessfulLoginInterceptor;
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
}
