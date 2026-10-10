# AGENTS.md — Skill & Diretrizes de Desenvolvimento (Clean Code & Arquitetura)

## 1. Visão Geral
Projeto de site catálogo/vitrine para confeiteira. Permite visualizar categorias de produtos, galeria de fotos otimizadas e realizar pedidos via WhatsApp. Inclui painel administrativo para upload de mídias.

## 2. Stack Tecnológica
- **Framework:** Next.js (App Router, TypeScript)
- **UI & CSS:** Tailwind CSS (Design Mobile-First, responsivo e elegante)
- **Database & Auth:** Supabase (`@supabase/supabase-js`)
- **Media Storage:** Cloudinary (Upload e otimização para WebP)
- **Deployment:** Vercel

## 3. Estrutura de Pastas (Clean Architecture)
```text
site-confeitaria/
├── src/
│   ├── app/                        # App Router (Rotas e Páginas)
│   │   ├── (public)/               # Rotas Públicas (Home, Categorias)
│   │   └── (admin)/                # Rotas Privadas (Login, Dashboard Admin)
│   ├── components/                 # Componentes React (ui, public, admin)
│   ├── config/                     # Configurações globais e constantes
│   ├── lib/                        # Inicializadores de SDKs (Supabase, Cloudinary)
│   ├── services/                   # Regra de Negócio & Fetching de Dados
│   ├── types/                      # Definições de Tipos TypeScript
│   └── utils/                      # Funções puras (WhatsApp URL, Formatters)
├── AGENTS.md                       # Instrução universal para IA (Claude Code / Agents)
├── .cursorrules                    # Instruções para IDE (VS Code / Cursor)
└── .github/copilot-instructions.md # Instruções para GitHub Copilot / Codex