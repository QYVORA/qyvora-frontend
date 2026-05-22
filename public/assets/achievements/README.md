# HSOCIETY Achievement Asset Architecture

This directory contains all image-based assets for the HSOCIETY achievement and badge system.

## Directory Structure

- `badges/`: Main badge artwork categorized by rarity.
  - `common/`, `uncommon/`, `rare/`, `epic/`, `legendary/`, `mythic/`
- `locked/`: Fallback assets for locked or undiscovered achievements.
- `categories/`: Iconography or backdrop elements for specific achievement types.
- `frames/`: Border overlays indicating rarity or status.
- `effects/`: Visual enhancement layers (glows, particles).

## Asset Specifications

### Dimensions & Format
- **Format**: PNG (with transparency) or WEBP (preferred for web).
- **Resolution**: 512x512 pixels (minimum) to 1024x1024 pixels.
- **Aspect Ratio**: 1:1 (Square).
- **Padding**: Ensure a safe margin around the core artwork to prevent clipping during rotation or scaling effects.

### Naming Conventions
- Use `snake_case` for all filenames.
- Names should be predictable and descriptive.
- **CP Milestones**: `cp_1000.png`, `cp_5000.png`
- **Room/Module**: `first_room.png`, `linux_specialist.png`, `web_infiltrator.png`
- **Special Status**: `protocol_ascendant.png`, `top_10_leaderboard.png`

### Design Philosophy
- **Aesthetic**: Cyberpunk / Tactical UI / Neon.
- **Contrast**: High contrast, optimized for dark mode interfaces.
- **Transparency**: Clean alpha channels; no jagged edges or "white halo" artifacts.
- **Rarity Colors**:
  - **Common**: Grey / Steel (#9CA3AF)
  - **Uncommon**: Green (#10B981)
  - **Rare**: Blue (#3B82F6)
  - **Epic**: Purple (#8B5CF6)
  - **Legendary**: Gold / Orange (#F59E0B)
  - **Mythic**: Red / Magenta (#EF4444)

## Export Recommendations
1. Export as transparent PNG-24 or WEBP.
2. Run through a compressor (e.g., TinyPNG or Squoosh).
3. Ensure no metadata is embedded to keep file sizes minimal.
4. Test visibility against `#0A0A0A` and `#1A1A1A` backgrounds.

## Implementation Notes
- Assets are referenced via `/assets/achievements/...`
- Frontend components handle grayscale filters for locked states.
- Rarity frames are overlaid dynamically in the UI.
