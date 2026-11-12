# Quando usar Controller / Use Case no Frontend?

Um Controller ou Use Case no frontend **só faz sentido existir se ele tiver trabalho real para fazer**.

Se a chamada for apenas um repasse direto de dados (`return gateway.getData()`), criar um controller é apenas burocracia desnecessária. Nesses casos, o componente chamar o gateway diretamente é mais simples, mais rápido e perfeitamente limpo.

---

## Casos em que o Controller / Use Case se justifica:

### 1. Orquestrar mais de um Gateway
Quando a tela precisa combinar dados vindos de fontes ou endpoints diferentes antes de renderizar:
```ts
// O controller orquestra 2 gateways e junta tudo
const [order, user] = await Promise.all([
  orderGateway.getOrder(),
  userGateway.getProfile(),
]);
```

### 2. Transformação ou Formatação de Dados para a UI (View-Model)
Quando o gateway traz dados brutos do backend e precisamos adaptá-los para a interface não ter que fazer cálculos ou formatações:
- Exemplo: converter `priceInCents: 5000` em `R$ 50,00`.
- Exemplo: formatar `createdAt: "2026-11-12T..."` para data legível.
- Exemplo: traduzir códigos de erro HTTP em mensagens amigáveis em português.

### 3. Validação de entrada
Antes de enviar dados para o backend (ex.: criação ou edição), validar os campos na borda do cliente usando bibliotecas como Zod:
```ts
const parsed = createOrderSchema.safeParse(data);
if (!parsed.success) {
  return failure({ message: "Dados inválidos", errors: parsed.error });
}
```

---

## Resumo prático

- **Sem orquestração nem transformação de dados:** o controller é burocracia. O componente chamar `orderGateway.getOrder()` diretamente é mais simples, mais rápido e perfeitamente limpo.
- **Com lógica complexa, orquestração ou validação:** crie uma camada intermediária (seja chamada de Controller, Service ou Use Case).
