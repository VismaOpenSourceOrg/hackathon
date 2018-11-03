package no.tripletex.teamhacker.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;

import java.util.List;

@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

	@Bean
	public CustomOidcUserService customOidcUserService() {
		return new CustomOidcUserService();
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.authorizeRequests()
				.antMatchers("/logged-out", "/health", "/csp-report").permitAll()
				.anyRequest().hasAuthority("ROLE_USER")
				.and()
				.csrf().disable()
				.oauth2Login().loginPage("/oauth2/authorization/google")
				.userInfoEndpoint().oidcUserService(customOidcUserService())
				.and()
				.defaultSuccessUrl("/oauth-login-success", true)
				.and()
				.logout().logoutSuccessUrl("/logged-out")
				.and()
				.headers()
				.contentSecurityPolicy("default-src 'self'; report-uri /csp-report");
	}
}