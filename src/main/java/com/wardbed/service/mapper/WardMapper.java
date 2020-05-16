package com.wardbed.service.mapper;


import com.wardbed.domain.*;
import com.wardbed.service.dto.WardDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity {@link Ward} and its DTO {@link WardDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface WardMapper extends EntityMapper<WardDTO, Ward> {


    @Mapping(target = "beds", ignore = true)
    @Mapping(target = "removeBed", ignore = true)
    Ward toEntity(WardDTO wardDTO);

    default Ward fromId(Long id) {
        if (id == null) {
            return null;
        }
        Ward ward = new Ward();
        ward.setId(id);
        return ward;
    }
}
