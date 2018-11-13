package com.visma.hackathon.service;

import com.visma.hackathon.entity.IdeaTag;
import com.visma.hackathon.repository.IdeaRepository;
import com.visma.hackathon.entity.Idea;
import com.visma.hackathon.entity.IdeaComment;
import com.visma.hackathon.entity.User;
import com.visma.hackathon.repository.IdeaCommentRepository;
import com.visma.hackathon.repository.IdeaTagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.*;

import static java.util.stream.Collectors.toList;

@Service
public class IdeaService {

	@Autowired
	private IdeaRepository ideaRepository;

	@Autowired
	private IdeaCommentRepository ideaCommentRepository;

	@Autowired
	private IdeaTagRepository ideaTagRepository;

	public Idea createIdea(String title, String description, String tags, User user) {
		Idea idea = new Idea(title, description);
		idea.setCreatedBy(user);
		idea.setCreated(ZonedDateTime.now());
		Set<IdeaTag> tagsList = new HashSet<>(Arrays.stream(tags.split(";"))
				.map(x -> {
					x = x.toLowerCase().trim();
					Optional<IdeaTag> existingTag = ideaTagRepository.findIdeaTagByName(x);
					if(existingTag.isPresent()) {
						return existingTag.get();
					}
					return new IdeaTag(x);
				}).collect(toList()));
		idea.setTags(tagsList);
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

	public IdeaTag createTag(Idea idea, String name) {
		IdeaTag tag = new IdeaTag();
		tag.getIdeas().add(idea);
		tag.setName(name);
		return ideaTagRepository.save(tag);
	}
}
