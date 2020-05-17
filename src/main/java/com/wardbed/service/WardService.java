package com.wardbed.service;

import com.wardbed.domain.Ward;
import com.wardbed.repository.WardRepository;
import com.wardbed.service.dto.WardDTO;
import com.wardbed.service.mapper.WardMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service Implementation for managing {@link Ward}.
 */
@Service
@Transactional
public class WardService {

    private final Logger log = LoggerFactory.getLogger(WardService.class);

    private final WardRepository wardRepository;

    private final WardMapper wardMapper;

    public WardService(WardRepository wardRepository, WardMapper wardMapper) {
        this.wardRepository = wardRepository;
        this.wardMapper = wardMapper;
    }

    @Transactional(readOnly = true)
    public Page<Ward> searchWardName (String searchWardName, Pageable page) {
        log.debug("Request to search for criteria Ward Name : {}", searchWardName);
        return wardRepository.searchWardNameOnly(searchWardName, page);
    }

    /**
     * Save a ward.
     *
     * @param wardDTO the entity to save.
     * @return the persisted entity.
     */
    public WardDTO save(WardDTO wardDTO) {
        log.debug("Request to save Ward : {}", wardDTO);
        Ward ward = wardMapper.toEntity(wardDTO);
        ward = wardRepository.save(ward);
        return wardMapper.toDto(ward);
    }

    /**
     * Get all the wards.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<WardDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Wards");
        return wardRepository.findAll(pageable)
            .map(wardMapper::toDto);
    }

    /**
     * Get one ward by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<WardDTO> findOne(Long id) {
        log.debug("Request to get Ward : {}", id);
        return wardRepository.findById(id)
            .map(wardMapper::toDto);
    }

    /**
     * Delete the ward by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Ward : {}", id);
        wardRepository.deleteById(id);
    }
}
