package com.wardbed.service.dto;

import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;
import com.wardbed.domain.enumeration.ClassType;
import com.wardbed.domain.enumeration.Location;

/**
 * A DTO for the {@link com.wardbed.domain.Ward} entity.
 */
public class WardDTO implements Serializable {
    
    private Long id;

    @NotNull
    @Size(max = 7)
    @Pattern(regexp = "^WARD_(0[1-9]|10)$")
    private String wardReferenceId;

    @NotNull
    @Size(max = 10)
    private String wardName;

    @NotNull
    private ClassType wardClassType;

    @NotNull
    private Location wardLocation;

    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getWardReferenceId() {
        return wardReferenceId;
    }

    public void setWardReferenceId(String wardReferenceId) {
        this.wardReferenceId = wardReferenceId;
    }

    public String getWardName() {
        return wardName;
    }

    public void setWardName(String wardName) {
        this.wardName = wardName;
    }

    public ClassType getWardClassType() {
        return wardClassType;
    }

    public void setWardClassType(ClassType wardClassType) {
        this.wardClassType = wardClassType;
    }

    public Location getWardLocation() {
        return wardLocation;
    }

    public void setWardLocation(Location wardLocation) {
        this.wardLocation = wardLocation;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        WardDTO wardDTO = (WardDTO) o;
        if (wardDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), wardDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "WardDTO{" +
            "id=" + getId() +
            ", wardReferenceId='" + getWardReferenceId() + "'" +
            ", wardName='" + getWardName() + "'" +
            ", wardClassType='" + getWardClassType() + "'" +
            ", wardLocation='" + getWardLocation() + "'" +
            "}";
    }
}
