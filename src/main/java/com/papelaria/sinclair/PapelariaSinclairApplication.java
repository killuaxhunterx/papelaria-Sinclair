package com.papelaria.sinclair;

import com.papelaria.sinclair.entity.Produto;
import com.papelaria.sinclair.entity.Usuario;
import com.papelaria.sinclair.enums.Role;
import com.papelaria.sinclair.enums.StatusUsuario;
import com.papelaria.sinclair.repository.ProdutoRepository;
import com.papelaria.sinclair.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;

@SpringBootApplication
@RequiredArgsConstructor
public class PapelariaSinclairApplication {

    public static void main(String[] args) {
        SpringApplication.run(PapelariaSinclairApplication.class, args);
    }

    @Bean
    CommandLineRunner initData(UsuarioRepository usuarioRepository,
                               ProdutoRepository produtoRepository,
                               PasswordEncoder passwordEncoder) {
        return args -> {
            if (!usuarioRepository.existsByEmail("admin@sinclair.com")) {
                usuarioRepository.save(Usuario.builder()
                        .nome("Administrador")
                        .email("admin@sinclair.com")
                        .senha(passwordEncoder.encode("admin123"))
                        .status(StatusUsuario.ATIVO)
                        .role(Role.ADMIN)
                        .build());
            }

            if (!usuarioRepository.existsByEmail("cliente@sinclair.com")) {
                usuarioRepository.save(Usuario.builder()
                        .nome("Cliente Teste")
                        .email("cliente@sinclair.com")
                        .senha(passwordEncoder.encode("cliente123"))
                        .status(StatusUsuario.ATIVO)
                        .role(Role.CLIENTE)
                        .build());
            }

            if (produtoRepository.count() == 0) {
                produtoRepository.save(Produto.builder()
                        .nome("Caderno Universitário 10 Matérias")
                        .descricao("Caderno universitário 200 folhas, capa dura")
                        .preco(new BigDecimal("29.90"))
                        .quantidade(50)
                        .categoria("Cadernos")
                        .build());

                produtoRepository.save(Produto.builder()
                        .nome("Caneta BIC Azul")
                        .descricao("Caneta esferográfica ponta média")
                        .preco(new BigDecimal("2.50"))
                        .quantidade(200)
                        .categoria("Canetas")
                        .build());

                produtoRepository.save(Produto.builder()
                        .nome("Lápis Preto HB")
                        .descricao("Lápis grafite HB, caixa com 12 unidades")
                        .preco(new BigDecimal("8.90"))
                        .quantidade(100)
                        .categoria("Lápis")
                        .build());

                produtoRepository.save(Produto.builder()
                        .nome("Borracha Branca")
                        .descricao("Borracha macia para lápis")
                        .preco(new BigDecimal("1.50"))
                        .quantidade(150)
                        .categoria("Acessórios")
                        .build());

                produtoRepository.save(Produto.builder()
                        .nome("Marca Texto Amarelo")
                        .descricao("Caneta marca texto cor amarela")
                        .preco(new BigDecimal("4.90"))
                        .quantidade(80)
                        .categoria("Canetas")
                        .build());
            }
        };
    }
}
