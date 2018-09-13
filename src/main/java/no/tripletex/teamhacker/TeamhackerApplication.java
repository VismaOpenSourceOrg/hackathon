package no.tripletex.teamhacker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.rest.RepositoryRestMvcAutoConfiguration;

@SpringBootApplication(exclude = {
		RepositoryRestMvcAutoConfiguration.class
})
public class TeamhackerApplication {

	public static void main(String[] args) {
		SpringApplication.run(TeamhackerApplication.class, args);
	}
}
