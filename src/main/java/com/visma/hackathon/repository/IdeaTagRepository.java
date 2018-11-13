package com.visma.hackathon.repository;

import com.visma.hackathon.entity.Idea;
import com.visma.hackathon.entity.IdeaTag;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface IdeaTagRepository extends CrudRepository<IdeaTag, UUID> {

	List<IdeaTag> findAllByIdeasOrderByNameAsc(Idea idea);

	Optional<IdeaTag> findIdeaTagByName(String name);

}
