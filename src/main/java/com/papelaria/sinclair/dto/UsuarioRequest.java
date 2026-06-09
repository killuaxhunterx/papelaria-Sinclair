package com.papelaria.sinclair.dto;

import com.papelaria.sinclair.enums.Role;
import com.papelaria.sinclair.enums.StatusUsuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UsuarioRequest {

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    @NotBlank(message = "E-mail é obrigatório")
    @Email(message = "E-mail inválido")
    private String email;

    @NotBlank(message = "Senha é obrigatória")
    private String senha;

    @NotNull(message = "Status é obrigatório")
    private StatusUsuario status;

    @NotNull(message = "Role é obrigatória")
    private Role role;
}
