package br.edu.ufop.trabalho1.business.converters;

import br.edu.ufop.trabalho1.domain.EventDomain;
import br.edu.ufop.trabalho1.domain.SaleDomain;
import br.edu.ufop.trabalho1.dto.CreateSaleDTO;
import br.edu.ufop.trabalho1.dto.SaleDTO;
import br.edu.ufop.trabalho1.dto.UpdateSaleDTO;
import br.edu.ufop.trabalho1.infrastructure.entities.SaleEntity;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class SaleConverter {

  
    public static SaleDomain toSaleDomain(CreateSaleDTO createSaleDTO) {
        return SaleDomain.builder()
                .userId(createSaleDTO.userId())
                .purchaseDate(createSaleDTO.purchaseDate())
                .purchaseStatus(createSaleDTO.purchaseStatus())
                .build();
    }

   
    public static SaleDomain toSaleDomain(UpdateSaleDTO updateSaleDTO) {
        return SaleDomain.builder()
                .userId(updateSaleDTO.userId())
                .purchaseDate(updateSaleDTO.purchaseDate())
                .purchaseStatus(updateSaleDTO.purchaseStatus())
                .build();
    }

    
    public static SaleEntity toSaleEntity(SaleDomain saleDomain) {
        return SaleEntity.builder()
                .id(saleDomain.getId())
                .userId(saleDomain.getUserId())
                .event(saleDomain.getEvent() != null ? EventConverter.toEventEntity(saleDomain.getEvent()) : null)
                .purchaseDate(saleDomain.getPurchaseDate())
                .purchaseStatus(saleDomain.getPurchaseStatus())
                .createdAt(saleDomain.getCreatedAt())
                .updatedAt(saleDomain.getUpdatedAt())
                .active(saleDomain.getActive())
                .build();
    }

  
    public static SaleDomain toDomain(SaleEntity saleEntity) {
        return SaleDomain.builder()
                .id(saleEntity.getId())
                .userId(saleEntity.getUserId())
                .event(saleEntity.getEvent() != null ? EventConverter.toDomain(saleEntity.getEvent()) : null)
                .purchaseDate(saleEntity.getPurchaseDate())
                .purchaseStatus(saleEntity.getPurchaseStatus())
                .createdAt(saleEntity.getCreatedAt())
                .updatedAt(saleEntity.getUpdatedAt())
                .active(saleEntity.getActive())
                .build();
    }

   
    public static SaleDTO toSaleDTO(SaleEntity saleEntity) {
        SaleDomain saleDomain = toDomain(saleEntity);
        return toSaleDTO(saleDomain);
    }

 
    public static SaleDTO toSaleDTO(SaleDomain saleDomain) {
        return new SaleDTO(
                saleDomain.getId(),
                saleDomain.getUserId(),
                saleDomain.getEvent() != null ? EventConverter.toEventDTO(saleDomain.getEvent()) : null,
                saleDomain.getPurchaseDate(),
                saleDomain.getPurchaseStatus(),
                saleDomain.getCreatedAt(),
                saleDomain.getUpdatedAt()
        );
    }
}