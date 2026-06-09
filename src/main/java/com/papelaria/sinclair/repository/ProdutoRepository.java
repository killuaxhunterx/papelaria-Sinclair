package com.papelaria.sinclair.repository;

import com.papelaria.sinclair.entity.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    List<Produto> findByNomeContainingIgnoreCaseOrCategoriaContainingIgnoreCase(String nome, String categoria);
}
