package br.edu.ufop.trabalho1.infrastructure.repositories;

import br.edu.ufop.trabalho1.enums.PurchaseStatus;
import br.edu.ufop.trabalho1.infrastructure.entities.SaleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ISaleRepository extends JpaRepository<SaleEntity, UUID> {

    List<SaleEntity> findAllByActiveTrue();
    
    Optional<SaleEntity> findByIdAndActiveTrue(UUID id);
    
    List<SaleEntity> findAllByUserIdAndActiveTrue(UUID userId);
    
    List<SaleEntity> findAllByEvent_IdAndActiveTrue(UUID eventId);
    
    List<SaleEntity> findAllByPurchaseStatusAndActiveTrue(PurchaseStatus status);
    
    @Query("SELECT s FROM SaleEntity s WHERE s.active = true AND s.userId = :userId AND s.purchaseStatus = :status")
    List<SaleEntity> findSalesByUserAndStatus(@Param("userId") UUID userId, 
                                            @Param("status") PurchaseStatus status);
    
    @Query("SELECT s FROM SaleEntity s WHERE s.active = true AND s.event.id = :eventId AND s.purchaseStatus = :status")
    List<SaleEntity> findSalesByEventAndStatus(@Param("eventId") UUID eventId, 
                                             @Param("status") PurchaseStatus status);
    
    @Query("SELECT s FROM SaleEntity s WHERE s.active = true AND s.purchaseDate >= :startDate AND s.purchaseDate <= :endDate")
    List<SaleEntity> findSalesByDateRange(@Param("startDate") LocalDateTime startDate, 
                                        @Param("endDate") LocalDateTime endDate);
}