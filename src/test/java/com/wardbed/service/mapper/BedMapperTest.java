package com.wardbed.service.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class BedMapperTest {

    private BedMapper bedMapper;

    @BeforeEach
    public void setUp() {
        bedMapper = new BedMapperImpl();
    }

    @Test
    public void testEntityFromId() {
        Long id = 1L;
        assertThat(bedMapper.fromId(id).getId()).isEqualTo(id);
        assertThat(bedMapper.fromId(null)).isNull();
    }
}
