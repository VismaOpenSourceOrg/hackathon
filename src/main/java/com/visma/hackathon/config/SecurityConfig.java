package com.visma.hackathon.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;

@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {


	@Bean
	public CustomOidcUserService customOidcUserService() {
		return new CustomOidcUserService();
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.authorizeRequests()
				.antMatchers("/logged-out", "/login-error",  "/health", "/csp-report", "/js/**", "/css/**", "/images/**").permitAll()
				.anyRequest().hasAuthority("ROLE_USER")
				.and()
				.csrf().disable()
				.oauth2Login().loginPage("/oauth2/authorization/google")
				.failureUrl("/login-error")
				.userInfoEndpoint().oidcUserService(customOidcUserService())
				.and()
				.successHandler(simpleUrlAuthenticationSuccessHandler())
				.and()
				.logout().logoutSuccessUrl("/logged-out")
				.and()
				.headers()
				.contentSecurityPolicy(getCsp());
	}

	@Bean
	public AuthenticationSuccessHandler simpleUrlAuthenticationSuccessHandler() {
		return new SimpleUrlAuthenticationSuccessHandler("/oauth-login-success");
	}

	private String getCsp() {
		StringBuilder policy = new StringBuilder();
		policy.append("default-src 'self'; ");

		// Allow fonts from Material Icons
		policy.append("style-src 'self' blob: 'unsafe-inline' https://fonts.googleapis.com; ");
		policy.append("font-src 'self' https://fonts.gstatic.com; ");

		// Allow Google avatars
		policy.append("img-src 'self' https://*.googleusercontent.com; ");

		policy.append("report-uri /csp-report;");

		return policy.toString();
	}
}