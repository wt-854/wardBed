package com.wardbed.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;
import java.util.HashSet;
import java.util.Set;

import com.wardbed.domain.enumeration.ClassType;

import com.wardbed.domain.enumeration.Location;

/**
 * A Ward.
 */
@Entity
@Table(name = "TBL_WARD")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Ward implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 7)
    @Pattern(regexp = "^WARD_(0[1-9]|10)$")
    @Column(name = "ward_reference_id", length = 7, nullable = false, unique = true)
    private String wardReferenceId;

    @NotNull
    @Size(max = 10)
    @Column(name = "ward_name", length = 10, nullable = false, unique = true)
    private String wardName;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "ward_class_type", nullable = false)
    private ClassType wardClassType;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "ward_location", nullable = false)
    private Location wardLocation;

    @OneToMany(mappedBy = "ward")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Bed> beds = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getWardReferenceId() {
        return wardReferenceId;
    }

    public Ward wardReferenceId(String wardReferenceId) {
        this.wardReferenceId = wardReferenceId;
        return this;
    }

    public void setWardReferenceId(String wardReferenceId) {
        this.wardReferenceId = wardReferenceId;
    }

    public String getWardName() {
        return wardName;
    }

    public Ward wardName(String wardName) {
        this.wardName = wardName;
        return this;
    }

    public void setWardName(String wardName) {
        this.wardName = wardName;
    }

    public ClassType getWardClassType() {
        return wardClassType;
    }

    public Ward wardClassType(ClassType wardClassType) {
        this.wardClassType = wardClassType;
        return this;
    }

    public void setWardClassType(ClassType wardClassType) {
        this.wardClassType = wardClassType;
    }

    public Location getWardLocation() {
        return wardLocation;
    }

    public Ward wardLocation(Location wardLocation) {
        this.wardLocation = wardLocation;
        return this;
    }

    public void setWardLocation(Location wardLocation) {
        this.wardLocation = wardLocation;
    }

    public Set<Bed> getBeds() {
        return beds;
    }

    public Ward beds(Set<Bed> beds) {
        this.beds = beds;
        return this;
    }

    public Ward addBed(Bed bed) {
        this.beds.add(bed);
        bed.setWard(this);
        return this;
    }

    public Ward removeBed(Bed bed) {
        this.beds.remove(bed);
        bed.setWard(null);
        return this;
    }

    public void setBeds(Set<Bed> beds) {
        this.beds = beds;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Ward)) {
            return false;
        }
        return id != null && id.equals(((Ward) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Ward{" +
            "id=" + getId() +
            ", wardReferenceId='" + getWardReferenceId() + "'" +
            ", wardName='" + getWardName() + "'" +
            ", wardClassType='" + getWardClassType() + "'" +
            ", wardLocation='" + getWardLocation() + "'" +
            "}";
    }
}
