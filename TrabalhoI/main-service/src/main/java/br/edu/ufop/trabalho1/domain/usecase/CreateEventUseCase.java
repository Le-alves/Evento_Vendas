package br.edu.ufop.trabalho1.domain.usecase;

import br.edu.ufop.trabalho1.domain.EventDomain;
import br.edu.ufop.trabalho1.exception.UseCaseException;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@RequiredArgsConstructor
@Component
public class CreateEventUseCase {

    @Setter
    private EventDomain eventDomain;

    public void validate() {
      
        validateDescription();
        validateType();
        validateDate();
        validateSalesDateRange();
        validatePrice();
        validateSalesBeforeEventDate();
    }

    private void validateDescription() {
        if (this.eventDomain.getDescription() == null || this.eventDomain.getDescription().trim().isEmpty()) {
            throw new UseCaseException("Descrição do evento é obrigatória");
        }
        if (this.eventDomain.getDescription().length() > 255) {
            throw new UseCaseException("Descrição do evento deve ter no máximo 255 caracteres");
        }
    }

    private void validateType() {
        if (this.eventDomain.getType() == null) {
            throw new UseCaseException("Tipo do evento é obrigatório");
        }
    }

    private void validateDate() {
        if (this.eventDomain.getDate() == null) {
            throw new UseCaseException("Data do evento é obrigatória");
        }
        if (this.eventDomain.getDate().isBefore(LocalDateTime.now())) {
            throw new UseCaseException("Data do evento deve ser futura");
        }
    }

    private void validateSalesDateRange() {
        if (this.eventDomain.getStartSales() == null) {
            throw new UseCaseException("Data de início das vendas é obrigatória");
        }
        if (this.eventDomain.getEndSales() == null) {
            throw new UseCaseException("Data de fim das vendas é obrigatória");
        }
        if (this.eventDomain.getStartSales().isAfter(this.eventDomain.getEndSales())) {
            throw new UseCaseException("Data de início das vendas deve ser anterior ao fim das vendas");
        }
    }

    private void validatePrice() {
        if (this.eventDomain.getPrice() == null) {
            throw new UseCaseException("Preço do evento é obrigatório");
        }
        if (this.eventDomain.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new UseCaseException("Preço do evento deve ser maior que zero");
        }
    }

    private void validateSalesBeforeEventDate() {
        if (this.eventDomain.getEndSales().isAfter(this.eventDomain.getDate())) {
            throw new UseCaseException("Período de vendas deve terminar antes da data do evento");
        }
    }
}