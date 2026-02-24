package br.edu.ufop.trabalho1.domain;

import br.edu.ufop.trabalho1.enums.EventType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EventDomain {

    private UUID id;
    private String description;
    private EventType type;
    private LocalDateTime date;
    private LocalDateTime startSales;
    private LocalDateTime endSales;
    private BigDecimal price;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean active;
}