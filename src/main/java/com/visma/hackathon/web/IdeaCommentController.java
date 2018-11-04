package com.visma.hackathon.web;

import com.visma.hackathon.entity.HackerRole;
import com.visma.hackathon.entity.IdeaComment;
import com.visma.hackathon.entity.User;
import com.visma.hackathon.service.AuthService;
import com.visma.hackathon.repository.IdeaCommentRepository;
import org.hibernate.ObjectNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.ZonedDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/comment")
public class IdeaCommentController {

	private static final Logger log = LoggerFactory.getLogger(IdeaCommentController.class);

	@Autowired
	private IdeaCommentRepository ideaCommentRepository;

	@Autowired
	private AuthService authService;

	@PutMapping("/{uuid}")
	public IdeaComment update(@PathVariable UUID uuid, @RequestBody CommentDTO body) {
		IdeaComment comment = ideaCommentRepository.findById(uuid).orElseThrow(() -> new ObjectNotFoundException(uuid, "IdeaComment" ));
		checkWriteAuthorization(comment);
		comment.setContent(body.getContent());
		comment.setUpdated(ZonedDateTime.now());
		IdeaComment updatedComment = ideaCommentRepository.save(comment);
		log.info("Updated comment: " + updatedComment);
		return updatedComment;
	}

	@DeleteMapping("/{uuid}")
	public void delete(@PathVariable UUID uuid) {
		IdeaComment comment = ideaCommentRepository.findById(uuid).orElseThrow(() -> new ObjectNotFoundException(uuid, "IdeaComment" ));
		checkWriteAuthorization(comment);
		log.info("Deleted comment: " + comment);
		ideaCommentRepository.delete(comment);
	}

	private void checkWriteAuthorization(IdeaComment comment) {
		User authUser = authService.getLoggedInUser();
		if (comment.getCreatedBy().getUuid().equals(authUser.getUuid()) || authUser.hasRole(HackerRole.ADMINISTRATOR) || authUser.hasRole(HackerRole.MODERATOR)) {
			return;
		}
		throw new SecurityException("Unauthorized write to comment " + comment.getUuid());
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
