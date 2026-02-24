package br.edu.ufop.trabalho1.dto;

import br.edu.ufop.trabalho1.enums.PurchaseStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record UpdateSaleDTO(UUID userId,
                           UUID eventId,
                           LocalDateTime purchaseDate,
                           PurchaseStatus purchaseStatus) {
}