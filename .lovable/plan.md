# Plano: Onboarding com foco cinematográfico

## Diagnóstico do problema

Hoje a tela mostra **três seções simultâneas** (rail lateral esquerdo com passos + main com pergunta ativa + painel direito de contexto/preview). Cada uma é bonita isolada, mas juntas competem por atenção:

- O olho não sabe onde pousar primeiro (3 zonas de igual peso visual)
- O usuário lê tudo antes de agir → paralisia
- Sem hierarquia clara entre "o que EU faço agora" vs "meta" vs "preview"
- Densidade textual (epígrafes, hints, kickers, subtítulos, meta) sobrecarrega já no Ato I

O objetivo: manter as 3 zonas (elas são boas), mas fazer **uma dominar** a cada momento, com as outras recuando para papéis de suporte.

---

## Onda 1 — Foco radical (hierarquia + redução de ruído)

Objetivo: no primeiro segundo, o usuário sabe **exatamente** o que fazer.

1. **Zona ativa em destaque cinematográfico**
   - Main central ganha ~55–60% da largura, tipografia da pergunta em display grande (clamp 40→64px), input/CTA com peso visual dominante.
   - Rail esquerdo e painel direito descem para ~65% de opacidade em repouso; voltam a 100% ao hover/focus.

2. **Rail esquerdo vira "trilha", não "menu"**
   - Remover títulos/subtítulos dos passos inativos — mostrar só ícone + número + label curta (1 palavra: Identidade, Objetivo, Ritmo, Selo).
   - Passo ativo expande com kicker + micro-descrição; os outros colapsam para chips verticais finos.
   - Linha conectora animada (progress spine) entre os pontos.

3. **Painel direito vira "eco", não "co-protagonista"**
   - Remover epígrafes e textos longos do painel; ele passa a refletir **em tempo real** o input do usuário (nome digitado → aparece no card de preview; goal escolhido → ícone/pace atualiza; ritmo → barra preenche).
   - Sem conteúdo próprio quando o campo está vazio: mostra só um estado "aguardando" sutil (silhueta do sigil + linha piscando).

4. **Reduzir texto por passo**
   - 1 pergunta (h1) + 1 subtítulo curto (máx 12 palavras) + campo + CTA. Nada mais no viewport inicial do ato.
   - Epígrafes movidas para um `<details>` "por que perguntamos?" recolhido.

5. **CTA único e óbvio**
   - Botão "Continuar →" com brilho/gradient, sempre no mesmo lugar (canto inferior direito da main). Enter também avança.
   - Voltar vira link fantasma pequeno, não botão.

---

## Onda 2 — Cinemática progressiva (revelação em camadas)

Objetivo: transformar o onboarding em uma **experiência que se desenrola**, não uma tela estática.

1. **Entrada em ato — reveal sequencial**
   - Ao carregar/trocar de passo: rail fade-in (150ms) → pergunta desliza de baixo (300ms, spring) → painel direito materializa (450ms).
   - O usuário vê a interface se montar → entende naturalmente a ordem de leitura.

2. **Spotlight dinâmico por foco**
   - Ao focar o input: rail e painel escurecem mais (opacity 0.4, blur sutil 2px), vinheta radial suave centraliza atenção no campo.
   - Ao desfocar: tudo volta ao repouso. Sensação de "modo edição" vs "modo panorama".

3. **Painel direito como espelho vivo (live mirror)**
   - Digitou o nome → card de perfil aparece com typewriter no handle sugerido.
   - Escolheu objetivo → ícone do goal faz morph, pace anima contando (0h → 8h).
   - Ajustou ritmo → linha do tempo semanal preenche dia a dia.
   - Confirmação (Ato IV): o painel vira **o certificado final**, com o sigil escolhido pulsando + confetti no submit.

4. **Trilha esquerda vira storyline**
   - Passos concluídos: ícone vira check dourado, label ganha strike sutil e brilho breve.
   - Passo atual: pulso suave no ícone (respiração 2s).
   - Passos futuros: silhueta neutra, sem detalhe → mistério/promessa.

5. **Transições entre atos com narrativa**
   - Ao avançar: pergunta atual sobe e desvanece, próxima entra por baixo. Painel direito faz cross-fade dos widgets.
   - Micro-som opcional (toggle mudo por padrão) — click sutil ao avançar.

6. **Estado terminal memorável (Ato IV)**
   - Layout colapsa: rail e painel se fundem no centro formando o **cartão-selo final** (identidade + objetivo + ritmo + sigil), com CTA "Entrar no painel" pulsando.
   - Confetti + fade cinematográfico para a rota `/`.

---

## Escopo técnico (resumo)

- Arquivo único: `src/routes/onboarding.tsx` (+ possível extração de `LiveMirror`, `StepRail` para componentes locais).
- Animações: `framer-motion` (já disponível). Nenhuma dep nova.
- Sem mudança na lógica de `useProfile`, GOALS, rotas ou persistência.
- Preservar totalmente os 4 passos, ordem, validações e submit.

## Entregas

- Onda 1 → PR 1: refator visual + redução de texto + spotlight base.
- Onda 2 → PR 2: motion sequencial, live mirror, estado terminal.

Confirma para eu executar a Onda 1?
