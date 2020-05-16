package com.wardbed.web.rest;

import com.wardbed.service.WardService;
import com.wardbed.web.rest.errors.BadRequestAlertException;
import com.wardbed.service.dto.WardDTO;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.wardbed.domain.Ward}.
 */
@RestController
@RequestMapping("/api")
public class WardResource {

    private final Logger log = LoggerFactory.getLogger(WardResource.class);

    private static final String ENTITY_NAME = "ward";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final WardService wardService;

    public WardResource(WardService wardService) {
        this.wardService = wardService;
    }

    /**
     * {@code POST  /wards} : Create a new ward.
     *
     * @param wardDTO the wardDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new wardDTO, or with status {@code 400 (Bad Request)} if the ward has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/wards")
    public ResponseEntity<WardDTO> createWard(@Valid @RequestBody WardDTO wardDTO) throws URISyntaxException {
        log.debug("REST request to save Ward : {}", wardDTO);
        if (wardDTO.getId() != null) {
            throw new BadRequestAlertException("A new ward cannot already have an ID", ENTITY_NAME, "idexists");
        }
        WardDTO result = wardService.save(wardDTO);
        return ResponseEntity.created(new URI("/api/wards/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /wards} : Updates an existing ward.
     *
     * @param wardDTO the wardDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated wardDTO,
     * or with status {@code 400 (Bad Request)} if the wardDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the wardDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/wards")
    public ResponseEntity<WardDTO> updateWard(@Valid @RequestBody WardDTO wardDTO) throws URISyntaxException {
        log.debug("REST request to update Ward : {}", wardDTO);
        if (wardDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        WardDTO result = wardService.save(wardDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, wardDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /wards} : get all the wards.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of wards in body.
     */
    @GetMapping("/wards")
    public ResponseEntity<List<WardDTO>> getAllWards(Pageable pageable) {
        log.debug("REST request to get a page of Wards");
        Page<WardDTO> page = wardService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /wards/:id} : get the "id" ward.
     *
     * @param id the id of the wardDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the wardDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/wards/{id}")
    public ResponseEntity<WardDTO> getWard(@PathVariable Long id) {
        log.debug("REST request to get Ward : {}", id);
        Optional<WardDTO> wardDTO = wardService.findOne(id);
        return ResponseUtil.wrapOrNotFound(wardDTO);
    }

    /**
     * {@code DELETE  /wards/:id} : delete the "id" ward.
     *
     * @param id the id of the wardDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/wards/{id}")
    public ResponseEntity<Void> deleteWard(@PathVariable Long id) {
        log.debug("REST request to delete Ward : {}", id);
        wardService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
