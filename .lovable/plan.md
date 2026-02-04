

## Plano: Remover Features e Integrar Botões de Login

### O que será feito

Este plano remove a seção "Features" da landing page e atualiza todos os botões de "Entrar" e "Cadastre-se" para direcionar corretamente à página de login (`/login`).

---

### Resumo das Alterações

| Arquivo | Alteração |
|---------|-----------|
| `src/pages/LandingPage.tsx` | Remover import e uso do componente `<Features />` |
| `src/components/landing/Navbar.tsx` | Alterar links dos botões "Entrar" e "Cadastre-se" de `/` para `/login` |
| `src/components/landing/Hero.tsx` | Alterar link do botão "Comece Grátis" de `/` para `/login` |
| `src/components/landing/CTA.tsx` | Alterar link do botão "Criar Conta Grátis" de `/` para `/login` |

---

### Detalhes Tecnicos

**1. LandingPage.tsx**
- Remover a linha de import: `import { Features } from "@/components/landing/Features";`
- Remover o componente `<Features />` do JSX

**2. Navbar.tsx** (4 alterações)
- Linha 43: `<Link to="/">` -> `<Link to="/login">`
- Linha 48: `<Link to="/">` -> `<Link to="/login">`
- Linha 83: `<Link to="/" className="block">` -> `<Link to="/login" className="block">`
- Linha 88: `<Link to="/" className="block">` -> `<Link to="/login" className="block">`

**3. Hero.tsx** (1 alteração)
- Linha 33: `<Link to="/">` -> `<Link to="/login">`

**4. CTA.tsx** (1 alteração)
- Linha 39: `<Link to="/">` -> `<Link to="/login">`

---

### Resultado Final

A landing page ficara mais limpa sem a seção de features, e todos os botões de autenticação direcionarao corretamente para a pagina de login em `/login`.

