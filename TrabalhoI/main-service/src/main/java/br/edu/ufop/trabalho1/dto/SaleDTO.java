package br.edu.ufop.trabalho1.dto;

import br.edu.ufop.trabalho1.enums.PurchaseStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record SaleDTO(UUID id,
                     UUID userId,
                     EventDTO event,
                     LocalDateTime purchaseDate,
                     PurchaseStatus purchaseStatus,
                     LocalDateTime createdAt,
                     LocalDateTime updatedAt) {
}