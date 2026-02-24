package br.edu.ufop.trabalho1.domain.usecase;

import br.edu.ufop.trabalho1.domain.SaleDomain;
import br.edu.ufop.trabalho1.enums.PurchaseStatus;
import br.edu.ufop.trabalho1.exception.UseCaseException;
import br.edu.ufop.trabalho1.infrastructure.repositories.IEventRepository;
import br.edu.ufop.trabalho1.infrastructure.repositories.ISaleRepository;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;

import java.util.UUID;

@RequiredArgsConstructor
@Component
public class UpdateSaleUseCase {

    @Setter
    private SaleDomain saleDomain;
    
    @Setter
    private UUID saleId;
    
    private final ISaleRepository saleRepository;
    private final IEventRepository eventRepository;

    public void validate() {
        // Validações para atualização da venda
        validateSaleExists();
        validateUserId();
        validatePurchaseStatus();
        validatePurchaseDate();
    }

    private void validateSaleExists() {
        if (this.saleId == null) {
            throw new UseCaseException("ID da venda é obrigatório");
        }
        if (saleRepository.findByIdAndActiveTrue(this.saleId).isEmpty()) {
            throw new UseCaseException("Venda não encontrada ou foi removida");
        }
    }

    private void validateUserId() {
        if (this.saleDomain.getUserId() == null) {
            throw new UseCaseException("ID do usuário é obrigatório");
        }
    }

    private void validatePurchaseStatus() {
        if (this.saleDomain.getPurchaseStatus() == null) {
            throw new UseCaseException("Status da compra é obrigatório");
        }
        
    
        var existingSale = saleRepository.findByIdAndActiveTrue(this.saleId);
        if (existingSale.isPresent()) {
            PurchaseStatus currentStatus = existingSale.get().getPurchaseStatus();
            PurchaseStatus newStatus = this.saleDomain.getPurchaseStatus();
            
            
            if (currentStatus == PurchaseStatus.PAGO && newStatus != PurchaseStatus.ESTORNADO) {
                throw new UseCaseException("Vendas pagas só podem ser estornadas");
            }
            
            
            if (currentStatus == PurchaseStatus.CANCELADO && newStatus != PurchaseStatus.CANCELADO) {
                throw new UseCaseException("Não é possível alterar o status de vendas canceladas");
            }
            
            if (currentStatus == PurchaseStatus.ESTORNADO && newStatus != PurchaseStatus.ESTORNADO) {
                throw new UseCaseException("Não é possível alterar o status de vendas estornadas");
            }
        }
    }

    private void validatePurchaseDate() {
        if (this.saleDomain.getPurchaseDate() == null) {
            throw new UseCaseException("Data da compra é obrigatória");
        }
    }
}