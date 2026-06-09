package com.papelaria.sinclair.service;

import com.papelaria.sinclair.dto.PerfilUpdateRequest;
import com.papelaria.sinclair.dto.UsuarioRequest;
import com.papelaria.sinclair.dto.UsuarioResponse;
import com.papelaria.sinclair.entity.Usuario;
import com.papelaria.sinclair.exception.BusinessException;
import com.papelaria.sinclair.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public List<UsuarioResponse> listarTodos() {
        return usuarioRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public UsuarioResponse buscarPorId(Long id) {
        return toResponse(findById(id));
    }

    public UsuarioResponse criar(UsuarioRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Já existe um usuário cadastrado com este e-mail", HttpStatus.CONFLICT);
        }

        Usuario usuario = Usuario.builder()
                .nome(request.getNome())
                .email(request.getEmail())
                .senha(passwordEncoder.encode(request.getSenha()))
                .status(request.getStatus())
                .role(request.getRole())
                .build();

        return toResponse(usuarioRepository.save(usuario));
    }

    public UsuarioResponse atualizar(Long id, UsuarioRequest request) {
        Usuario usuario = findById(id);

        if (!usuario.getEmail().equals(request.getEmail()) && usuarioRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Já existe um usuário cadastrado com este e-mail", HttpStatus.CONFLICT);
        }

        usuario.setNome(request.getNome());
        usuario.setEmail(request.getEmail());
        usuario.setSenha(passwordEncoder.encode(request.getSenha()));
        usuario.setStatus(request.getStatus());
        usuario.setRole(request.getRole());

        return toResponse(usuarioRepository.save(usuario));
    }

    public void excluir(Long id) {
        findById(id);
        usuarioRepository.deleteById(id);
    }

    public List<UsuarioResponse> pesquisar(String termo) {
        return usuarioRepository
                .findByNomeContainingIgnoreCaseOrEmailContainingIgnoreCase(termo, termo)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public UsuarioResponse atualizarPerfil(String email, PerfilUpdateRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("Usuário não encontrado", HttpStatus.NOT_FOUND));

        usuario.setNome(request.getNome());

        if (request.getNovaSenha() != null && !request.getNovaSenha().isBlank()) {
            usuario.setSenha(passwordEncoder.encode(request.getNovaSenha()));
        }

        return toResponse(usuarioRepository.save(usuario));
    }

    private Usuario findById(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Usuário não encontrado", HttpStatus.NOT_FOUND));
    }

    private UsuarioResponse toResponse(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getStatus(),
                usuario.getRole()
        );
    }
}
