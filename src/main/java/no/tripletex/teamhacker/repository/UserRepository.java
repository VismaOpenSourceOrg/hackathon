package no.tripletex.teamhacker.repository;

import no.tripletex.teamhacker.entity.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserRepository extends CrudRepository<User, UUID>  {


}
