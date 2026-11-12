# Encomendas - Localize

Aplicação minimalista para rastreamento de remessas e encomendas construída com Next.js, TypeScript e Tailwind CSS.

🚀 **Deploy em Produção (Vercel):**  
🔗 [https://encomendas-by-gbtavares.vercel.app/](https://encomendas-by-gbtavares.vercel.app/)

---

## 🎨 Design & Identidade Visual
- **Fundo:** Creme (`#fbf9f5`)
- **Textos:** Preto (`#000000`)
- **Ações e Destaques:** Azul `#1717b3`
- **Padrão:** Shadcn minimalista

---

## 📦 Estrutura

- `src/_data/encomendas.ts`: Modelos de dados (`User`, `Encomenda`, `RastreamentoEvento`) e lista de remessas.
- `src/app/page.tsx`: Tela principal com listagem de encomendas e status.
- `src/app/encomendas/[id]/page.tsx`: Página de detalhes completos (Remetente, Destinatário e Timeline de rastreamento por onde passou).

---

## 💻 Desenvolvimento Local

```bash
cd encomendas
npm install
npm run dev
```

Acesse em `http://localhost:3000`.
