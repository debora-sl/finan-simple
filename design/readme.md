# Controle Financeiro Residencial — Design System

Design system for **Controle Financeiro Residencial**, a web + mobile product that
helps a household organize its money: receitas, despesas fixas e variáveis, contas a
pagar, metas de economia, saldo mensal e relatórios simples para decisões em família.

**Brand tone:** simples, confiável, organizado e familiar. Built for beginners — clear,
calm, and never intimidating.

> **Sources.** Generated from the product brief (no existing codebase or Figma).
> An attached `finan-simple/` folder was referenced but came through empty, so all
> tokens, components, and screens here are authored from the brief. If a real codebase
> or Figma exists, re-attach it and we'll reconcile.

---

## Index / manifest

| File | What |
|------|------|
| `styles.css` | Global entry point — `@import`s every token + font file. Consumers link this. |
| `tokens/colors.css` | Base palette + light/dark semantic aliases + category colors. |
| `tokens/typography.css` | Inter scale, weights, tabular-number helpers. |
| `tokens/spacing.css` | 4px spacing grid, corner radii, layout sizes. |
| `tokens/elevation.css` | Shadow system, focus rings, motion tokens. |
| `tokens/fonts.css` | Inter + JetBrains Mono via Google Fonts. |
| `tokens/base.css` | Minimal resets + body defaults. |
| `guidelines/*.card.html` | Foundation specimen cards (Type, Colors, Spacing). |
| `components/core/` | Button, IconButton, Input, Select, Switch, Badge, Card, SegmentedControl, ProgressBar. |
| `components/finance/` | SummaryCard, CategoryIcon, TransactionRow, BillItem, CategoryBar, CategoryDonut. |
| `ui_kits/dashboard/` | Desktop "Visão geral" dashboard (interactive). |
| `ui_kits/mobile/` | Phone-framed mobile app. |
| `ui_kits/marketing/` | Landing page. |
| `ui_kits/icons.js` | Shared inline icon set (Lucide-style). |
| `SKILL.md` | Agent Skill wrapper for portable use. |

The compiler exposes all components on `window.ControleFinanceiroDesignSystem_2e2cd7`.

---

## Content fundamentals

**Language:** Portuguese (Brazil), throughout. UI, marketing, and data are all pt-BR.

**Voice:** warm, plain, reassuring. We speak to a family, not an accountant. Prefer
everyday words ("dinheiro", "casa", "gastos") over jargon ("fluxo de caixa",
"passivos"). Short sentences. Encouraging, never alarming — even overdue bills are
stated factually ("Venceu 10 jun"), not scolding.

**Person & address:** address the user with implicit "você" ("Organize as finanças da
sua casa"). Friendly greeting on the app home ("Olá, Ana 👋").

**Casing:** Sentence case for everything — headings, buttons, labels. Never Title Case
or ALL CAPS, except tiny meta captions (e.g. "12 JUN · CARTÃO") used sparingly for
timestamps. Buttons are verbs: "Adicionar", "Salvar despesa", "Marcar como pago".

**Money:** Brazilian Real, always `R$ 1.234,56` (period thousands, comma decimals),
rendered with tabular numerals. Income shows a green `+`, expense a neutral `−`.

**Emoji:** essentially none in the product UI. A single waving-hand 👋 in the mobile
greeting is the only sanctioned use — keep it rare and human, never decorative on
data or buttons.

**Examples**
- Hero: "As finanças da sua casa, finalmente organizadas"
- Reassurance row: "Sem cartão de crédito · 100% em português"
- Empty state: "Nenhuma movimentação nesta categoria."
- Goal: "Faltam R$ 4.200" / "{x}% concluído"

---

## Visual foundations

**Color.** Light-first on a cool slate background (`#F8FAFC`), text `#0F172A` /
secondary `#64748B`. A four-color semantic system carries all meaning:
- **Blue `#2563EB`** — primary actions, links, active nav, the "saldo" accent.
- **Green `#16A34A`** — receitas, positive balance, savings, "pago".
- **Red `#DC2626`** — despesas, overdue, destructive.
- **Amber `#F59E0B`** — bills due soon / warnings.
Each maps to a `*-soft` tint for chip/badge backgrounds. Nine fixed **category
colors** (`--cat-*`) keep charts and tags consistent. Dark mode overrides only the
semantic layer over a `#020617`/`#0F172A` base — set `data-theme="dark"` on `<html>`.

**Type.** Inter for everything; JetBrains Mono is available but rarely used. Scale:
Display 44 / H1 32 / H2 24 / H3 20 / Body 16 / Small 14 / Caption 12. Headings are
700 with tight tracking (`-0.02em`); body 400; labels/buttons 600. Money figures use
`font-variant-numeric: tabular-nums` so columns align.

**Spacing & layout.** 4px base grid (`--space-*`). Comfortable, airy padding — cards
breathe (20–24px interior). Max content width 1200px; desktop sidebar 248px; mobile
canvas 390px. Mobile-first, then a two-column dashboard on wide screens.

**Corners.** Soft and rounded throughout — inputs/buttons `--radius-md` (12px), cards
`--radius-lg` (16px), modals `--radius-xl` (20px), pills/badges full. Nothing sharp.

**Cards.** White surface, 1px `--border-subtle`, `--shadow-sm`, 16px radius. They sit
clearly separated on the slate background ("cards bem separados"). Interactive cards
lift 2px with `--shadow-md` on hover.

**Elevation.** Soft, low-contrast shadows (slate-tinted, low alpha). xs decorative,
sm = resting cards, md = hover/menus, lg = popovers, xl = modals/sheets. No hard or
colored drop shadows.

**Backgrounds.** Flat color only. No gradients on surfaces — the one bold fill is the
blue balance hero (mobile) and the CTA banner (marketing). No photography, textures,
or patterns. Clean and quiet.

**Motion.** Quick and gentle: `--dur-fast` 120ms for press/hover, `--dur-base` 200ms
for toggles, `--dur-slow` 320ms for bar/donut fills. Easing `--ease-out`
(cubic-bezier(.16,1,.3,1)). No bounce, no infinite loops.

**Interaction states.** Hover = subtle `brightness(0.94)` on filled buttons, or a
`--surface-hover` wash on ghost/nav. Press = `scale(0.97)`. Focus = 3px translucent
blue ring (`--ring-action`), red ring for errored inputs. Switch/segment animate the
thumb/active pill.

**Borders & dividers.** 1px `--border-subtle` for separation, `--border-strong` for
input outlines. Row dividers inside lists, not boxes around every item.

**Transparency & blur.** Used sparingly — sticky nav/topbar use a `color-mix`
translucent background + `backdrop-filter: blur` so content scrolls under them.
Modals use a `rgba(15,23,42,.45)` scrim with a light blur.

---

## Iconography

**System:** a small, self-contained **Lucide-style** icon set in `ui_kits/icons.js`
(`window.CFIcon`) — 24px grid, 2px stroke, round caps/joins, no fill. Chosen for the
brief's "ícones simples e intuitivos". Components accept icons as a `ReactNode` prop,
so consumers may swap in the real Lucide package or any 2px-stroke set.

**Category glyphs** live in the `CategoryIcon` component — the canonical mapping of the
nine household categories to a fixed color + glyph (home, cart, car, pulse, cap,
gamepad, card, receipt, dots). Always reuse it so category color/icon stay consistent.

**Substitution flag:** these glyphs are hand-built to match Lucide's geometry, not the
actual Lucide font/SVGs (no codebase was available to copy from). If you want pixel-
exact Lucide, drop in `lucide-react` and pass its icons through — the components are
already icon-agnostic.

**Emoji as icons:** no. The only emoji anywhere is the 👋 in the mobile greeting.
No unicode-glyph icons either — everything is SVG.

**Logo:** no brand logo file was provided. A provisional mark — a blue rounded square
with a piggy-bank glyph — is composed inline in the kits. **Ask the user for a real
logo** to replace it.

---

## Using the system

```html
<link rel="stylesheet" href="styles.css" />
<script src="_ds_bundle.js"></script>
<script type="text/babel">
  const { SummaryCard, BillItem, Button } = window.ControleFinanceiroDesignSystem_2e2cd7;
</script>
```

Dark mode: `document.documentElement.setAttribute('data-theme','dark')`.

See each component's `.prompt.md` for usage and variants.
