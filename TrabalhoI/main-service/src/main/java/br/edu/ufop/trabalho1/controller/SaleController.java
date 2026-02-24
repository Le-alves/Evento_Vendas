package br.edu.ufop.trabalho1.controller;

import br.edu.ufop.trabalho1.business.services.SaleService;
import br.edu.ufop.trabalho1.dto.CreateSaleDTO;
import br.edu.ufop.trabalho1.dto.SaleDTO;
import br.edu.ufop.trabalho1.dto.UpdateSaleDTO;
import br.edu.ufop.trabalho1.enums.PurchaseStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/sales")
@RequiredArgsConstructor
public class SaleController {

    private final SaleService saleService;

    @GetMapping("/status")
    public ResponseEntity<String> getStatus() {
        return ResponseEntity.ok("Sale service is running");
    }

    @GetMapping
    public ResponseEntity<List<SaleDTO>> getAll() {
        return ResponseEntity.ok(saleService.getAll());
    }

    @PostMapping
    public ResponseEntity<SaleDTO> create(
            @RequestBody CreateSaleDTO createSaleDTO) {
        return ResponseEntity.ok(saleService.create(createSaleDTO));
    }

    @GetMapping("/{saleId}")
    public ResponseEntity<SaleDTO> getById(@PathVariable(value = "saleId") UUID id) {
        Optional<SaleDTO> saleDTOOptional = saleService.getById(id);

        if (saleDTOOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(saleDTOOptional.get());
    }

    @PutMapping("/{saleId}")
    public ResponseEntity<SaleDTO> update(
            @PathVariable(value = "saleId") UUID id,
            @RequestBody UpdateSaleDTO updateSaleDTO) {
        
        Optional<SaleDTO> saleDTOOptional = saleService.update(id, updateSaleDTO);

        if (saleDTOOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(saleDTOOptional.get());
    }

    @DeleteMapping("/{saleId}")
    public ResponseEntity<Void> delete(@PathVariable(value = "saleId") UUID id) {
        boolean deleted = saleService.delete(id);
        
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().build();
    }

 
    @GetMapping("/status/{status}")
    public ResponseEntity<List<SaleDTO>> getByStatus(@PathVariable(value = "status") PurchaseStatus status) {
        List<SaleDTO> sales = saleService.getByStatus(status);
        return sales.isEmpty() ?
                ResponseEntity.notFound().build() :
                ResponseEntity.ok(sales);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SaleDTO>> getByUserId(@PathVariable(value = "userId") UUID userId) {
        List<SaleDTO> sales = saleService.getByUserId(userId);
        return sales.isEmpty() ?
                ResponseEntity.notFound().build() :
                ResponseEntity.ok(sales);
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<SaleDTO>> getByEventId(@PathVariable(value = "eventId") UUID eventId) {
        List<SaleDTO> sales = saleService.getByEventId(eventId);
        return sales.isEmpty() ?
                ResponseEntity.notFound().build() :
                ResponseEntity.ok(sales);
    }

    @GetMapping("/user/{userId}/status/{status}")
    public ResponseEntity<List<SaleDTO>> getSalesByUserAndStatus(
            @PathVariable(value = "userId") UUID userId,
            @PathVariable(value = "status") PurchaseStatus status) {
        List<SaleDTO> sales = saleService.getSalesByUserAndStatus(userId, status);
        return sales.isEmpty() ?
                ResponseEntity.notFound().build() :
                ResponseEntity.ok(sales);
    }

    @GetMapping("/event/{eventId}/status/{status}")
    public ResponseEntity<List<SaleDTO>> getSalesByEventAndStatus(
            @PathVariable(value = "eventId") UUID eventId,
            @PathVariable(value = "status") PurchaseStatus status) {
        List<SaleDTO> sales = saleService.getSalesByEventAndStatus(eventId, status);
        return sales.isEmpty() ?
                ResponseEntity.notFound().build() :
                ResponseEntity.ok(sales);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<SaleDTO>> getSalesByDateRange(
            @RequestParam(value = "startDate") String startDate,
            @RequestParam(value = "endDate") String endDate) {
        
        try {
            LocalDateTime start = LocalDateTime.parse(startDate);
            LocalDateTime end = LocalDateTime.parse(endDate);
            
            List<SaleDTO> sales = saleService.getSalesByDateRange(start, end);
            return sales.isEmpty() ?
                    ResponseEntity.notFound().build() :
                    ResponseEntity.ok(sales);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}