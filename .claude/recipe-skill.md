# Recipe markdown for gregmakes.xyz

Greg's recipe site renders recipes from structured YAML frontmatter: ingredients with **mise en place dish grouping**, and steps encoded as YAML objects with text, timers, and equipment tracking. The frontmatter does the heavy lifting — by the time the steps start, prep is already done.

## What you produce

A single markdown file named `<slug>.md` (kebab-case from the title), saved to `/mnt/user-data/outputs/`, then presented via `present_files`. Tell Greg the destination in his repo is `src/content/recipes/<slug>.md`.

## Frontmatter schema

```yaml
title: string                   # required
date: YYYY-MM-DD                # required (default to today unless told otherwise)
tags: [string]                  # optional
attribution: string             # optional, only if adapted from a source
featuredImage: ...              # optional, omit unless an image file is provided
equipment: [string]             # required, plain list — include everything, even prep-only tools
prepOnly: [string]              # optional, subset of equipment used only during mise en place
ingredients:                    # required
  - name: string
    amount: number
    unit: g | kg | ml | l | null   # null for countable items (eggs, cloves)
    dish: A | B | C | ...          # uppercase letter, mise en place grouping
    dish_ml: number                # optional, only for countable items with meaningful volume
    prep: string                   # optional, only for pre-cooking transformations
steps:                          # required
  - text: string                # 1–2 sentence instruction
    timers:                     # omit entirely if no explicit durations in this step
      - label: string           # concise action label, e.g. "Render lardons"
        minutes: number         # decimal minutes — 30s = 0.5, 90s = 1.5
    lastUse:                    # omit entirely if no equipment is finished after this step
      - string                  # exact equipment name from the equipment list above
```

## The judgment calls

### 1. Dish assignment (the most important)

Each `dish` letter (A, B, C…) is **a single prep bowl in the mise en place**. Two ingredients share a dish when, during cooking, you'd grab them as a unit and dump them together. Different cooking stage = different dish. The whole point is to set the cook up to grab-and-dump, not to fish individual ingredients out of containers mid-cook.

Pattern examples:

- **Sauce components** mixed ahead → one dish (soy + mirin + vinegar + sugar)
- **Aromatics added together** → one dish (oil + minced garlic, hitting the pan at the same moment)
- **Pasta + the pot's salt** → one dish (both go into the same vessel at the same stage)
- **A spice blend** → one dish (premixed, dumped in)
- **A finishing garnish** added alone at the end → its own dish
- **Dry rubs / surface seasonings with mixed particle sizes** (e.g. flaky salt + cracked pepper + sesame seeds on bread) → **separate dishes**, because denser particles settle in a pre-mix and you get salt hot spots. Apply each separately. This is the main exception to "ingredients used at the same time go in the same dish."

Use as few dishes as the recipe needs; don't split arbitrarily. If two ingredients meaningfully arrive together, they share a dish. Single-ingredient dishes are fine when nothing else naturally pairs.

### 2. The `prep` field

Only set `prep` for transformations that happen **before** cooking starts (during mise en place). These are work the cook does ahead so they can grab-and-dump:

- ✓ `minced`, `zested`, `juiced`, `thinly sliced`, `room temperature`, `pitted`, `peeled and diced`, `finely grated`

Don't set `prep` for things that happen during cooking, or that are negligible. If "drained" or "rinsed" or "seasoned to taste" matters, it belongs in a step — not in the frontmatter.

### 3. The `dish_ml` field

Only for **countable items** (`unit: null`) where volume meaningfully affects whether the prep bowl needs to be bigger than ~90ml. The site sums each dish's volumetric contributions and flags any dish ≥ 90ml so Greg knows to grab a bigger bowl.

Volume per ingredient for the sum:
- `unit: ml` → use `amount` directly
- `unit: g` → treated as `amount` ml (1g ≈ 1ml; close enough for this purpose)
- `unit: null` with `dish_ml` → use `dish_ml`
- `unit: null` without `dish_ml` → contributes 0

Rough volumes when you need them:

- Whole lemon ≈ 60ml, whole lime ≈ 30ml
- Large egg ≈ 50ml
- Medium onion ≈ 200ml, small onion ≈ 120ml, large onion ≈ 300ml
- Medium tomato ≈ 150ml, medium apple ≈ 200ml, medium potato ≈ 250ml
- Bell pepper ≈ 200ml, medium carrot ≈ 120ml
- Garlic clove → don't bother, negligible

The flag exists to prevent splash-out, not to be exhaustive. Skip `dish_ml` whenever the contribution is trivial.

### 4. Step text

- 1–2 sentences each.
- Refer to ingredients **by name**, not by dish letter. The dish letters are mise en place scaffolding for the frontmatter only — steps don't expose them.
- Disambiguate (e.g. "the spiced flour" vs. "the dredge flour") only when two dishes are genuinely identical and a name alone wouldn't tell them apart. Otherwise just use the ingredient name.
- "Hands-off" means **all prep is done before the timer starts** — steps assume mise en place is complete. Don't include "do all your prep first" as a step; the frontmatter encodes that.
- Use "Meanwhile" for genuine parallel work.
- Do **not** add sentences announcing equipment is done (e.g. "the skillet is done after this") — that belongs in `lastUse`, not in the text.

### 5. Timers

Add a `timers` entry for every **explicit duration** in a step. Omit the `timers` key entirely when there are none.

- **Seconds → decimal minutes**: 30s = 0.5, 45s = 0.75, 90s = 1.5
- **Ranges**: use the upper bound — "3–4 minutes" → `minutes: 4`
- **Vague durations** ("until soft", "until golden", "until fragrant") → no timer
- **Multiple timed actions in one step** → multiple entries, one per action
- **Label**: concise, action-oriented — "Render lardons", "Reduce wine", "Braise". Verb + object.

### 6. lastUse

Add a `lastUse` entry naming each piece of equipment that won't be used again after this step. Omit the `lastUse` key entirely when there are none.

- Use the **exact string** from the `equipment:` list — the UI matches on this.
- Common signals in the source recipe: "remove from heat and set aside", "wipe out the pan", a step where a one-purpose vessel is clearly finished (e.g. the marinating bowl after the protein is removed).
- When in doubt, omit — false positives are more confusing than misses.

### 7. prepOnly

List any equipment that's only needed for mise en place — it won't appear in any step. The recipe card shows an "after prep" badge next to these items so the cook knows they can be put away before cooking starts.

- Use the **exact string** from the `equipment:` list.
- Typical candidates: chef knife, cutting board, peeler, grater, zester, mortar and pestle — anything used purely for prep transformations.
- Include the item in `equipment` as normal; `prepOnly` is just a subset of that list.
- Omit the `prepOnly` key entirely if all equipment carries through to the cooking steps.

## Other style guidance

- **Equipment list** is a plain top-level YAML array, not prose, not buried in notes. Reflect the actual tool needed; Greg's kitchen has a cast iron grill plate (no skillet), a non-stick grill pan, two enameled dutch ovens, a wok, an omelet pan, a fish grill, a 3-burner gas stove that runs hot (diffuser for simmers), and a combo microwave/oven (oven up to 250°C / 5 min or 220°C / up to 1 hr). Don't call for a cast iron skillet — it isn't there.
- **Measurements**: weight is the source of truth (g, kg). Liquids in ml/l. Don't use cups, tbsp, or tsp; convert to metric without asking.
- **Ingredient names** use the cooking-noun form ("garlic clove" not "1 clove garlic"); the count goes in `amount`.
- **Slug**: kebab-case from the title. "Lemony Pasta with Ricotta" → `lemony-pasta-with-ricotta`. Drop articles, lowercase, hyphenate. ASCII only — strip diacritics.
- **`attribution`**: include for adaptations ("Adapted from Smitten Kitchen", "Inspired by my mom's roast chicken"). Omit for fully original recipes.
- **`tags`**: optional; use sparingly. A handful of useful ones (cuisine, dietary, meal type) — not an exhaustive index.

## Full example

`lemony-pasta-with-ricotta.md`:

````markdown
---
title: "Lemony Pasta with Ricotta"
date: 2026-01-15
tags:
  - pasta
  - vegetarian
attribution: "Adapted from Smitten Kitchen"
equipment:
  - Large pot
  - Colander
  - Large skillet
  - Microplane or zester
  - Medium bowl
ingredients:
  - name: pasta
    amount: 400
    unit: g
    dish: A
  - name: salt
    amount: 15
    unit: g
    dish: A
  - name: ricotta
    amount: 250
    unit: g
    dish: B
    prep: room temperature
  - name: parmesan
    amount: 60
    unit: g
    dish: B
    prep: finely grated
  - name: lemon
    amount: 1
    unit: null
    dish: B
    dish_ml: 60
    prep: zested and juiced
  - name: black pepper
    amount: 2
    unit: g
    dish: B
  - name: olive oil
    amount: 90
    unit: ml
    dish: C
  - name: garlic
    amount: 3
    unit: null
    dish: C
    prep: minced
  - name: red pepper flakes
    amount: 2
    unit: g
    dish: D
steps:
  - text: "Bring a large pot of well-salted water to boil. Cook pasta until al dente; reserve 1 cup pasta water before draining."
    timers:
      - label: Cook pasta
        minutes: 10
    lastUse:
      - Colander

  - text: "Meanwhile, heat olive oil and garlic in a large skillet over medium heat until fragrant, about 2 minutes."
    timers:
      - label: Bloom garlic
        minutes: 2

  - text: "Remove from heat. In a medium bowl, combine ricotta, parmesan, lemon zest, lemon juice, and black pepper."
    lastUse:
      - Microplane or zester
      - Medium bowl

  - text: "Add drained pasta to the skillet. Stir in ricotta mixture, adding pasta water a splash at a time until the sauce is creamy and coats the pasta. Serve immediately."
    lastUse:
      - Large skillet
---
````

What this example shows:

- Dish A = pasta + pot salt (both go into the boiling water at the same stage).
- Dish B = the ricotta mixture (everything mixed together off-heat in one bowl). The lemon's `dish_ml: 60` ensures dish B's total is computed correctly so the site can flag it for a bigger bowl.
- Dish C = oil + garlic (added together to the hot pan).
- Dish D = red pepper flakes alone — single-ingredient dishes are fine.
- Steps refer to "ricotta", "lemon zest", "garlic" — never "Dish B" or "the C mixture".
- `timers` and `lastUse` keys are omitted entirely on steps that have none.

## Minimal example

`soft-boiled-eggs.md`:

````markdown
---
title: "Soft-Boiled Eggs"
date: 2026-01-10
equipment:
  - Small saucepan
  - Slotted spoon
  - Bowl for ice bath
ingredients:
  - name: eggs
    amount: 2
    unit: null
    dish: A
  - name: water
    amount: 1000
    unit: ml
    dish: A
steps:
  - text: "Bring a small saucepan of water to a rolling boil. Lower eggs in gently with a slotted spoon."

  - text: "Cook for exactly 7 minutes."
    timers:
      - label: Soft-boil eggs
        minutes: 7

  - text: "Transfer eggs to an ice bath for 1 minute to stop cooking."
    timers:
      - label: Ice bath
        minutes: 1
    lastUse:
      - Bowl for ice bath
      - Slotted spoon

  - text: "Peel and serve immediately."
    lastUse:
      - Small saucepan
---
````

## Workflow

1. Read the source recipe (paste, link, file, image, or Greg's verbal description).
2. Decide each dish grouping. If you're torn between one dish or two, default to fewer.
3. Decide which countable ingredients need `dish_ml`.
4. Decide which ingredients need `prep`.
5. Write each step's `text` in 1–2 sentences, referring to ingredients by name.
6. Identify equipment used only during mise en place → add to `prepOnly` using exact equipment names.
7. For each step, identify explicit durations → add `timers` entries.
8. For each step, identify equipment that won't be used again → add `lastUse` entries using exact equipment names.
9. Generate the kebab-case slug from the title.
10. Write the file to `/mnt/user-data/outputs/<slug>.md` with `create_file`.
11. Present it with `present_files` and tell Greg it goes in `src/content/recipes/<slug>.md` in his repo.

Convert imperial measurements (cups/tbsp/tsp/oz) to g and ml without asking. If a source measurement is genuinely ambiguous (e.g. "a glug of olive oil"), pick a reasonable amount and mention what you assumed in the chat reply (not in the file).

If Greg is updating an existing recipe rather than creating a new one, the format and workflow are identical — just preserve the original `date` unless he says otherwise.
