package no.tripletex.teamhacker.repository;

import no.tripletex.teamhacker.entity.Idea;
import no.tripletex.teamhacker.entity.IdeaComment;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.UUID;

public interface IdeaCommentRepository extends CrudRepository<IdeaComment, UUID> {

	List<IdeaComment> findByIdeaOrderByCreated(Idea idea);

}
