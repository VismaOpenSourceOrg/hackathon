package com.visma.hackathon.repository;

import com.visma.hackathon.entity.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends CrudRepository<User, UUID>  {

	Optional<User> findUserByEmail(String email);

	boolean existsByEmail(String email);


}
