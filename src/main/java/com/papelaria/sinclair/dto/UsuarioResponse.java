package com.papelaria.sinclair.dto;

import com.papelaria.sinclair.enums.Role;
import com.papelaria.sinclair.enums.StatusUsuario;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UsuarioResponse {
    private Long id;
    private String nome;
    private String email;
    private StatusUsuario status;
    private Role role;
}
