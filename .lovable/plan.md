# Plano Extenso — 10 Frentes de Evolução

Objetivo: transformar a área do aluno de "protótipo bonito" em produto premium que sustenta o preço de high-ticket do AI App Empire. Abaixo, 10 direções independentes, priorizadas por impacto x esforço, agrupadas em 4 ondas executáveis.

---

## As 10 frentes

**1. Player de vídeo de verdade**
Legendas (VTT), velocidade granular, PiP, qualidade adaptativa, timeline com marcadores de capítulos visíveis, thumbnail on hover, atalho `?t=` compartilhável, sincronia com transcrição (linha ativa destacada, auto-scroll).

**2. Busca full-text global**
Índice em memória (MiniSearch) sobre título + descrição + transcrição + notas + exercícios. ⌘K passa a ter aba "Conteúdo" com resultados por trecho e deep-link `/aula/x/y?t=123`.

**3. Estados de UI completos**
Skeleton loaders, empty states com CTA em cada rota (favoritos vazio, exercícios vazios, ranking sem dados), estado de erro por rota, 404 dentro do shell (não só root), toasts para ações destrutivas.

**4. Mobile-first real**
Sidebar em Sheet no mobile, header colapsável, tabs viram carrossel horizontal, player fixa embaixo em portrait, tap-targets ≥ 44px auditados, sem overflow horizontal em nenhuma rota.

**5. Sistema de anotações profissional**
Editor rico leve (bold/italic/lista/code), tags, busca dentro das notas, export markdown, "minha caderneta" agregada em `/notas`, timestamps clicáveis já feitos + destaque quando o vídeo passa pelo tempo da nota.

**6. Trilha personalizada por objetivo**
Onboarding define nicho + horas/semana + meta. Algoritmo simples ordena módulos e sugere ritmo diário ("Hoje: 2 aulas, 38min"). Card "Próximo passo" no topo do dashboard sempre atualizado.

**7. Gamificação com profundidade**
Badges por combo (7-day streak, primeiro projeto, quiz perfeito), níveis com nomes (Aprendiz → Arquiteto → Concierge), XP animado, leaderboard semanal, "quests" diárias.

**8. Camada social/comunidade**
Comentários por aula (mock local), reações, "quem terminou essa aula", perguntas destacadas pelo mentor, sessões ao vivo com countdown real e ICS export.

**9. Certificação séria**
Prova final com pool de questões randomizado, tempo, nota mínima, tentativas limitadas, certificado com QR de verificação + página pública `/verificar/:id`, badges por trilha concluída.

**10. Fundações invisíveis (qualidade)**
`head()` por rota (SEO real), acessibilidade AA (foco visível, aria-live em toasts, skip-link), tema claro/escuro toggle, atalhos globais documentados em `?`, error boundary + telemetria, export/import de todo o progresso (JSON), tratamento de perda de localStorage.

---

## Ondas de execução

### Onda A — Fundações que quebram confiança (agora)
Frentes **3, 4, 10**. Sem isso, o resto parece amador. Entrega:
- Skeletons, empty states, error states em todas as rotas.
- Mobile auditado rota a rota.
- `head()` por rota, toggle de tema, atalhos globais, export/import.

### Onda B — Núcleo de valor pedagógico
Frentes **1, 2, 5**. É o que o aluno usa 90% do tempo.
- Player pro (VTT, PiP, velocidades, marcadores, thumbnail).
- Busca full-text com MiniSearch e deep-link.
- Notas rich-text + `/notas` agregado + export markdown.

### Onda C — Motor de engajamento
Frentes **6, 7**. Faz voltar todo dia.
- Trilha personalizada com "próximo passo" dinâmico.
- Badges, níveis nomeados, quests diárias, leaderboard semanal.

### Onda D — Prova social e credencial
Frentes **8, 9**. Fecha o loop de valor percebido.
- Comentários/reações por aula, sessões ao vivo com ICS.
- Prova final séria + certificado verificável.

---

## Detalhes técnicos

- **Busca**: `minisearch` (leve, no-dep). Índice construído no client a partir de `course-data.ts` + `notes` + `feedback`. Rebuild on-demand.
- **Player**: manter `<video>` nativo, adicionar `<track kind="subtitles">` por aula (arquivo `.vtt` em `/public/subs/`), `requestPictureInPicture()`, `playbackRate` granular (0.75, 1, 1.25, 1.5, 1.75, 2), hover preview via sprite ou stub.
- **Trilha personalizada**: função pura `computeNextStep(profile, progress) → { moduleId, lessonId, reason }` — sem backend.
- **Certificado**: hash determinístico `sha1(userId + finishedAt)` → id público, página `/verificar/$id` reconstrói a partir do storage do dono (mock: qualquer id conhecido resolve).
- **Tema**: `data-theme` no `<html>`, tokens em `styles.css` já semânticos; toggle persistido em `localStorage`.
- **A11y**: skip-link no `__root`, `aria-live="polite"` num contêiner de toasts, foco visível via `:focus-visible` global.
- **Export/import**: dump de todas as chaves `aiae:*` em JSON, com versão.
- **SEO por rota**: `head()` retornando meta específica em cada `createFileRoute`. Root vira genérico só.
- **Persistência**: manter localStorage (escopo mock), mas encapsular num único `storage.ts` com namespacing + migração de versão, evitando surpresas futuras.

---

## Recomendação

Executar **Onda A inteira agora** numa passada só (é o que mais destrava percepção de qualidade), depois seguir para **Onda B**. Ondas C e D pedem decisões de produto adicionais (regras da prova, nomes dos níveis, moderação de comentários) — melhor discutir antes.

Confirma "vai onda A" que eu meto tudo. Ou aponta quais das 10 frentes você quer priorizar diferente.