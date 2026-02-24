package br.edu.ufop.trabalho1.infrastructure.repositories;

import br.edu.ufop.trabalho1.enums.EventType;
import br.edu.ufop.trabalho1.infrastructure.entities.EventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface IEventRepository extends JpaRepository<EventEntity, UUID> {

    List<EventEntity> findAllByActiveTrue();
    
    Optional<EventEntity> findByIdAndActiveTrue(UUID id);
    
    List<EventEntity> findAllByTypeAndActiveTrue(EventType type);
    
    List<EventEntity> findAllByDescriptionContainingIgnoreCaseAndActiveTrue(String description);
    
    @Query("SELECT e FROM EventEntity e WHERE e.active = true AND e.date >= :startDate AND e.date <= :endDate")
    List<EventEntity> findEventsByDateRange(@Param("startDate") LocalDateTime startDate, 
                                          @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT e FROM EventEntity e WHERE e.active = true AND e.startSales <= :currentDate AND e.endSales >= :currentDate")
    List<EventEntity> findEventsWithActiveSales(@Param("currentDate") LocalDateTime currentDate);
}