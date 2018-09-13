package no.tripletex.teamhacker.service;

import no.tripletex.teamhacker.entity.Idea;
import no.tripletex.teamhacker.entity.User;
import no.tripletex.teamhacker.repository.IdeaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;

@Service
public class IdeaService {

	@Autowired
	private IdeaRepository ideaRepository;

	public Idea createIdea(String title, String description, User user) {
		Idea idea = new Idea(title, description);
		idea.setCreatedBy(user);
		idea.setCreated(ZonedDateTime.now());
		return ideaRepository.save(idea);
	}
}
