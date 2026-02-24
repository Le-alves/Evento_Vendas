package br.edu.ufop.trabalho1.business.converters;

import br.edu.ufop.trabalho1.domain.EventDomain;
import br.edu.ufop.trabalho1.dto.CreateEventDTO;
import br.edu.ufop.trabalho1.dto.EventDTO;
import br.edu.ufop.trabalho1.dto.UpdateEventDTO;
import br.edu.ufop.trabalho1.infrastructure.entities.EventEntity;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class EventConverter {

    
    public static EventDomain toEventDomain(CreateEventDTO createEventDTO) {
        return EventDomain.builder()
                .description(createEventDTO.description())
                .type(createEventDTO.type())
                .date(createEventDTO.date())
                .startSales(createEventDTO.startSales())
                .endSales(createEventDTO.endSales())
                .price(createEventDTO.price())
                .build();
    }

    
    public static EventDomain toEventDomain(UpdateEventDTO updateEventDTO) {
        return EventDomain.builder()
                .description(updateEventDTO.description())
                .type(updateEventDTO.type())
                .date(updateEventDTO.date())
                .startSales(updateEventDTO.startSales())
                .endSales(updateEventDTO.endSales())
                .price(updateEventDTO.price())
                .build();
    }

   
    public static EventEntity toEventEntity(EventDomain eventDomain) {
        return EventEntity.builder()
                .id(eventDomain.getId())
                .description(eventDomain.getDescription())
                .type(eventDomain.getType())
                .date(eventDomain.getDate())
                .startSales(eventDomain.getStartSales())
                .endSales(eventDomain.getEndSales())
                .price(eventDomain.getPrice())
                .createdAt(eventDomain.getCreatedAt())
                .updatedAt(eventDomain.getUpdatedAt())
                .active(eventDomain.getActive())
                .build();
    }

   
    public static EventDomain toDomain(EventEntity eventEntity) {
        return EventDomain.builder()
                .id(eventEntity.getId())
                .description(eventEntity.getDescription())
                .type(eventEntity.getType())
                .date(eventEntity.getDate())
                .startSales(eventEntity.getStartSales())
                .endSales(eventEntity.getEndSales())
                .price(eventEntity.getPrice())
                .createdAt(eventEntity.getCreatedAt())
                .updatedAt(eventEntity.getUpdatedAt())
                .active(eventEntity.getActive())
                .build();
    }


    public static EventDTO toEventDTO(EventEntity eventEntity) {
        EventDomain eventDomain = toDomain(eventEntity);
        return toEventDTO(eventDomain);
    }

    
    public static EventDTO toEventDTO(EventDomain eventDomain) {
        return new EventDTO(
                eventDomain.getId(),
                eventDomain.getDescription(),
                eventDomain.getType(),
                eventDomain.getDate(),
                eventDomain.getStartSales(),
                eventDomain.getEndSales(),
                eventDomain.getPrice(),
                eventDomain.getCreatedAt(),
                eventDomain.getUpdatedAt()
        );
    }
}