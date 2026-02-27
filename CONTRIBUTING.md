# Guia de contribuição

## Branches

- **main** — branch principal. Código em produção/demonstração.
- Novas funcionalidades e correções devem ser feitas em branches derivadas de `main` (ex.: `feat/crud-listings`, `fix/health-response`). Quando houver fluxo de PR, abrir merge request para `main`.

## Commits

- Use **Conventional Commits**:
  - `feat:` nova funcionalidade
  - `fix:` correção de bug
  - `docs:` apenas documentação
  - `chore:` tarefas de build, config, etc.
  - `refactor:` refatoração sem mudança de comportamento
- Faça **commits pequenos**, por feature ou fix, para facilitar revisão e histórico.

## Checklist de PR (quando houver Pull Requests)

- [ ] Código compila e testes passam (`mvn verify`).
- [ ] Novos endpoints ou mudanças relevantes documentados no Swagger/README se fizer sentido.
- [ ] Sem credenciais ou dados sensíveis no código.
- [ ] Mensagens de commit no padrão Conventional Commits.

## Rodar testes

```bash
mvn test
```

Para os testes que dependem de banco, tenha o Postgres rodando (ex.: `docker compose up -d`) ou use o profile adequado conforme documentado no README.
