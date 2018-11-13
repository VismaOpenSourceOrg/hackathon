package com.visma.hackathon.web;

import com.visma.hackathon.entity.Idea;
import com.visma.hackathon.entity.IdeaTag;
import com.visma.hackathon.repository.IdeaCommentRepository;
import com.visma.hackathon.repository.IdeaTagRepository;
import com.visma.hackathon.service.AuthService;
import org.hibernate.ObjectNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/tags")
public class IdeaTagController {

	private static final Logger log = LoggerFactory.getLogger(IdeaCommentController.class);

	@Autowired
	private IdeaTagRepository ideaTagRepository;

	@Autowired
	private AuthService authService;

	@GetMapping("/{uuid}")
	public IdeaTag getIdeaTag(@PathVariable UUID uuid) {
		return ideaTagRepository.findById(uuid).orElseThrow(() -> new ObjectNotFoundException(uuid, "IdeaTag" ));
	}


}
