package no.tripletex.teamhacker.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {

	@GetMapping("/health")
	public Map<?, ?> health() {
		Map<String, Object> result = new HashMap<>();
		result.put("status", "OK");
		return result;
	}
}
