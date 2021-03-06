package com.visma.hackathon.repository;

import com.visma.hackathon.entity.Idea;
import com.visma.hackathon.entity.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface IdeaRepository extends CrudRepository<Idea, UUID> {

	List<Idea> findAllByOrderByCreatedDesc();

	List<Idea> findAllByCreatedByOrderByCreatedDesc(User user);

}
