package br.edu.ufop.trabalho1.dto;

import br.edu.ufop.trabalho1.enums.EventType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record UpdateEventDTO(String description,
                            EventType type,
                            LocalDateTime date,
                            LocalDateTime startSales,
                            LocalDateTime endSales,
                            BigDecimal price) {
}