package com.wardbed.repository;

import com.wardbed.domain.Ward;
import com.wardbed.domain.Bed;
import com.wardbed.service.dto.WardDTO;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;

/**
 * Spring Data  repository for the Ward entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WardRepository extends JpaRepository<Ward, Long> {

  @Query("FROM Ward t "
    + "WHERE LOWER (t.wardName) "
    + "LIKE LOWER (CONCAT('%', :wardName, '%'))"
  )       
  public Page<Ward>searchWardNameOnly(@Param("wardName") String wardName, Pageable page);

}
