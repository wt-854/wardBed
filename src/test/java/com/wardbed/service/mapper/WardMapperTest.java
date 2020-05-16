package com.wardbed.service.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class WardMapperTest {

    private WardMapper wardMapper;

    @BeforeEach
    public void setUp() {
        wardMapper = new WardMapperImpl();
    }

    @Test
    public void testEntityFromId() {
        Long id = 1L;
        assertThat(wardMapper.fromId(id).getId()).isEqualTo(id);
        assertThat(wardMapper.fromId(null)).isNull();
    }
}
