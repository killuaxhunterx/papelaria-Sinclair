package com.papelaria.sinclair.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PerfilUpdateRequest {

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    private String novaSenha;
}
