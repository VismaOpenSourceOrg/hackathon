package com.visma.hackathon.repository;

import com.visma.hackathon.entity.Hackathon;
import com.visma.hackathon.entity.HackathonStatus;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface HackathonRepository extends CrudRepository<Hackathon, UUID> {

	List<Hackathon> findAllByStatus(HackathonStatus status);

	Optional<Hackathon> findFirstByStatus(HackathonStatus status);
}
