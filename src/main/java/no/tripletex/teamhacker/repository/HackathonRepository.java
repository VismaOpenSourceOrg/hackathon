package no.tripletex.teamhacker.repository;

import no.tripletex.teamhacker.entity.Hackathon;
import no.tripletex.teamhacker.entity.HackathonStatus;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface HackathonRepository extends CrudRepository<Hackathon, UUID> {

	List<HackathonStatus> findAllByStatus(HackathonStatus status);

	Optional<HackathonStatus> findFirstByStatus(HackathonStatus status);
}
