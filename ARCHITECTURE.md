# Yuno Architecture

## UI layers

- `src/components/atoms`
  - Primitive visual building blocks with minimal responsibility.
  - Examples: `InfoChip`, `GlassCard`, `MotionPressable`, `InitialsAvatar`.

- `src/components/molecules`
  - Small composed UI units built from atoms.
  - Examples: `ActionPillButton`, `AvatarStack`, `ScreenHeader`, `SheetSearchBar`, `SocialLinkPill`.

- `src/components/organisms`
  - Larger composed pieces that still stay reusable across screens.
  - Examples: `EncounterCard`, `EventCard`, `BottomSheetModal`, `InlineRadar`, `EventListModal`, `FilterableScreenLayout`.

## Feature modules

- `src/features/app-model`
  - App state store, derived selectors, sheet orchestration, and composed app actions.

- `src/features/app-shell`
  - Top-level screen composition, global app shell context, and modal composition for `App.tsx`.

- `src/features/activity-heatmap`
  - Heatmap model, selection hook, grid rendering, and expanded day detail composition.

- `src/features/bottom-sheet`
  - Shared bottom-sheet metrics, keyboard handling, drag interaction, and controller orchestration.

- `src/features/encounter-card`
  - Shared encounter card copy logic plus reusable header and tag row composition.

- `src/features/encounter-detail`
  - Encounter detail types, state hook, context, and composed sections for hero, metrics, actions, notes, and restrictions.

- `src/features/event-detail`
  - Event detail types, state hook, context, and composed sections for hero and people lists.

- `src/features/event-list`
  - Event list sheet filters, empty states, and list content for event drawers.

- `src/features/events`
  - Events screen filtering model, hook state, radar section, and event feed composition.

- `src/features/filterable-sheet`
  - Shared scaffold plus reusable filter state hooks for searchable/filterable sheet lists.

- `src/features/home`
  - Home screen composition for presence card, radar section, and encounter feed.

- `src/features/notes`
  - Notes feed model, filter state hook, note composer state, rich-text token model, and note card composition.

- `src/features/onboarding`
  - Onboarding flow state, footer/top bar/content composition, and artwork subcomposition.

- `src/features/people-list`
  - People list sheet filters, period bucketing, and list content for people drawers.

- `src/features/profile`
  - Profile editor state hook, context, derived selectors, action builders, dialogs, hero subcomposition, and profile screen sections.

- `src/features/radar`
  - Shared radar model, animations, presence state, and node composition for people and events radar views.

## Command layer

- `src/commands`
  - Idempotent state transition helpers.
  - `encounter-commands.ts`
  - `event-commands.ts`
  - `note-commands.ts`
  - `profile-commands.ts`

## App state

- `src/hooks/useAppModel.ts`
  - Thin orchestrator over feature-local app state store, derived selectors, and action hooks.

- `src/features/app-shell/AppShellContext.tsx`
  - Global app shell provider for copy, language, app state, derived selectors, and sheet openers.

## Data and copy

- `src/data/mock`
  - Split mock source by domain.
  - `profile.ts`
  - `events.ts`
  - `encounters.ts`
  - `encounter-data/*`
  - `notes.ts`
  - `shared.ts`

- `src/social-links`
  - Social provider config plus normalization, formatting, detection, and deep-link helpers.

- `src/data/mockData.ts`
  - Backward-compatible public entry point that re-exports from `src/data/mock`.

- `src/i18n/translations`
  - Copy split by locale.
  - `en.ts`
  - `ptBR.ts`

- `src/i18n/shared.ts`
  - Localization utilities such as `resolveLocalizedText` and `getInitialLanguage`.

- `src/i18n.ts`
  - Backward-compatible public entry point that aggregates locale modules.

## Current composition rules

- Prefer atoms for pure visuals, molecules for compact reusable groups, organisms for larger reusable sections.
- Prefer feature-local context when several subcomponents need the same feature state.
- Prefer pure selector/model files for filtering, grouping, bucketing, and derived data shaping.
- Prefer command files for mutations instead of embedding transition logic inside screens.
- Prefer action-builder modules when a feature hook starts mixing transitions with derived selectors.
- Prefer reusable screen or sheet scaffolds when multiple surfaces share the same search/filter layout.
- Keep screen files focused on composition, not data shaping.
