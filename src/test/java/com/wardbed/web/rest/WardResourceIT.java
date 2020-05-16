package com.wardbed.web.rest;

import com.wardbed.WardBedApp;
import com.wardbed.domain.Ward;
import com.wardbed.repository.WardRepository;
import com.wardbed.service.WardService;
import com.wardbed.service.dto.WardDTO;
import com.wardbed.service.mapper.WardMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.wardbed.domain.enumeration.ClassType;
import com.wardbed.domain.enumeration.Location;
/**
 * Integration tests for the {@link WardResource} REST controller.
 */
@SpringBootTest(classes = WardBedApp.class)

@AutoConfigureMockMvc
@WithMockUser
public class WardResourceIT {

    private static final String DEFAULT_WARD_REFERENCE_ID = "WARD_08";
    private static final String UPDATED_WARD_REFERENCE_ID = "WARD_04";

    private static final String DEFAULT_WARD_NAME = "AAAAAAAAAA";
    private static final String UPDATED_WARD_NAME = "BBBBBBBBBB";

    private static final ClassType DEFAULT_WARD_CLASS_TYPE = ClassType.A;
    private static final ClassType UPDATED_WARD_CLASS_TYPE = ClassType.B;

    private static final Location DEFAULT_WARD_LOCATION = Location.A1;
    private static final Location UPDATED_WARD_LOCATION = Location.A2;

    @Autowired
    private WardRepository wardRepository;

    @Autowired
    private WardMapper wardMapper;

    @Autowired
    private WardService wardService;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restWardMockMvc;

    private Ward ward;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Ward createEntity(EntityManager em) {
        Ward ward = new Ward()
            .wardReferenceId(DEFAULT_WARD_REFERENCE_ID)
            .wardName(DEFAULT_WARD_NAME)
            .wardClassType(DEFAULT_WARD_CLASS_TYPE)
            .wardLocation(DEFAULT_WARD_LOCATION);
        return ward;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Ward createUpdatedEntity(EntityManager em) {
        Ward ward = new Ward()
            .wardReferenceId(UPDATED_WARD_REFERENCE_ID)
            .wardName(UPDATED_WARD_NAME)
            .wardClassType(UPDATED_WARD_CLASS_TYPE)
            .wardLocation(UPDATED_WARD_LOCATION);
        return ward;
    }

    @BeforeEach
    public void initTest() {
        ward = createEntity(em);
    }

    @Test
    @Transactional
    public void createWard() throws Exception {
        int databaseSizeBeforeCreate = wardRepository.findAll().size();

        // Create the Ward
        WardDTO wardDTO = wardMapper.toDto(ward);
        restWardMockMvc.perform(post("/api/wards")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(wardDTO)))
            .andExpect(status().isCreated());

        // Validate the Ward in the database
        List<Ward> wardList = wardRepository.findAll();
        assertThat(wardList).hasSize(databaseSizeBeforeCreate + 1);
        Ward testWard = wardList.get(wardList.size() - 1);
        assertThat(testWard.getWardReferenceId()).isEqualTo(DEFAULT_WARD_REFERENCE_ID);
        assertThat(testWard.getWardName()).isEqualTo(DEFAULT_WARD_NAME);
        assertThat(testWard.getWardClassType()).isEqualTo(DEFAULT_WARD_CLASS_TYPE);
        assertThat(testWard.getWardLocation()).isEqualTo(DEFAULT_WARD_LOCATION);
    }

    @Test
    @Transactional
    public void createWardWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = wardRepository.findAll().size();

        // Create the Ward with an existing ID
        ward.setId(1L);
        WardDTO wardDTO = wardMapper.toDto(ward);

        // An entity with an existing ID cannot be created, so this API call must fail
        restWardMockMvc.perform(post("/api/wards")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(wardDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Ward in the database
        List<Ward> wardList = wardRepository.findAll();
        assertThat(wardList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkWardReferenceIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = wardRepository.findAll().size();
        // set the field null
        ward.setWardReferenceId(null);

        // Create the Ward, which fails.
        WardDTO wardDTO = wardMapper.toDto(ward);

        restWardMockMvc.perform(post("/api/wards")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(wardDTO)))
            .andExpect(status().isBadRequest());

        List<Ward> wardList = wardRepository.findAll();
        assertThat(wardList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkWardNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = wardRepository.findAll().size();
        // set the field null
        ward.setWardName(null);

        // Create the Ward, which fails.
        WardDTO wardDTO = wardMapper.toDto(ward);

        restWardMockMvc.perform(post("/api/wards")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(wardDTO)))
            .andExpect(status().isBadRequest());

        List<Ward> wardList = wardRepository.findAll();
        assertThat(wardList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkWardClassTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = wardRepository.findAll().size();
        // set the field null
        ward.setWardClassType(null);

        // Create the Ward, which fails.
        WardDTO wardDTO = wardMapper.toDto(ward);

        restWardMockMvc.perform(post("/api/wards")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(wardDTO)))
            .andExpect(status().isBadRequest());

        List<Ward> wardList = wardRepository.findAll();
        assertThat(wardList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkWardLocationIsRequired() throws Exception {
        int databaseSizeBeforeTest = wardRepository.findAll().size();
        // set the field null
        ward.setWardLocation(null);

        // Create the Ward, which fails.
        WardDTO wardDTO = wardMapper.toDto(ward);

        restWardMockMvc.perform(post("/api/wards")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(wardDTO)))
            .andExpect(status().isBadRequest());

        List<Ward> wardList = wardRepository.findAll();
        assertThat(wardList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllWards() throws Exception {
        // Initialize the database
        wardRepository.saveAndFlush(ward);

        // Get all the wardList
        restWardMockMvc.perform(get("/api/wards?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(ward.getId().intValue())))
            .andExpect(jsonPath("$.[*].wardReferenceId").value(hasItem(DEFAULT_WARD_REFERENCE_ID)))
            .andExpect(jsonPath("$.[*].wardName").value(hasItem(DEFAULT_WARD_NAME)))
            .andExpect(jsonPath("$.[*].wardClassType").value(hasItem(DEFAULT_WARD_CLASS_TYPE.toString())))
            .andExpect(jsonPath("$.[*].wardLocation").value(hasItem(DEFAULT_WARD_LOCATION.toString())));
    }
    
    @Test
    @Transactional
    public void getWard() throws Exception {
        // Initialize the database
        wardRepository.saveAndFlush(ward);

        // Get the ward
        restWardMockMvc.perform(get("/api/wards/{id}", ward.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(ward.getId().intValue()))
            .andExpect(jsonPath("$.wardReferenceId").value(DEFAULT_WARD_REFERENCE_ID))
            .andExpect(jsonPath("$.wardName").value(DEFAULT_WARD_NAME))
            .andExpect(jsonPath("$.wardClassType").value(DEFAULT_WARD_CLASS_TYPE.toString()))
            .andExpect(jsonPath("$.wardLocation").value(DEFAULT_WARD_LOCATION.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingWard() throws Exception {
        // Get the ward
        restWardMockMvc.perform(get("/api/wards/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateWard() throws Exception {
        // Initialize the database
        wardRepository.saveAndFlush(ward);

        int databaseSizeBeforeUpdate = wardRepository.findAll().size();

        // Update the ward
        Ward updatedWard = wardRepository.findById(ward.getId()).get();
        // Disconnect from session so that the updates on updatedWard are not directly saved in db
        em.detach(updatedWard);
        updatedWard
            .wardReferenceId(UPDATED_WARD_REFERENCE_ID)
            .wardName(UPDATED_WARD_NAME)
            .wardClassType(UPDATED_WARD_CLASS_TYPE)
            .wardLocation(UPDATED_WARD_LOCATION);
        WardDTO wardDTO = wardMapper.toDto(updatedWard);

        restWardMockMvc.perform(put("/api/wards")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(wardDTO)))
            .andExpect(status().isOk());

        // Validate the Ward in the database
        List<Ward> wardList = wardRepository.findAll();
        assertThat(wardList).hasSize(databaseSizeBeforeUpdate);
        Ward testWard = wardList.get(wardList.size() - 1);
        assertThat(testWard.getWardReferenceId()).isEqualTo(UPDATED_WARD_REFERENCE_ID);
        assertThat(testWard.getWardName()).isEqualTo(UPDATED_WARD_NAME);
        assertThat(testWard.getWardClassType()).isEqualTo(UPDATED_WARD_CLASS_TYPE);
        assertThat(testWard.getWardLocation()).isEqualTo(UPDATED_WARD_LOCATION);
    }

    @Test
    @Transactional
    public void updateNonExistingWard() throws Exception {
        int databaseSizeBeforeUpdate = wardRepository.findAll().size();

        // Create the Ward
        WardDTO wardDTO = wardMapper.toDto(ward);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWardMockMvc.perform(put("/api/wards")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(wardDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Ward in the database
        List<Ward> wardList = wardRepository.findAll();
        assertThat(wardList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteWard() throws Exception {
        // Initialize the database
        wardRepository.saveAndFlush(ward);

        int databaseSizeBeforeDelete = wardRepository.findAll().size();

        // Delete the ward
        restWardMockMvc.perform(delete("/api/wards/{id}", ward.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Ward> wardList = wardRepository.findAll();
        assertThat(wardList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
