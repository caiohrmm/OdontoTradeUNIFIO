# Postman — OdontoTrade API

## Importar a collection

1. Abra o **Postman**.
2. Clique em **Import** e selecione o arquivo `OdontoTrade-API.postman_collection.json`, ou arraste o arquivo para a janela do Postman.

## Variáveis da collection

| Variável    | Uso |
|------------|-----|
| `baseUrl`  | URL base da API (default: `http://localhost:8080`). Altere se a API estiver em outro host/porta. |
| `token`    | Preenchida automaticamente após **Login** ou **Register**. Usada no header `Authorization: Bearer {{token}}`. |
| `listingId`| Preenchida automaticamente após **Criar anúncio**. Usada em GET/PUT/DELETE de um anúncio específico. |
| `categoryId` | Preencha manualmente com um UUID de categoria (após listar ou criar) para usar em categorias e anúncios. |

## Ordem sugerida para testar

1. **Health > Healthcheck API** — conferir se a API está no ar.
2. **Auth > Register** ou **Auth > Login** — obter e salvar o token.
3. **User > Me** — conferir dados do usuário logado.
4. **Categories > Listar** — (opcional) **Criar categoria** e copiar o `id` para a variável `categoryId`.
5. **Listings > Criar anúncio** — (opcional) usar `categoryId`; o `listingId` é salvo automaticamente.
6. **Listings > Listar anúncios**, **Buscar por ID**, **Atualizar**, **Marcar como vendido**, **Excluir**.
7. **Upload > Upload imagem** — selecionar um arquivo de imagem (requer Cloudinary configurado).

## Observações

- Endpoints que exigem autenticação usam `Authorization: Bearer {{token}}`. Execute **Login** ou **Register** antes.
- Para **Upload imagem**, escolha um arquivo no corpo da requisição (form-data, campo `file`).
- Se mudar de ambiente (ex.: produção), altere apenas a variável `baseUrl` na collection.
