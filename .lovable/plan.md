# PRD de Conclusão — Área do Aluno "AI App Empire"

Documento de fechamento do produto. Não é lista de bugs — é o contrato do que precisa estar verdadeiro para a plataforma sustentar o preço high-ticket. Cada seção define: **problema real → princípio → escopo → critério de aceite → métrica de sucesso**.

---

## 0. Princípios de qualidade (não-negociáveis)

1. **Nenhum botão mente.** Toda ação visível ou faz o que promete, ou não existe.
2. **Uma fonte de verdade por conceito.** Streak, XP, progresso e nível têm UM cálculo canônico consumido por todas as telas.
3. **Todo evento fecha loop.** Ação do usuário → efeito no estado → feedback imediato (toast/confetti) → registro persistente (inbox/atividade/badge).
4. **Nada é órfão.** Toda tela existente aparece na navegação, no ⌘K e no mapa de atalhos, ou é removida.
5. **Estado sobrevive ao refresh.** Nenhuma feature depende de memória volátil.
6. **Mock é honesto.** Conteúdo demonstrativo é rotulado como "amostra" quando não é interativo, nunca finge ser real.

---

## 1. Fundações de dados (P0 — bloqueia tudo)

### 1.1 Unificar Streak
- **Problema:** `gamification.ts` e `streak.ts` calculam streak de formas diferentes; dashboard e `/revisao` mostram números divergentes.
- **Escopo:** `streak.ts` (baseado em `activity.ts` + freezes) vira canônico. `gamification.ts` importa dali, não recalcula. `pingStreak` legado é removido; `pingActivity` passa a ser o único gatilho.
- **Aceite:** grep por `pingStreak` retorna zero. Dashboard, `/revisao`, `/conquistas`, `/estatisticas` mostram o mesmo número em qualquer instante.

### 1.2 Unificar XP e Nível
- **Problema:** três fórmulas de XP espalhadas; `claimQuest` promete XP mas não soma no total real; nível no header pode discordar do nível no `/conquistas`.
- **Escopo:** criar `src/lib/xp.ts` com `computeXp({lessons, exercises, watchSeconds, streakDays, questsXp})` e store persistente de `questsXp` acumulado. `useGamification` e `useQuests` consomem daqui.
- **Aceite:** reivindicar quest anima o contador de XP no header e altera a barra de nível em tempo real. Todas as telas leem o mesmo `xp`/`level`/`rank`.

### 1.3 Storage versionado e resiliente
- **Escopo:** `storage.ts` ganha migração `v1→v2` para consolidar chaves obsoletas (`aiae:streak:v1` → derivado). Try/catch em toda leitura; quota exceeded degrada silenciosamente.
- **Aceite:** limpar `localStorage` no meio da sessão não quebra a UI; recarregar volta ao estado inicial sem crash.

---

## 2. Ciclo pedagógico completo (P0)

### 2.1 Aula → Progresso → Certificado
- **Problema hoje:** `/certificado` libera por % de aulas assistidas e ignora `/prova`. Certificado sem prova = credencial sem valor.
- **Regra final:**
  - Certificado exige: **≥ 90% aulas** + **prova final aprovada (≥ 70%)** + **≥ 1 projeto na vitrine**.
  - Cada requisito tem estado visual (bloqueado / pendente / concluído) com CTA direto.
- **Aceite:** botão "Emitir certificado" só habilita quando os três estados são verdes; hash determinístico gera ID; `/verificar/$id` reconstrói.

### 2.2 Prova final séria
- **Escopo:** pool ≥ 40 questões, sorteio de 20, timer 30min, 3 tentativas com cooldown de 24h (mock: cooldown simulado), gabarito revelado só após aprovação, resultado persistido para o certificado consumir.
- **Aceite:** reprovação bloqueia botão por período; aprovação dispara confetti + inbox + badge + destrava certificado.

### 2.3 Exercícios com estado real
- **Escopo:** cada exercício tem status (não iniciado / em progresso / entregue), campo de submissão (texto + link), e aparece em `/revisao` quando entregue nos últimos 7d.
- **Aceite:** entregar exercício soma XP via `xp.ts`, incrementa quest, aparece na atividade e no inbox.

---

## 3. Gamificação que fecha loop (P1)

### 3.1 Notificações de conquista
- Todo `unlock` de badge, `level up` e `quest claim` gera item em `/inbox` com deep-link, dispara toast e (para badges/level) confetti.
- Overlay de level-up existente vira consumidor do mesmo evento — hoje ele dispara solto.

### 3.2 Badges alcançáveis
- Auditar `badges.ts`: cada badge precisa ter um contador real incrementado em algum lugar do código. Badges sem gatilho são removidos ou o gatilho é implementado.
- Caso "Ferramenteiro": `CommandPalette` chama `incrementCmdkCount()` em cada abertura.

### 3.3 Quests com efeito
- `claimQuest(id)` chama `addQuestXp(xp)` em `xp.ts`. Widget de quests mostra XP subindo. Quest reivindicada não pode ser reivindicada de novo (já ok) e persiste ao refresh.

---

## 4. Navegação e descoberta (P1)

### 4.1 Fim das rotas órfãs
- Auditar toda rota em `src/routes/*.tsx`: precisa estar em sidebar OU em ⌘K OU ser filha explícita de outra rota. Ex.: `/marcadores`, `/glossario`, `/novidades`, `/hoje`, `/ajuda`, `/atalhos` — todas indexadas no ⌘K com descrição.

### 4.2 Atalhos honestos
- `/atalhos` é gerado a partir de `global-shortcuts.ts` (fonte única). Documento e código não podem divergir.
- Atalhos do player (`J`/`L`/`,`/`.`/`M`) implementados de verdade no `VideoPlayer.tsx` ou removidos da lista.

### 4.3 Busca global completa
- Índice inclui: aulas, transcrições, notas, exercícios, prompts, glossário, marcadores. Resultados agrupados por tipo, com deep-link (incluindo `?t=` para timestamps).

---

## 5. Fechamento de features "esqueleto" (P1)

Para cada tela abaixo, mapear cada elemento clicável e garantir que ou funciona ou some.

| Tela | Ação hoje | Ação final |
|---|---|---|
| `/comunidade` | Reservar ✔ (feito) | + Filtros de evento funcionam, "Ver gravação" leva à aula, botão "Perguntar" abre inbox de mentor |
| `/biblioteca` | Download ✔ | + Filtro por categoria, badge "amostra" nos assets stub, busca local |
| `/projetos` (Vitrine) | Ver lista | Submeter projeto (form local) → aparece na vitrine → conta pro certificado |
| `/agenda` | Planejar semana | Eventos geram entrada em `activity.ts` quando marcados como concluídos; sincroniza com quests |
| `/foco` (Pomodoro) | Timer | Ao completar, chama `addFocusMinutes` + `pingActivity('focus')` + XP + som opcional |
| `/prompts` | Copiar | + Favoritar prompt persistente, categoria, busca |
| `/ranking` | Lista mock | Rótulo "cohort simulada" visível; posição do usuário destacada com sua foto/avatar real do perfil |
| `/trilhas` | Lista trilhas | Usa `profile.goal` do onboarding para ordenar e recomendar "sua trilha" |
| `/inbox` | Lê mensagens | Marca como lida, arquiva, filtra por tipo (sistema/mentor/conquista) |
| `/perfil` | Vê dados | Edita nome/avatar/timezone/meta; mudanças refletem no header e no ranking |

**Aceite geral:** um QA manual clicando em cada botão de cada tela não encontra nada que não responda.

---

## 6. UX de acabamento (P2)

- **Estados vazios:** toda lista vazia tem ilustração/ícone + frase + CTA. Nada de "Nenhum item".
- **Skeletons:** rotas que dependem de cálculo pesado (`/estatisticas`, `/ranking`, `/revisao`) mostram skeleton no primeiro paint.
- **Erro por rota:** `errorComponent` e `notFoundComponent` em toda rota com loader (hoje quase nenhuma tem).
- **Acessibilidade:** foco visível global, `aria-live` para toasts, skip-link no `__root`, tap-targets ≥ 44px auditados no mobile.
- **SEO por rota:** `head()` específico em cada rota pública (hoje só root); títulos <60 chars.

---

## 7. Onda de execução recomendada

**Onda 1 — Fundações (bloqueante, ~1 lote grande)**
1.1 Streak unificado · 1.2 XP unificado · 1.3 storage versionado · 3.3 quests com XP real · 4.2 atalhos honestos.

**Onda 2 — Ciclo pedagógico**
2.1 Certificado real · 2.2 Prova séria · 2.3 Exercícios com submissão · 3.1 Notificações de conquista · 3.2 Badges alcançáveis.

**Onda 3 — Fechamento de esqueletos**
Tabela da seção 5, tela por tela, na ordem: comunidade → projetos → agenda → foco → prompts → inbox → perfil → ranking → trilhas → biblioteca.

**Onda 4 — Descoberta e acabamento**
4.1 Rotas indexadas · 4.3 Busca global expandida · Seção 6 inteira.

---

## 8. Definição de "pronto" do produto

A área do aluno está pronta quando, em uma sessão de 15 min, um avaliador consegue:

1. Fazer onboarding e ver sua trilha personalizada no dashboard.
2. Assistir uma aula, anotar com timestamp, favoritar, marcar concluída → ver XP subir, quest avançar, streak pingar, atividade acender.
3. Entregar um exercício → ver aparecer em `/revisao` e no inbox.
4. Reservar um evento → ver no inbox e na agenda.
5. Fazer a prova de um módulo → ganhar badge → receber notificação no inbox.
6. Chegar em `/certificado` e ver exatamente o que falta (aulas, prova final, projeto) com CTAs diretos.
7. Usar ⌘K para encontrar qualquer tela ou aula, e `?` para ver atalhos que de fato funcionam.

Nenhum passo desses depende de "imaginar que funciona".

---

## 9. Fora de escopo (explícito)

- Backend real, auth, pagamentos (usuário pediu mock).
- Comentários sociais persistentes multi-usuário.
- Vídeo real com transcodificação — segue `<video>` + mocks.
- Notificações push nativas / email.

---

Confirma esse PRD (ou pede ajuste em seções específicas) que eu executo Onda 1 inteira num único lote, sem atalhos.
