package br.edu.ufop.trabalho1.controller;

import br.edu.ufop.trabalho1.business.services.EventService;
import br.edu.ufop.trabalho1.dto.CreateEventDTO;
import br.edu.ufop.trabalho1.dto.EventDTO;
import br.edu.ufop.trabalho1.dto.UpdateEventDTO;
import br.edu.ufop.trabalho1.enums.EventType;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping("/status")
    public ResponseEntity<String> getStatus() {
        return ResponseEntity.ok("Event service is running");
    }

    // Endpoints específicos ANTES dos genéricos
    @GetMapping("/type/{type}")
    public ResponseEntity<List<EventDTO>> getByType(@PathVariable(value = "type") EventType type) {
        List<EventDTO> events = eventService.getByType(type);
        return events.isEmpty() ?
                ResponseEntity.notFound().build() :
                ResponseEntity.ok(events);
    }

    @GetMapping("/search")
    public ResponseEntity<List<EventDTO>> searchByDescription(
            @RequestParam(value = "description") String description) {
        List<EventDTO> events = eventService.searchByDescription(description);
        return events.isEmpty() ?
                ResponseEntity.notFound().build() :
                ResponseEntity.ok(events);
    }

    @GetMapping("/active-sales")
    public ResponseEntity<List<EventDTO>> getEventsWithActiveSales() {
        List<EventDTO> events = eventService.getEventsWithActiveSales();
        return events.isEmpty() ?
                ResponseEntity.notFound().build() :
                ResponseEntity.ok(events);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<EventDTO>> getEventsByDateRange(
            @RequestParam(value = "startDate") String startDate,
            @RequestParam(value = "endDate") String endDate) {
        
        try {
            LocalDateTime start = LocalDateTime.parse(startDate);
            LocalDateTime end = LocalDateTime.parse(endDate);
            
            List<EventDTO> events = eventService.getEventsByDateRange(start, end);
            return events.isEmpty() ?
                    ResponseEntity.notFound().build() :
                    ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<EventDTO>> getAll() {
        return ResponseEntity.ok(eventService.getAll());
    }

    @PostMapping
    public ResponseEntity<EventDTO> create(
            @RequestBody CreateEventDTO createEventDTO) {
        return ResponseEntity.ok(eventService.create(createEventDTO));
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<EventDTO> getById(@PathVariable(value = "eventId") UUID id) {
        Optional<EventDTO> eventDTOOptional = eventService.getById(id);

        if (eventDTOOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(eventDTOOptional.get());
    }

    @PutMapping("/{eventId}")
    public ResponseEntity<EventDTO> update(
            @PathVariable(value = "eventId") UUID id,
            @RequestBody UpdateEventDTO updateEventDTO) {
        
        Optional<EventDTO> eventDTOOptional = eventService.update(id, updateEventDTO);

        if (eventDTOOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(eventDTOOptional.get());
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> delete(@PathVariable(value = "eventId") UUID id) {
        boolean deleted = eventService.delete(id);
        
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().build();
    }
}