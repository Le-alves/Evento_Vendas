package br.edu.ufop.trabalho1.domain.usecase;

import br.edu.ufop.trabalho1.exception.UseCaseException;
import br.edu.ufop.trabalho1.infrastructure.repositories.IEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;

import java.util.UUID;

@RequiredArgsConstructor
@Component
public class DeleteEventUseCase {

    @Setter
    private UUID eventId;
    
    private final IEventRepository repository;

    public void validate() {
       
        validateEventId();
        validateEventExists();
     
    }

    private void validateEventId() {
        if (this.eventId == null) {
            throw new UseCaseException("ID do evento é obrigatório");
        }
    }

    private void validateEventExists() {
        if (repository.findByIdAndActiveTrue(this.eventId).isEmpty()) {
            throw new UseCaseException("Evento não encontrado ou já foi removido");
        }
    }
}