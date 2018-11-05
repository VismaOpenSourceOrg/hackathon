package com.visma.hackathon.entity;

import com.fasterxml.jackson.annotation.JsonInclude;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Transient;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
public class IdeaComment {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private UUID uuid;

	@ManyToOne
	@NotNull
	private Idea idea;

	@NotEmpty
	@NotNull
	@Column(columnDefinition = "TEXT")
	private String content;

	@ManyToOne
	@NotNull
	private User createdBy;

	@NotNull
	private ZonedDateTime created;

	private ZonedDateTime updated;

	public UUID getUuid() {
		return uuid;
	}

	public void setUuid(UUID uuid) {
		this.uuid = uuid;
	}

	public Idea getIdea() {
		return idea;
	}

	public void setIdea(Idea idea) {
		this.idea = idea;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public User getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(User createdBy) {
		this.createdBy = createdBy;
	}

	public ZonedDateTime getCreated() {
		return created;
	}

	public void setCreated(ZonedDateTime created) {
		this.created = created;
	}

	public ZonedDateTime getUpdated() {
		return updated;
	}

	public void setUpdated(ZonedDateTime updated) {
		this.updated = updated;
	}

	@Override
	public String toString() {
		final StringBuilder sb = new StringBuilder("IdeaComment{");
		sb.append("uuid=").append(uuid);
		sb.append(", idea='").append(idea.getUuid()).append('\'');
		sb.append(", content='").append(content).append('\'');
		sb.append(", createdBy=").append(createdBy.getEmail());
		sb.append(", created=").append(created);
		sb.append(", updated=").append(updated);
		sb.append('}');
		return sb.toString();
	}
}
