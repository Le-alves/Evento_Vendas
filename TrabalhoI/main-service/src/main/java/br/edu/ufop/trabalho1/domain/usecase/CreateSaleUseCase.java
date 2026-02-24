package br.edu.ufop.trabalho1.domain.usecase;

import br.edu.ufop.trabalho1.domain.EventDomain;
import br.edu.ufop.trabalho1.domain.SaleDomain;
import br.edu.ufop.trabalho1.exception.UseCaseException;
import br.edu.ufop.trabalho1.infrastructure.repositories.IEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@Component
public class CreateSaleUseCase {

    @Setter
    private SaleDomain saleDomain;
    
    @Setter
    private UUID eventId;
    
    private final IEventRepository eventRepository;

    public void validate() {
        
        validateUserId();
        validateEventId();
        validateEventExists();
        validateEventSalesActive();
        validatePurchaseDate();
        validatePurchaseStatus();
    }

    private void validateUserId() {
        if (this.saleDomain.getUserId() == null) {
            throw new UseCaseException("ID do usuário é obrigatório");
        }
    }

    private void validateEventId() {
        if (this.eventId == null) {
            throw new UseCaseException("ID do evento é obrigatório");
        }
    }

    private void validateEventExists() {
        Optional<br.edu.ufop.trabalho1.infrastructure.entities.EventEntity> eventOptional = 
                eventRepository.findByIdAndActiveTrue(this.eventId);
        
        if (eventOptional.isEmpty()) {
            throw new UseCaseException("Evento não encontrado ou não está ativo");
        }
        
       
        br.edu.ufop.trabalho1.infrastructure.entities.EventEntity eventEntity = eventOptional.get();
        EventDomain eventDomain = br.edu.ufop.trabalho1.business.converters.EventConverter.toDomain(eventEntity);
        this.saleDomain.setEvent(eventDomain);
    }

    private void validateEventSalesActive() {
        EventDomain event = this.saleDomain.getEvent();
        LocalDateTime now = LocalDateTime.now();
        
        if (now.isBefore(event.getStartSales())) {
            throw new UseCaseException("As vendas para este evento ainda não iniciaram");
        }
        
        if (now.isAfter(event.getEndSales())) {
            throw new UseCaseException("As vendas para este evento já encerraram");
        }
        
        if (now.isAfter(event.getDate())) {
            throw new UseCaseException("Não é possível vender ingressos para eventos que já ocorreram");
        }
    }

    private void validatePurchaseDate() {
        if (this.saleDomain.getPurchaseDate() == null) {
            this.saleDomain.setPurchaseDate(LocalDateTime.now());
        }
    }

    private void validatePurchaseStatus() {
        if (this.saleDomain.getPurchaseStatus() == null) {
            this.saleDomain.setPurchaseStatus(br.edu.ufop.trabalho1.enums.PurchaseStatus.EM_ABERTO);
        }
    }
}