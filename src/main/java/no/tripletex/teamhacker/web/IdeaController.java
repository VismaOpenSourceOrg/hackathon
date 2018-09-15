package no.tripletex.teamhacker.web;

import no.tripletex.teamhacker.entity.User;
import no.tripletex.teamhacker.entity.Idea;
import no.tripletex.teamhacker.repository.IdeaRepository;
import no.tripletex.teamhacker.service.AuthService;
import no.tripletex.teamhacker.service.IdeaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/idea")
public class IdeaController {

	@Autowired
	private IdeaRepository ideaRepository;

	@Autowired
	private IdeaService ideaService;

	@Autowired
	private AuthService authService;

	@GetMapping
	public Iterable<Idea> getIdeas() {
		return ideaRepository.findAll();
	}

	@PostMapping
	public Idea create(@RequestBody CreationDTO creationDTO) {
		User user = authService.getLoggedInUser();
		Idea idea = ideaService.createIdea(creationDTO.getTitle(), creationDTO.getDescription(), user);
		return idea;
	}


	static class CreationDTO {
		private String title;
		private String description;

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
	}


}
