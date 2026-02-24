package br.edu.ufop.trabalho1.business.services;

import br.edu.ufop.trabalho1.business.converters.SaleConverter;
import br.edu.ufop.trabalho1.domain.SaleDomain;
import br.edu.ufop.trabalho1.domain.usecase.CreateSaleUseCase;
import br.edu.ufop.trabalho1.domain.usecase.DeleteSaleUseCase;
import br.edu.ufop.trabalho1.domain.usecase.UpdateSaleUseCase;
import br.edu.ufop.trabalho1.dto.CreateSaleDTO;
import br.edu.ufop.trabalho1.dto.SaleDTO;
import br.edu.ufop.trabalho1.dto.UpdateSaleDTO;
import br.edu.ufop.trabalho1.enums.PurchaseStatus;
import br.edu.ufop.trabalho1.infrastructure.entities.SaleEntity;
import br.edu.ufop.trabalho1.infrastructure.repositories.ISaleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SaleService {

    private final ISaleRepository saleRepository;
    private final CreateSaleUseCase createUseCase;
    private final UpdateSaleUseCase updateUseCase;
    private final DeleteSaleUseCase deleteUseCase;

    public List<SaleDTO> getAll() {
        List<SaleEntity> saleEntityList = saleRepository.findAllByActiveTrue();
        return saleEntityList.stream()
                .map(SaleConverter::toSaleDTO)
                .toList();
    }

    public SaleDTO create(CreateSaleDTO createSaleDTO) {
        SaleDomain saleDomain = SaleConverter.toSaleDomain(createSaleDTO);

        // Invocar o use case - create
        createUseCase.setSaleDomain(saleDomain);
        createUseCase.setEventId(createSaleDTO.eventId());
        createUseCase.validate();

        SaleEntity entity = saleRepository.save(
                SaleConverter.toSaleEntity(saleDomain)
        );

        return SaleConverter.toSaleDTO(entity);
    }

    public Optional<SaleDTO> getById(UUID id) {
        Optional<SaleEntity> saleEntityOptional = saleRepository.findByIdAndActiveTrue(id);

        if (saleEntityOptional.isEmpty()) {
            return Optional.empty();
        }

        SaleDTO saleDTO = SaleConverter.toSaleDTO(saleEntityOptional.get());
        return Optional.of(saleDTO);
    }

    public Optional<SaleDTO> update(UUID id, UpdateSaleDTO updateSaleDTO) {
        Optional<SaleEntity> existingSaleOptional = saleRepository.findByIdAndActiveTrue(id);

        if (existingSaleOptional.isEmpty()) {
            return Optional.empty();
        }

        SaleDomain saleDomain = SaleConverter.toSaleDomain(updateSaleDTO);
        saleDomain.setId(id);

    
        updateUseCase.setSaleDomain(saleDomain);
        updateUseCase.setSaleId(id);
        updateUseCase.validate();

        SaleEntity existingEntity = existingSaleOptional.get();
        

        existingEntity.setUserId(saleDomain.getUserId());
        existingEntity.setPurchaseDate(saleDomain.getPurchaseDate());
        existingEntity.setPurchaseStatus(saleDomain.getPurchaseStatus());
      
        SaleEntity savedEntity = saleRepository.save(existingEntity);
        return Optional.of(SaleConverter.toSaleDTO(savedEntity));
    }

    public boolean delete(UUID id) {
      
        deleteUseCase.setSaleId(id);
        deleteUseCase.validate();

        Optional<SaleEntity> saleEntityOptional = saleRepository.findByIdAndActiveTrue(id);

        if (saleEntityOptional.isEmpty()) {
            return false;
        }

        SaleEntity entity = saleEntityOptional.get();
        entity.setActive(false);
        saleRepository.save(entity);
        return true;
    }


    public List<SaleDTO> getByUserId(UUID userId) {
        List<SaleEntity> saleEntityList = saleRepository.findAllByUserIdAndActiveTrue(userId);
        return saleEntityList.stream()
                .map(SaleConverter::toSaleDTO)
                .toList();
    }

    public List<SaleDTO> getByEventId(UUID eventId) {
        List<SaleEntity> saleEntityList = saleRepository.findAllByEvent_IdAndActiveTrue(eventId);
        return saleEntityList.stream()
                .map(SaleConverter::toSaleDTO)
                .toList();
    }

    public List<SaleDTO> getByStatus(PurchaseStatus status) {
        List<SaleEntity> saleEntityList = saleRepository.findAllByPurchaseStatusAndActiveTrue(status);
        return saleEntityList.stream()
                .map(SaleConverter::toSaleDTO)
                .toList();
    }

    public List<SaleDTO> getSalesByUserAndStatus(UUID userId, PurchaseStatus status) {
        List<SaleEntity> saleEntityList = saleRepository.findSalesByUserAndStatus(userId, status);
        return saleEntityList.stream()
                .map(SaleConverter::toSaleDTO)
                .toList();
    }

    public List<SaleDTO> getSalesByEventAndStatus(UUID eventId, PurchaseStatus status) {
        List<SaleEntity> saleEntityList = saleRepository.findSalesByEventAndStatus(eventId, status);
        return saleEntityList.stream()
                .map(SaleConverter::toSaleDTO)
                .toList();
    }

    public List<SaleDTO> getSalesByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        List<SaleEntity> saleEntityList = saleRepository.findSalesByDateRange(startDate, endDate);
        return saleEntityList.stream()
                .map(SaleConverter::toSaleDTO)
                .toList();
    }
}