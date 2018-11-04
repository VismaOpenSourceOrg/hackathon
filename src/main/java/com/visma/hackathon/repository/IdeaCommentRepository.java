package com.visma.hackathon.repository;

import com.visma.hackathon.entity.Idea;
import com.visma.hackathon.entity.IdeaComment;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.UUID;

public interface IdeaCommentRepository extends CrudRepository<IdeaComment, UUID> {

	List<IdeaComment> findByIdeaOrderByCreated(Idea idea);

}
