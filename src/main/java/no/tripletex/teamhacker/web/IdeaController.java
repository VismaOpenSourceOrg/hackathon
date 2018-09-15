package no.tripletex.teamhacker.web;

import no.tripletex.teamhacker.entity.User;
import no.tripletex.teamhacker.entity.Idea;
import no.tripletex.teamhacker.repository.IdeaRepository;
import no.tripletex.teamhacker.service.AuthService;
import no.tripletex.teamhacker.service.IdeaService;
import org.hibernate.ObjectNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

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

	@PutMapping("{uuid}/like")
	public Idea like(@PathVariable UUID uuid) {
		User user = authService.getLoggedInUser();
		Optional<Idea> ideaOptional = ideaRepository.findById(uuid);

		return ideaOptional.map((idea) -> updateUserLike(user, idea, true))
				.orElseThrow(() -> new ObjectNotFoundException(uuid, "Idea"));
	}

	@PutMapping("{uuid}/unlike")
	public Idea unlike(@PathVariable UUID uuid) {
		User user = authService.getLoggedInUser();
		Optional<Idea> ideaOptional = ideaRepository.findById(uuid);

		return ideaOptional.map((idea) -> updateUserLike(user, idea, false))
				.orElseThrow(() -> new ObjectNotFoundException(uuid, "Idea"));
	}

	private Idea updateUserLike(User user, Idea idea, boolean liked) {
		Set<User> likes = idea.getLikes();
		if (liked) likes.add(user);
		else likes.remove(user);

		return ideaRepository.save(idea);
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
