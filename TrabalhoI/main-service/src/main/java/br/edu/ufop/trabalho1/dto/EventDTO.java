package br.edu.ufop.trabalho1.dto;

import br.edu.ufop.trabalho1.enums.EventType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record EventDTO(UUID id,
                      String description,
                      EventType type,
                      LocalDateTime date,
                      LocalDateTime startSales,
                      LocalDateTime endSales,
                      BigDecimal price,
                      LocalDateTime createdAt,
                      LocalDateTime updatedAt) {
}