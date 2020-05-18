package com.wardbed.repository;

import com.wardbed.domain.Bed;
import com.wardbed.service.dto.BedDTO;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;

/**
 * Spring Data  repository for the Bed entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BedRepository extends JpaRepository<Bed, Long> {

    @Query("FROM Bed t "
    + "WHERE LOWER (t.bedName) "
    + "LIKE LOWER (CONCAT('%', :bedName, '%'))"
  )       
  public Page<Bed>searchBedNameOnly(@Param("bedName") String bedName, Pageable page);
}
