package com.papelaria.sinclair.service;

import com.papelaria.sinclair.dto.ProdutoRequest;
import com.papelaria.sinclair.dto.ProdutoResponse;
import com.papelaria.sinclair.entity.Produto;
import com.papelaria.sinclair.exception.BusinessException;
import com.papelaria.sinclair.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public List<ProdutoResponse> listarTodos() {
        return produtoRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public ProdutoResponse buscarPorId(Long id) {
        return toResponse(findById(id));
    }

    public ProdutoResponse criar(ProdutoRequest request) {
        Produto produto = Produto.builder()
                .nome(request.getNome())
                .descricao(request.getDescricao())
                .preco(request.getPreco())
                .quantidade(request.getQuantidade())
                .categoria(request.getCategoria())
                .build();

        return toResponse(produtoRepository.save(produto));
    }

    public ProdutoResponse atualizar(Long id, ProdutoRequest request) {
        Produto produto = findById(id);

        produto.setNome(request.getNome());
        produto.setDescricao(request.getDescricao());
        produto.setPreco(request.getPreco());
        produto.setQuantidade(request.getQuantidade());
        produto.setCategoria(request.getCategoria());

        return toResponse(produtoRepository.save(produto));
    }

    public void excluir(Long id) {
        findById(id);
        produtoRepository.deleteById(id);
    }

    public List<ProdutoResponse> pesquisar(String termo) {
        return produtoRepository
                .findByNomeContainingIgnoreCaseOrCategoriaContainingIgnoreCase(termo, termo)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private Produto findById(Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Produto não encontrado", HttpStatus.NOT_FOUND));
    }

    private ProdutoResponse toResponse(Produto produto) {
        return new ProdutoResponse(
                produto.getId(),
                produto.getNome(),
                produto.getDescricao(),
                produto.getPreco(),
                produto.getQuantidade(),
                produto.getCategoria()
        );
    }
}
