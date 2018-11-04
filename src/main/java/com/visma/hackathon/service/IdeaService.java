package com.visma.hackathon.service;

import com.visma.hackathon.repository.IdeaRepository;
import com.visma.hackathon.entity.Idea;
import com.visma.hackathon.entity.IdeaComment;
import com.visma.hackathon.entity.User;
import com.visma.hackathon.repository.IdeaCommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;

@Service
public class IdeaService {

	@Autowired
	private IdeaRepository ideaRepository;

	@Autowired
	private IdeaCommentRepository ideaCommentRepository;

	public Idea createIdea(String title, String description, User user) {
		Idea idea = new Idea(title, description);
		idea.setCreatedBy(user);
		idea.setCreated(ZonedDateTime.now());
		return ideaRepository.save(idea);
	}

	public IdeaComment createComment(Idea idea, String text, User user) {
		IdeaComment comment = new IdeaComment();
		comment.setIdea(idea);
		comment.setContent(text);
		comment.setCreated(ZonedDateTime.now());
		comment.setCreatedBy(user);
		return ideaCommentRepository.save(comment);
	}
}
