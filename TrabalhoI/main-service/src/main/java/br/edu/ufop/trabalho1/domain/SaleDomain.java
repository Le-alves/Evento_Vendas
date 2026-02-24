package br.edu.ufop.trabalho1.domain;

import br.edu.ufop.trabalho1.enums.PurchaseStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SaleDomain {

    private UUID id;
    private UUID userId;
    private EventDomain event;
    private LocalDateTime purchaseDate;
    private PurchaseStatus purchaseStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean active;
}