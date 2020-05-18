package com.wardbed.service;

import com.wardbed.domain.Bed;
import com.wardbed.repository.BedRepository;
import com.wardbed.service.dto.BedDTO;
import com.wardbed.service.mapper.BedMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service Implementation for managing {@link Bed}.
 */
@Service
@Transactional
public class BedService {

    private final Logger log = LoggerFactory.getLogger(BedService.class);

    private final BedRepository bedRepository;

    private final BedMapper bedMapper;

    public BedService(BedRepository bedRepository, BedMapper bedMapper) {
        this.bedRepository = bedRepository;
        this.bedMapper = bedMapper;
    }

    @Transactional(readOnly = true)
    public Page<Bed> searchBedName (String searchBedName, Pageable page) {
        log.debug("Request to search for criteria Ward Name : {}", searchBedName);
        return bedRepository.searchBedNameOnly(searchBedName, page);
    }

    /**
     * Save a bed.
     *
     * @param bedDTO the entity to save.
     * @return the persisted entity.
     */
    public BedDTO save(BedDTO bedDTO) {
        log.debug("Request to save Bed : {}", bedDTO);
        Bed bed = bedMapper.toEntity(bedDTO);
        bed = bedRepository.save(bed);
        return bedMapper.toDto(bed);
    }

    /**
     * Get all the beds.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<BedDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Beds");
        return bedRepository.findAll(pageable)
            .map(bedMapper::toDto);
    }

    /**
     * Get one bed by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<BedDTO> findOne(Long id) {
        log.debug("Request to get Bed : {}", id);
        return bedRepository.findById(id)
            .map(bedMapper::toDto);
    }

    /**
     * Delete the bed by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Bed : {}", id);
        bedRepository.deleteById(id);
    }
}
