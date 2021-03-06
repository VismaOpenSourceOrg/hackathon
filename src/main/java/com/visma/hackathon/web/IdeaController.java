package com.visma.hackathon.web;

import com.visma.hackathon.entity.HackerRole;
import com.visma.hackathon.repository.IdeaRepository;
import com.visma.hackathon.entity.IdeaComment;
import com.visma.hackathon.entity.User;
import com.visma.hackathon.entity.Idea;
import com.visma.hackathon.repository.IdeaCommentRepository;
import com.visma.hackathon.repository.UserRepository;
import com.visma.hackathon.service.AuthService;
import com.visma.hackathon.service.IdeaService;
import org.hibernate.ObjectNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/idea")
public class IdeaController {

	private static final Logger log = LoggerFactory.getLogger(IdeaController.class);


	@Autowired
	private IdeaRepository ideaRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private IdeaService ideaService;

	@Autowired
	private IdeaCommentRepository ideaCommentRepository;

	@Autowired
	private AuthService authService;

	@GetMapping
	public Iterable<Idea> getIdeas(@RequestParam(required = false) String createdBy) {
		if (StringUtils.hasText(createdBy)) {
			User user = userRepository.findUserByEmail(createdBy).orElseThrow(() -> new ObjectNotFoundException(createdBy, "User" ));
			return ideaRepository.findAllByCreatedByOrderByCreatedDesc(user);
		}
		List<Idea> ideas = new ArrayList<>(ideaRepository.findAllByOrderByCreatedDesc());
		ideas.forEach(idea -> idea.setNumberOfComments(ideaCommentRepository.countIdeaCommentsByIdea(idea)));

		return ideas;
	}

	@GetMapping("/{uuid}")
	public Idea getIdea(@PathVariable UUID uuid) {
		return ideaRepository.findById(uuid).orElseThrow(() -> new ObjectNotFoundException(uuid, "Idea" ));
	}

	@PostMapping
	public Idea create(@RequestBody CreationDTO creationDTO) {
		User user = authService.getLoggedInUser();
		Idea idea = ideaService.createIdea(creationDTO.getTitle(), creationDTO.getDescription(), user);
		log.info("Created idea: " + idea.toFullString());
		return idea;
	}

	@PutMapping("/{uuid}")
	public Idea update(@PathVariable UUID uuid, @RequestBody CreationDTO creationDTO) {
		Idea idea = ideaRepository.findById(uuid).orElseThrow(() -> new ObjectNotFoundException(uuid, "Idea"));
		checkWriteAuthorization(idea);
		idea.setTitle(creationDTO.getTitle());
		idea.setDescription(creationDTO.description);
		idea.setUpdated(ZonedDateTime.now());
		ideaRepository.save(idea);
		log.info("Updated idea: " + idea.toFullString());
		return idea;
	}

	@DeleteMapping("/{uuid}")
	public void delete(@PathVariable UUID uuid) {
		Idea idea = ideaRepository.findById(uuid).orElseThrow(() -> new ObjectNotFoundException(uuid, "Idea"));
		checkWriteAuthorization(idea);
		ideaRepository.delete(idea);
		log.info("Deleted idea: " + idea);
	}

	@GetMapping("/{uuid}/comments")
	public List<IdeaComment> getComments(@PathVariable UUID uuid) {
		Idea idea = ideaRepository.findById(uuid).orElseThrow(() -> new ObjectNotFoundException(uuid, "Idea"));
		return ideaCommentRepository.findByIdeaOrderByCreated(idea);
	}

	@PostMapping("/{uuid}/comments")
	public IdeaComment createComment(@PathVariable UUID uuid, @RequestBody CommentDTO body) {
		Idea idea = ideaRepository.findById(uuid).orElseThrow(() -> new ObjectNotFoundException(uuid, "Idea"));
		IdeaComment comment = ideaService.createComment(idea, body.getContent(), authService.getLoggedInUser());
		log.info("Created comment: " + comment);
		return comment;
	}


	private void checkWriteAuthorization(Idea idea) {
		User authUser = authService.getLoggedInUser();
		if (idea.getCreatedBy().getUuid().equals(authUser.getUuid()) || authUser.hasRole(HackerRole.ADMINISTRATOR) || authUser.hasRole(HackerRole.MODERATOR)) {
			return;
		}
		throw new SecurityException("Unauthorized write to idea " + idea.getUuid());
	}

	@PutMapping("{uuid}/like")
	public Idea like(@PathVariable UUID uuid) {
		return updateUserLike(uuid, true);
	}

	@PutMapping("{uuid}/unlike")
	public Idea unlike(@PathVariable UUID uuid) {
		return updateUserLike(uuid, false);
	}

	private Idea updateUserLike(UUID ideaId, boolean liked) {
		User user = authService.getLoggedInUser();
		Optional<Idea> ideaOptional = ideaRepository.findById(ideaId);

		Idea idea = ideaOptional.orElseThrow(() -> new ObjectNotFoundException(ideaId, "Idea"));

		Set<User> likes = idea.getLikes();
		if (liked) likes.add(user);
		else likes.remove(user);

		log.info("Updated like status for idea " + idea + " to " + (liked ? "liked" : "not liked"));

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

	static class CommentDTO {
		private String content;

		public String getContent() {
			return content;
		}

		public void setContent(String content) {
			this.content = content;
		}
	}


}
