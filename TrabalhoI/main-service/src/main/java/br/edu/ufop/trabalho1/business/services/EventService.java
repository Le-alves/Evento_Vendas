package br.edu.ufop.trabalho1.business.services;

import br.edu.ufop.trabalho1.business.converters.EventConverter;
import br.edu.ufop.trabalho1.domain.EventDomain;
import br.edu.ufop.trabalho1.domain.usecase.CreateEventUseCase;
import br.edu.ufop.trabalho1.domain.usecase.DeleteEventUseCase;
import br.edu.ufop.trabalho1.domain.usecase.UpdateEventUseCase;
import br.edu.ufop.trabalho1.dto.CreateEventDTO;
import br.edu.ufop.trabalho1.dto.EventDTO;
import br.edu.ufop.trabalho1.dto.UpdateEventDTO;
import br.edu.ufop.trabalho1.enums.EventType;
import br.edu.ufop.trabalho1.infrastructure.entities.EventEntity;
import br.edu.ufop.trabalho1.infrastructure.repositories.IEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EventService {

    private final IEventRepository repository;
    private final CreateEventUseCase createUseCase;
    private final UpdateEventUseCase updateUseCase;
    private final DeleteEventUseCase deleteUseCase;

    public List<EventDTO> getAll() {
        List<EventEntity> eventEntityList = repository.findAllByActiveTrue();
        return eventEntityList.stream()
                .map(EventConverter::toEventDTO)
                .toList();
    }

    public EventDTO create(CreateEventDTO createEventDTO) {
        EventDomain eventDomain = EventConverter.toEventDomain(createEventDTO);

        createUseCase.setEventDomain(eventDomain);
        createUseCase.validate();

        EventEntity entity = repository.save(
                EventConverter.toEventEntity(eventDomain)
        );

        return EventConverter.toEventDTO(entity);
    }

    public Optional<EventDTO> getById(UUID id) {
        Optional<EventEntity> eventEntityOptional = repository.findByIdAndActiveTrue(id);

        if (eventEntityOptional.isEmpty()) {
            return Optional.empty();
        }

        EventDTO eventDTO = EventConverter.toEventDTO(eventEntityOptional.get());
        return Optional.of(eventDTO);
    }

    public Optional<EventDTO> update(UUID id, UpdateEventDTO updateEventDTO) {
        Optional<EventEntity> existingEventOptional = repository.findByIdAndActiveTrue(id);

        if (existingEventOptional.isEmpty()) {
            return Optional.empty();
        }

        EventDomain eventDomain = EventConverter.toEventDomain(updateEventDTO);
        eventDomain.setId(id);

       
        updateUseCase.setEventDomain(eventDomain);
        updateUseCase.setEventId(id);
        updateUseCase.validate();

        EventEntity existingEntity = existingEventOptional.get();
        
 
        existingEntity.setDescription(eventDomain.getDescription());
        existingEntity.setType(eventDomain.getType());
        existingEntity.setDate(eventDomain.getDate());
        existingEntity.setStartSales(eventDomain.getStartSales());
        existingEntity.setEndSales(eventDomain.getEndSales());
        existingEntity.setPrice(eventDomain.getPrice());
        // updatedAt será atualizado automaticamente pelo @PreUpdate

        EventEntity savedEntity = repository.save(existingEntity);
        return Optional.of(EventConverter.toEventDTO(savedEntity));
    }

    public boolean delete(UUID id) {
       
        deleteUseCase.setEventId(id);
        deleteUseCase.validate();

        Optional<EventEntity> eventEntityOptional = repository.findByIdAndActiveTrue(id);

        if (eventEntityOptional.isEmpty()) {
            return false;
        }

        EventEntity entity = eventEntityOptional.get();
        entity.setActive(false); 
        repository.save(entity);
        return true;
    }

    public List<EventDTO> getByType(EventType type) {
        List<EventEntity> eventEntityList = repository.findAllByTypeAndActiveTrue(type);
        return eventEntityList.stream()
                .map(EventConverter::toEventDTO)
                .toList();
    }

    public List<EventDTO> searchByDescription(String description) {
        List<EventEntity> eventEntityList = repository
                .findAllByDescriptionContainingIgnoreCaseAndActiveTrue(description);
        return eventEntityList.stream()
                .map(EventConverter::toEventDTO)
                .toList();
    }

    public List<EventDTO> getEventsWithActiveSales() {
        LocalDateTime now = LocalDateTime.now();
        List<EventEntity> eventEntityList = repository.findEventsWithActiveSales(now);
        return eventEntityList.stream()
                .map(EventConverter::toEventDTO)
                .toList();
    }

    public List<EventDTO> getEventsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        List<EventEntity> eventEntityList = repository.findEventsByDateRange(startDate, endDate);
        return eventEntityList.stream()
                .map(EventConverter::toEventDTO)
                .toList();
    }
}