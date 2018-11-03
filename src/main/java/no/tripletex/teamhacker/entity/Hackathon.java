package no.tripletex.teamhacker.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
public class Hackathon {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private UUID uuid;

	@NotNull
	@NotEmpty
	private String title;

	@NotNull
	@NotEmpty
	@Column(columnDefinition = "TEXT")
	private String description;

	@NotNull
	@Enumerated(EnumType.STRING)
	private HackathonStatus status = HackathonStatus.INACTIVE;

	@ManyToOne
	private User createdBy;

	private ZonedDateTime created;

	private ZonedDateTime updated;


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

	public HackathonStatus getStatus() {
		return status;
	}

	public void setStatus(HackathonStatus status) {
		this.status = status;
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
		final StringBuilder sb = new StringBuilder("Hackathon{");
		sb.append("uuid=").append(uuid);
		sb.append(", title='").append(title).append('\'');
		sb.append(", description='").append(description).append('\'');
		sb.append(", status=").append(status);
		sb.append(", createdBy=").append(createdBy);
		sb.append(", created=").append(created);
		sb.append(", updated=").append(updated);
		sb.append('}');
		return sb.toString();
	}
}
