package no.tripletex.teamhacker.repository;

import no.tripletex.teamhacker.entity.Idea;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface IdeaRepository extends CrudRepository<Idea, UUID> {

	List<Idea> findAllByOrderByCreatedDesc();

}
