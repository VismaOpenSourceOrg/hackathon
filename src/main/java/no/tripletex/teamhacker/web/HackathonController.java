package no.tripletex.teamhacker.web;

import no.tripletex.teamhacker.entity.Hackathon;
import no.tripletex.teamhacker.repository.HackathonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.time.ZonedDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/hackathon")
public class HackathonController {

	@Autowired
	private HackathonRepository hackathonRepository;

	@GetMapping
	public Iterable<Hackathon> getHackathons() {
		return hackathonRepository.findAll();
	}

	@PostMapping
	public Hackathon create(@RequestBody @Valid Hackathon hackathon) {
		ZonedDateTime dt = ZonedDateTime.now();
		hackathon.setCreated(dt);
		hackathon.setUpdated(dt);
		return hackathonRepository.save(hackathon);
	}



}
