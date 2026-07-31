---
name: controle-financeiro-design
description: Use this skill to generate well-branded interfaces and assets for Controle Financeiro Residencial (a household finance web + mobile product), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets
out and create static HTML files for the user to view. If working on production code,
you can copy assets and read the rules here to become an expert in designing with this
brand.

Key facts:
- **Language:** Portuguese (Brazil). **Currency:** `R$ 1.234,56`, tabular numerals.
- **Tone:** simples, confiável, organizado, familiar. Sentence case. Verbs on buttons.
- **Color:** light-first on slate `#F8FAFC`; blue=ação, verde=receita, vermelho=despesa,
  amarelo=vencimento. Dark mode via `data-theme="dark"`. Nine fixed `--cat-*` colors.
- **Type:** Inter (Display 44 → Caption 12). **Corners:** soft/rounded. **Cards:** white,
  subtle border + soft shadow, 16px radius, well separated.
- **Components:** `window.ControleFinanceiroDesignSystem_2e2cd7` — Button, IconButton,
  Input, Select, Switch, Badge, Card, SegmentedControl, ProgressBar, SummaryCard,
  CategoryIcon, TransactionRow, BillItem, CategoryBar, CategoryDonut.
- **Icons:** Lucide-style set in `ui_kits/icons.js`; category glyphs in `CategoryIcon`.
- **UI kits:** `ui_kits/dashboard` (web), `ui_kits/mobile` (app), `ui_kits/marketing`.

Load `styles.css` + `_ds_bundle.js`, then read components from the namespace above.

If the user invokes this skill without any other guidance, ask them what they want to
build or design, ask some questions, and act as an expert designer who outputs HTML
artifacts _or_ production code, depending on the need.
