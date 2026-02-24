package br.edu.ufop.trabalho1.domain.usecase;

import br.edu.ufop.trabalho1.enums.PurchaseStatus;
import br.edu.ufop.trabalho1.exception.UseCaseException;
import br.edu.ufop.trabalho1.infrastructure.repositories.ISaleRepository;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@Component
public class DeleteSaleUseCase {

    @Setter
    private UUID saleId;
    
    private final ISaleRepository saleRepository;

    public void validate() {
    
        validateSaleId();
        validateSaleExists();
        validateSaleCanBeDeleted();
    }

    private void validateSaleId() {
        if (this.saleId == null) {
            throw new UseCaseException("ID da venda é obrigatório");
        }
    }

    private void validateSaleExists() {
        if (saleRepository.findByIdAndActiveTrue(this.saleId).isEmpty()) {
            throw new UseCaseException("Venda não encontrada ou já foi removida");
        }
    }

    private void validateSaleCanBeDeleted() {
        Optional<br.edu.ufop.trabalho1.infrastructure.entities.SaleEntity> saleOptional = 
                saleRepository.findByIdAndActiveTrue(this.saleId);
        
        if (saleOptional.isPresent()) {
            PurchaseStatus status = saleOptional.get().getPurchaseStatus();
            
            // Não permitir remoção de vendas pagas (deve ser estornado primeiro)
            if (status == PurchaseStatus.PAGO) {
                throw new UseCaseException("Não é possível remover vendas pagas. Execute um estorno primeiro.");
            }
        }
    }
}