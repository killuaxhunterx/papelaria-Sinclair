package com.papelaria.sinclair.controller;

import com.papelaria.sinclair.dto.PerfilUpdateRequest;
import com.papelaria.sinclair.dto.UsuarioResponse;
import com.papelaria.sinclair.entity.Usuario;
import com.papelaria.sinclair.exception.BusinessException;
import com.papelaria.sinclair.repository.UsuarioRepository;
import com.papelaria.sinclair.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/perfil")
@RequiredArgsConstructor
public class PerfilController {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<UsuarioResponse> meuPerfil(Authentication authentication) {
        Usuario usuario = usuarioRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new BusinessException("Usuário não encontrado", HttpStatus.NOT_FOUND));

        return ResponseEntity.ok(new UsuarioResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getStatus(),
                usuario.getRole()
        ));
    }

    @PutMapping
    public ResponseEntity<UsuarioResponse> atualizarPerfil(@Valid @RequestBody PerfilUpdateRequest request,
                                                           Authentication authentication) {
        return ResponseEntity.ok(usuarioService.atualizarPerfil(authentication.getName(), request));
    }
}
