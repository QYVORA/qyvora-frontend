This is the HSOCIETY Official Badge Registry. This list defines
  the visual tiering, naming conventions, and earning logic for
  the achievement system as established in the codebase and asset
  architecture.

  I. Rarity Hierarchy & Visual Mapping

  ┌───────────┬─────────────┬─────────┬────────────────────┐
  │ Tier      │ Color       │ Hex     │ Visual Effect      │
  │           │             │ Code    │                    │
  ├───────────┼─────────────┼─────────┼────────────────────┤
  │ Common    │ Steel /     │ #9CA3AF │ Minimal border,    │
  │           │ Grey        │         │ matte finish       │
  │ Uncommon  │ Emerald     │ #10B981 │ Subtle green outer │
  │           │ Green       │         │ glow               │
  │ Rare      │ Cobalt Blue │ #3B82F6 │ Pulsing blue core  │
  │           │             │         │ glow               │
  │ Epic      │ Amethyst    │ #8B5CF6 │ Static purple      │
  │           │ Purple      │         │ particle aura      │
  │ Legendary │ Solar Gold  │ #F59E0B │ Intense gold       │
  │           │             │         │ inner/outer glow   │
  │ Mythic    │ Crimson /   │ #EF4444 │ Glitch-effect red  │
  │           │ Neon Red    │         │ border + particles │
  └───────────┴─────────────┴─────────┴────────────────────┘
  ---

  II. Badge Registry (Ordered by Category)

  1. Community Point (CP) Milestones
  Earned based on the total CP balance held in the operator's
  wallet.

  ┌──────────┬────────┬─────────────────────────┬───────────┐
  │ Name     │ Rarity │ Asset Path              │ Earning   │
  │          │        │                         │ Reason    │
  ├──────────┼────────┼─────────────────────────┼───────────┤
  │ Seed     │ Common │ badges/common/cp_2000.p │ Complete  │
  │ Fund     │        │ ng                      │ registrat │
  │          │        │                         │ ion (2000 │
  │          │        │                         │ CP        │
  │          │        │                         │ bonus).   │
  │ Accumula │ Uncomm │ badges/uncommon/cp_5000 │ Reach a   │
  │ tor      │ on     │ .png                    │ total     │
  │          │        │                         │ balance   │
  │          │        │                         │ of 5,000  │
  │          │        │                         │ CP.       │
  │ Vanguard │ Rare   │ badges/rare/cp_10000.pn │ Reach a   │
  │          │        │ g                       │ total     │
  │          │        │                         │ balance   │
  │          │        │                         │ of 10,000 │
  │          │        │                         │ CP.       │
  │ Capitali │ Epic   │ badges/epic/cp_25000.pn │ Reach a   │
  │ st       │        │ g                       │ total     │
  │          │        │                         │ balance   │
  │          │        │                         │ of 25,000 │
  │          │        │                         │ CP.       │
  │ Protocol │ Legend │ badges/legendary/cp_100 │ Reach a   │
  │ Whale    │ ary    │ 000.png                 │ total     │
  │          │        │                         │ balance   │
  │          │        │                         │ of        │
  │          │        │                         │ 100,000   │
  │          │        │                         │ CP.       │
  └──────────┴────────┴─────────────────────────┴───────────┘

  2. Bootcamp Content Completion
  Earned by completing rooms and modules within "The Hacker
  Protocol" (ID: bc_1775270338500).

  ┌─────────┬────────┬────────────────────────────┬──────────┐
  │ Name    │ Rarity │ Asset Path                 │ Earning  │
  │         │        │                            │ Reason   │
  ├─────────┼────────┼────────────────────────────┼──────────┤
  │ First   │ Common │ badges/common/first_room.p │ Complete │
  │ Step    │        │ ng                         │ any 1    │
  │         │        │                            │ room in  │
  │         │        │                            │ the      │
  │         │        │                            │ bootcamp │
  │         │        │                            │ .        │
  │ Mindset │ Uncomm │ badges/uncommon/mindset_ma │ Complete │
  │ Certifi │ on     │ ster.png                   │ Module   │
  │ ed      │        │                            │ 1:       │
  │         │        │                            │ Hacker   │
  │         │        │                            │ Mindset. │
  │ Linux   │ Uncomm │ badges/uncommon/linux_spec │ Complete │
  │ Special │ on     │ ialist.png                 │ Module   │
  │ ist     │        │                            │ 2: Linux │
  │         │        │                            │ Foundati │
  │         │        │                            │ ons.     │
  │ Network │ Rare   │ badges/rare/network_ninja. │ Complete │
  │ Infiltr │        │ png                        │ Module   │
  │ ator    │        │                            │ 3:       │
  │         │        │                            │ Networki │
  │         │        │                            │ ng.      │
  │ Web     │ Rare   │ badges/rare/web_breaker.pn │ Complete │
  │ Exploit │        │ g                          │ Module   │
  │ er      │        │                            │ 4: Web & │
  │         │        │                            │ Backend. │
  │ Social  │ Rare   │ badges/rare/social_manipul │ Complete │
  │ Enginee │        │ ator.png                   │ Module   │
  │ r       │        │                            │ 5:       │
  │         │        │                            │ Social   │
  │         │        │                            │ Engineer │
  │         │        │                            │ ing.     │
  │ Protoco │ Legend │ badges/legendary/protocol_ │ Complete │
  │ l       │ ary    │ ascendant.png              │ the      │
  │ Ascenda │        │                            │ entire   │
  │ nt      │        │                            │ Hacker   │
  │         │        │                            │ Protocol │
  │         │        │                            │ Bootcamp │
  │         │        │                            │ .        │
  └─────────┴────────┴────────────────────────────┴──────────┘

  3. Operational Activity & Streaks
  Earned via consistent platform engagement and community
  participation.

  ┌──────────┬────────┬────────────────────────┬─────────────┐
  │ Name     │ Rarity │ Asset Path             │ Earning     │
  │          │        │                        │ Reason      │
  ├──────────┼────────┼────────────────────────┼─────────────┤
  │ Active   │ Common │ badges/common/streak_3 │ Maintain a  │
  │ Pulse    │        │ .png                   │ 3-day       │
  │          │        │                        │ login/activ │
  │          │        │                        │ ity streak. │
  │ Dedicate │ Uncomm │ badges/uncommon/streak │ Maintain a  │
  │ d        │ on     │ _7.png                 │ 7-day       │
  │ Operator │        │                        │ login/activ │
  │          │        │                        │ ity streak. │
  │ Marathon │ Rare   │ badges/rare/streak_30. │ Maintain a  │
  │ er       │        │ png                    │ 30-day      │
  │          │        │                        │ login/activ │
  │          │        │                        │ ity streak. │
  │ Shadow   │ Epic   │ badges/epic/streak_100 │ Maintain a  │
  │ Resident │        │ .png                   │ 100-day     │
  │          │        │                        │ login/activ │
  │          │        │                        │ ity streak. │
  └──────────┴────────┴────────────────────────┴─────────────┘

  4. Elite & Secret Achievements
  Unique milestones reserved for high-impact or undiscovered
  actions.

  ┌───────┬─────────┬───────────────────────────┬───────────┐
  │ Name  │ Rarity  │ Asset Path                │ Earning   │
  │       │         │                           │ Reason    │
  ├───────┼─────────┼───────────────────────────┼───────────┤
  │ Elite │ Epic    │ badges/epic/rank_elite.pn │ Reach the │
  │ Rank  │         │ g                         │ "Elite"   │
  │       │         │                           │ rank on   │
  │       │         │                           │ the       │
  │       │         │                           │ global    │
  │       │         │                           │ leaderboa │
  │       │         │                           │ rd.       │
  │ Bug   │ Legenda │ badges/legendary/bug_hunt │ Discover  │
  │ Hunte │ ry      │ er.png                    │ and       │
  │ r     │         │                           │ report a  │
  │       │         │                           │ security  │
  │       │         │                           │ flaw in   │
  │       │         │                           │ the       │
  │       │         │                           │ platform. │
  │ Top   │ Legenda │ badges/legendary/top_perc │ Hold a    │
  │ 1%    │ ry      │ ent.png                   │ top-10    │
  │       │         │                           │ position  │
  │       │         │                           │ on the    │
  │       │         │                           │ Hall of   │
  │       │         │                           │ Shadows.  │
  │ Zero  │ Mythic  │ badges/mythic/zero_day.pn │ First     │
  │ Day   │         │ g                         │ operator  │
  │ Pione │         │                           │ to clear  │
  │ er    │         │                           │ a new CTF │
  │       │         │                           │ module.   │
  │ Ghost │ Mythic  │ badges/mythic/ghost_shell │ [SECRET]  │
  │ in    │         │ .png                      │ Earned by │
  │ the   │         │                           │ clearing  │
  │ Shell │         │                           │ the       │
  │       │         │                           │ bootcamp  │
  │       │         │                           │ with 100% │
  │       │         │                           │ quiz      │
  III. Asset Naming Protocol
  For designers generating these assets, the filename MUST match
  the Asset Path column exactly (e.g.,
  /public/assets/achievements/badges/mythic/zero_day.png). This
  ensures the AchievementCard component can automatically resolve
  the image based on the ID.

