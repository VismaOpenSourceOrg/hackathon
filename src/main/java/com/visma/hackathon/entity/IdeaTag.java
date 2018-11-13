package com.visma.hackathon.entity;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
public class IdeaTag {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private UUID uuid;

	@NotEmpty
	@NotNull
	@Column(columnDefinition = "TEXT")
	private String name;

	@ManyToMany(fetch = FetchType.LAZY,
			cascade = {
					CascadeType.PERSIST,
					CascadeType.MERGE
			},
			mappedBy = "tags")
	private Set<Idea> ideas = new HashSet<>();

	public IdeaTag() {

	}

	public IdeaTag(@NotEmpty String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public UUID getUuid() {
		return uuid;
	}

	public void setUuid(UUID uuid) {
		this.uuid = uuid;
	}

	@Override
	public String toString() {
		final StringBuilder sb = new StringBuilder("IdeaTag{");
		sb.append("uuid=").append(uuid);
		sb.append(", name='").append(name).append('\'');
		sb.append('}');
		return sb.toString();
	}

	public Set<Idea> getIdeas() {
		return ideas;
	}
}
