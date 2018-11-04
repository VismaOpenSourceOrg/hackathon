package com.visma.hackathon.entity;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity(name =  "HackUser")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private UUID uuid;

	@NotEmpty
	private String fullName;

	private String firstName;

	private String lastName;

	private String pictureUrl;

	@Column(unique = true)
	@NotEmpty
	@NotNull
	@Email
	private String email;

	@NotNull
	private ZonedDateTime created;

	@ElementCollection(targetClass = HackerRole.class)
	@CollectionTable(name = "hacker_roles", joinColumns = @JoinColumn(name = "hacker_role_id" ))
	@NotNull
	@Column(name = "hacker_role", nullable = false)
	@Enumerated(EnumType.STRING)
	private Set<HackerRole> roles = new HashSet<>();

	public UUID getUuid() {
		return uuid;
	}

	public void setUuid(UUID uuid) {
		this.uuid = uuid;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getPictureUrl() {
		return pictureUrl;
	}

	public void setPictureUrl(String pictureUrl) {
		this.pictureUrl = pictureUrl;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public ZonedDateTime getCreated() {
		return created;
	}

	public void setCreated(ZonedDateTime created) {
		this.created = created;
	}

	public Set<HackerRole> getRoles() {
		return roles;
	}

	public void setRoles(Set<HackerRole> roles) {
		this.roles = roles;
	}

	public boolean hasRole(HackerRole role) {
		return getRoles().contains(role);
	}

	@Override
	public String toString() {
		final StringBuilder sb = new StringBuilder("User{");
		sb.append("uuid=").append(uuid);
		sb.append(", fullName='").append(fullName).append('\'');
		sb.append(", firstName='").append(firstName).append('\'');
		sb.append(", lastName='").append(lastName).append('\'');
		sb.append(", pictureUrl='").append(pictureUrl).append('\'');
		sb.append(", email='").append(email).append('\'');
		sb.append(", created=").append(created);
		sb.append(", roles=").append(roles);
		sb.append('}');
		return sb.toString();
	}
}
