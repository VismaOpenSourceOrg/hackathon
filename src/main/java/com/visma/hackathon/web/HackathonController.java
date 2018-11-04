package com.visma.hackathon.web;

import com.visma.hackathon.entity.Hackathon;
import com.visma.hackathon.entity.HackathonStatus;
import com.visma.hackathon.entity.HackerRole;
import com.visma.hackathon.repository.HackathonRepository;
import com.visma.hackathon.entity.User;
import com.visma.hackathon.service.AuthService;
import org.hibernate.ObjectNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.ZonedDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/hackathon")
public class HackathonController {

	private static final Logger log = LoggerFactory.getLogger(HackathonController.class);

	@Autowired
	private HackathonRepository hackathonRepository;

	@Autowired
	private AuthService authService;

	@GetMapping("/active")
	public Hackathon getCurrentHackathon() {
		return hackathonRepository.findFirstByStatus(HackathonStatus.ACTIVE).orElse(null);
	}

	@GetMapping("/{uuid}")
	public Hackathon getById(@PathVariable UUID uuid) {
		return hackathonRepository.findById(uuid).orElseThrow(() -> new ObjectNotFoundException(uuid, "Hackathon" ));
	}

	@GetMapping
	public Iterable<Hackathon> getHackathons() {
		return hackathonRepository.findAll();
	}

	@PostMapping
	public Hackathon create(@RequestBody CreationDTO body) {
		checkWriteAuthorization();

		ZonedDateTime dt = ZonedDateTime.now();
		Hackathon hackathon = new Hackathon();
		hackathon.setTitle(body.getTitle());
		hackathon.setDescription(body.getDescription());
		hackathon.setCreatedBy(authService.getLoggedInUser());
		hackathon.setStatus(body.status);
		hackathon.setCreated(dt);
		hackathon.setUpdated(dt);

		Hackathon createdHackathon = hackathonRepository.save(hackathon);
		log.info("Created hackathon: " + createdHackathon);
		return createdHackathon;
	}

	@PutMapping("/{uuid}")
	public Hackathon update(@PathVariable UUID uuid, @RequestBody CreationDTO body) {
		checkWriteAuthorization();

		Hackathon hackathon = hackathonRepository.findById(uuid).orElseThrow(() -> new ObjectNotFoundException(uuid, "Hackathon" ));
		hackathon.setTitle(body.getTitle());
		hackathon.setDescription(body.getDescription());
		hackathon.setStatus(body.getStatus());
		hackathon.setUpdated(ZonedDateTime.now());
		Hackathon updatedHackathon = hackathonRepository.save(hackathon);
		log.info("Updated hackathon: " + updatedHackathon);
		return updatedHackathon;
	}

	private void checkWriteAuthorization() {
		User authUser = authService.getLoggedInUser();
		if (authUser.hasRole(HackerRole.ADMINISTRATOR)) {
			return;
		}
		throw new SecurityException("Unauthorized write to hackathon ");
	}

	static class CreationDTO {

		private String title;
		private String description;
		private HackathonStatus status;

		public String getTitle() {
			return title;
		}

		public void setTitle(String title) {
			this.title = title;
		}

		public String getDescription() {
			return description;
		}

		public void setDescription(String description) {
			this.description = description;
		}

		public HackathonStatus getStatus() {
			return status;
		}

		public void setStatus(HackathonStatus status) {
			this.status = status;
		}
	}



}
