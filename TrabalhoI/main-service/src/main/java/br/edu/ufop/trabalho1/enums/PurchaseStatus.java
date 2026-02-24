package br.edu.ufop.trabalho1.enums;

public enum PurchaseStatus {
    EM_ABERTO(1, "Em aberto"),
    PAGO(2, "Pago"),
    CANCELADO(3, "Cancelado"),
    ESTORNADO(4, "Estornado");

    private final Integer code;
    private final String description;

    PurchaseStatus(Integer code, String description) {
        this.code = code;
        this.description = description;
    }

    public Integer getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    public static PurchaseStatus fromCode(Integer code) {
        for (PurchaseStatus status : PurchaseStatus.values()) {
            if (status.getCode().equals(code)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Código de status de compra inválido: " + code);
    }
}