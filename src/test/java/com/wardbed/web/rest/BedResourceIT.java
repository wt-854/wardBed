package com.wardbed.web.rest;

import com.wardbed.WardBedApp;
import com.wardbed.domain.Bed;
import com.wardbed.repository.BedRepository;
import com.wardbed.service.BedService;
import com.wardbed.service.dto.BedDTO;
import com.wardbed.service.mapper.BedMapper;

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
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link BedResource} REST controller.
 */
@SpringBootTest(classes = WardBedApp.class)

@AutoConfigureMockMvc
@WithMockUser
public class BedResourceIT {

    private static final String DEFAULT_BED_REFERENCE_ID = "BED_06";
    private static final String UPDATED_BED_REFERENCE_ID = "BED_10";

    private static final String DEFAULT_BED_NAME = "AAAAAAAAAA";
    private static final String UPDATED_BED_NAME = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_WARD_ALLOCATION_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_WARD_ALLOCATION_DATE = LocalDate.now(ZoneId.systemDefault());

    @Autowired
    private BedRepository bedRepository;

    @Autowired
    private BedMapper bedMapper;

    @Autowired
    private BedService bedService;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBedMockMvc;

    private Bed bed;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Bed createEntity(EntityManager em) {
        Bed bed = new Bed()
            .bedReferenceId(DEFAULT_BED_REFERENCE_ID)
            .bedName(DEFAULT_BED_NAME)
            .wardAllocationDate(DEFAULT_WARD_ALLOCATION_DATE);
        return bed;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Bed createUpdatedEntity(EntityManager em) {
        Bed bed = new Bed()
            .bedReferenceId(UPDATED_BED_REFERENCE_ID)
            .bedName(UPDATED_BED_NAME)
            .wardAllocationDate(UPDATED_WARD_ALLOCATION_DATE);
        return bed;
    }

    @BeforeEach
    public void initTest() {
        bed = createEntity(em);
    }

    @Test
    @Transactional
    public void createBed() throws Exception {
        int databaseSizeBeforeCreate = bedRepository.findAll().size();

        // Create the Bed
        BedDTO bedDTO = bedMapper.toDto(bed);
        restBedMockMvc.perform(post("/api/beds")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(bedDTO)))
            .andExpect(status().isCreated());

        // Validate the Bed in the database
        List<Bed> bedList = bedRepository.findAll();
        assertThat(bedList).hasSize(databaseSizeBeforeCreate + 1);
        Bed testBed = bedList.get(bedList.size() - 1);
        assertThat(testBed.getBedReferenceId()).isEqualTo(DEFAULT_BED_REFERENCE_ID);
        assertThat(testBed.getBedName()).isEqualTo(DEFAULT_BED_NAME);
        assertThat(testBed.getWardAllocationDate()).isEqualTo(DEFAULT_WARD_ALLOCATION_DATE);
    }

    @Test
    @Transactional
    public void createBedWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = bedRepository.findAll().size();

        // Create the Bed with an existing ID
        bed.setId(1L);
        BedDTO bedDTO = bedMapper.toDto(bed);

        // An entity with an existing ID cannot be created, so this API call must fail
        restBedMockMvc.perform(post("/api/beds")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(bedDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Bed in the database
        List<Bed> bedList = bedRepository.findAll();
        assertThat(bedList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkBedReferenceIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = bedRepository.findAll().size();
        // set the field null
        bed.setBedReferenceId(null);

        // Create the Bed, which fails.
        BedDTO bedDTO = bedMapper.toDto(bed);

        restBedMockMvc.perform(post("/api/beds")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(bedDTO)))
            .andExpect(status().isBadRequest());

        List<Bed> bedList = bedRepository.findAll();
        assertThat(bedList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkBedNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = bedRepository.findAll().size();
        // set the field null
        bed.setBedName(null);

        // Create the Bed, which fails.
        BedDTO bedDTO = bedMapper.toDto(bed);

        restBedMockMvc.perform(post("/api/beds")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(bedDTO)))
            .andExpect(status().isBadRequest());

        List<Bed> bedList = bedRepository.findAll();
        assertThat(bedList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkWardAllocationDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = bedRepository.findAll().size();
        // set the field null
        bed.setWardAllocationDate(null);

        // Create the Bed, which fails.
        BedDTO bedDTO = bedMapper.toDto(bed);

        restBedMockMvc.perform(post("/api/beds")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(bedDTO)))
            .andExpect(status().isBadRequest());

        List<Bed> bedList = bedRepository.findAll();
        assertThat(bedList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllBeds() throws Exception {
        // Initialize the database
        bedRepository.saveAndFlush(bed);

        // Get all the bedList
        restBedMockMvc.perform(get("/api/beds?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bed.getId().intValue())))
            .andExpect(jsonPath("$.[*].bedReferenceId").value(hasItem(DEFAULT_BED_REFERENCE_ID)))
            .andExpect(jsonPath("$.[*].bedName").value(hasItem(DEFAULT_BED_NAME)))
            .andExpect(jsonPath("$.[*].wardAllocationDate").value(hasItem(DEFAULT_WARD_ALLOCATION_DATE.toString())));
    }
    
    @Test
    @Transactional
    public void getBed() throws Exception {
        // Initialize the database
        bedRepository.saveAndFlush(bed);

        // Get the bed
        restBedMockMvc.perform(get("/api/beds/{id}", bed.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(bed.getId().intValue()))
            .andExpect(jsonPath("$.bedReferenceId").value(DEFAULT_BED_REFERENCE_ID))
            .andExpect(jsonPath("$.bedName").value(DEFAULT_BED_NAME))
            .andExpect(jsonPath("$.wardAllocationDate").value(DEFAULT_WARD_ALLOCATION_DATE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingBed() throws Exception {
        // Get the bed
        restBedMockMvc.perform(get("/api/beds/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateBed() throws Exception {
        // Initialize the database
        bedRepository.saveAndFlush(bed);

        int databaseSizeBeforeUpdate = bedRepository.findAll().size();

        // Update the bed
        Bed updatedBed = bedRepository.findById(bed.getId()).get();
        // Disconnect from session so that the updates on updatedBed are not directly saved in db
        em.detach(updatedBed);
        updatedBed
            .bedReferenceId(UPDATED_BED_REFERENCE_ID)
            .bedName(UPDATED_BED_NAME)
            .wardAllocationDate(UPDATED_WARD_ALLOCATION_DATE);
        BedDTO bedDTO = bedMapper.toDto(updatedBed);

        restBedMockMvc.perform(put("/api/beds")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(bedDTO)))
            .andExpect(status().isOk());

        // Validate the Bed in the database
        List<Bed> bedList = bedRepository.findAll();
        assertThat(bedList).hasSize(databaseSizeBeforeUpdate);
        Bed testBed = bedList.get(bedList.size() - 1);
        assertThat(testBed.getBedReferenceId()).isEqualTo(UPDATED_BED_REFERENCE_ID);
        assertThat(testBed.getBedName()).isEqualTo(UPDATED_BED_NAME);
        assertThat(testBed.getWardAllocationDate()).isEqualTo(UPDATED_WARD_ALLOCATION_DATE);
    }

    @Test
    @Transactional
    public void updateNonExistingBed() throws Exception {
        int databaseSizeBeforeUpdate = bedRepository.findAll().size();

        // Create the Bed
        BedDTO bedDTO = bedMapper.toDto(bed);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBedMockMvc.perform(put("/api/beds")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(bedDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Bed in the database
        List<Bed> bedList = bedRepository.findAll();
        assertThat(bedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteBed() throws Exception {
        // Initialize the database
        bedRepository.saveAndFlush(bed);

        int databaseSizeBeforeDelete = bedRepository.findAll().size();

        // Delete the bed
        restBedMockMvc.perform(delete("/api/beds/{id}", bed.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Bed> bedList = bedRepository.findAll();
        assertThat(bedList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
