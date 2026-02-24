package br.edu.ufop.trabalho1.infrastructure.entities;

import br.edu.ufop.trabalho1.enums.PurchaseStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tb_sales")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SaleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private UUID userId;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private EventEntity event;

    @Column(nullable = false)
    private LocalDateTime purchaseDate;

    @Column(nullable = false)
    @Enumerated(EnumType.ORDINAL)
    private PurchaseStatus purchaseStatus;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Column(nullable = false, columnDefinition = "boolean default true")
    private Boolean active;

    @PrePersist
    public void beforeSave() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.active = true;
        if (this.purchaseDate == null) {
            this.purchaseDate = LocalDateTime.now();
        }
        if (this.purchaseStatus == null) {
            this.purchaseStatus = PurchaseStatus.EM_ABERTO;
        }
    }

    @PreUpdate
    public void beforeUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}