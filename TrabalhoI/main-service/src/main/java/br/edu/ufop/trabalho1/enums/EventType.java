package br.edu.ufop.trabalho1.enums;

public enum EventType {
    PALESTRA(1, "Palestra"),
    SHOW(2, "Show"),
    TEATRO(3, "Teatro"),
    CURSO(4, "Curso"),
    WORKSHOP(5, "Workshop"),
    CONFERENCIA(6, "Conferência"),
    SEMINARIO(7, "Seminário");

    private final Integer code;
    private final String description;

    EventType(Integer code, String description) {
        this.code = code;
        this.description = description;
    }

    public Integer getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    public static EventType fromCode(Integer code) {
        for (EventType type : EventType.values()) {
            if (type.getCode().equals(code)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Código de tipo de evento inválido: " + code);
    }
}