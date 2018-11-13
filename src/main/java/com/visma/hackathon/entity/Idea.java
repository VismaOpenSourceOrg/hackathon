package com.visma.hackathon.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Transient;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Entity
public class Idea {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private UUID uuid;

	@NotEmpty
	@NotNull
	@Column(columnDefinition = "TEXT")
	private String title;

	@NotEmpty
	@NotNull
	@Column(columnDefinition = "TEXT")
	private String description;

	@ManyToOne
	@NotNull
	private User createdBy;

	@NotNull
	private ZonedDateTime created;

	private ZonedDateTime updated;

	private IdeaStatus status = IdeaStatus.REPORTED;
	
	@ManyToMany(fetch = FetchType.LAZY,
			cascade = {
					CascadeType.PERSIST,
					CascadeType.MERGE
			})
	@OrderBy("created")
	private Set<User> likes = new HashSet<>();

	@OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE, orphanRemoval = true, mappedBy = "idea")
	@OrderBy("created")
	private List<IdeaComment> comments = new ArrayList<>();


	@Transient
	private int numberOfComments;

	public Idea() {

	}

	public Idea(@NotEmpty String title, @NotEmpty String description) {
		this.title = title;
		this.description = description;
	}

	public UUID getUuid() {
		return uuid;
	}

	public void setUuid(UUID uuid) {
		this.uuid = uuid;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
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

	public IdeaStatus getStatus() {
		return status;
	}

	public void setStatus(IdeaStatus status){
		this.status = status;
	}
	
	public Set<User> getLikes() {
		return likes;
	}

	public void setLikes(Set<User> likes) {
		this.likes = likes;
	}

	@JsonIgnore
	public List<IdeaComment> getComments() {
		return comments;
	}

	public void setComments(List<IdeaComment> comments) {
		this.comments = comments;
	}

	@JsonInclude(JsonInclude.Include.NON_DEFAULT)
	public int getNumberOfComments() {
		return numberOfComments;
	}

	public void setNumberOfComments(int numberOfComments) {
		this.numberOfComments = numberOfComments;
	}


	@Override
	public String toString() {
		final StringBuilder sb = new StringBuilder("Idea{");
		sb.append("uuid=").append(uuid);
		sb.append(", title='").append(title).append('\'');
		sb.append(", createdBy=").append(createdBy.getEmail());
		sb.append(", created=").append(created);
		sb.append(", updated=").append(updated);
		sb.append('}');
		return sb.toString();
	}


	public String toFullString() {
		final StringBuilder sb = new StringBuilder("Idea{");
		sb.append("uuid=").append(uuid);
		sb.append(", title='").append(title).append('\'');
		sb.append(", description='").append(description).append('\'');
		sb.append(", createdBy=").append(createdBy.getEmail());
		sb.append(", created=").append(created);
		sb.append(", updated=").append(updated);
		sb.append('}');
		return sb.toString();
	}
	
	public enum IdeaStatus {
		REPORTED, IN_PROGRESS, DONE 
	}

}
