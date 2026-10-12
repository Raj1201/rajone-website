# STUDY — reference/Raj One Final.jpg

Forensic notes taken from 12 full-resolution tiles (4×3 grid of 1376×1024 px crops) plus zoomed crops of
every interface element. Positions were measured by pixel-scanning the 5504×3072 original with a canvas
script (white-text bounding boxes), and are given as **% of page width (x) / % of page height (y)**.
Aspect ratio is 1.792:1, so it is essentially 16:9 and maps onto 1920×1080 almost exactly.

## 1. Page structure

A single full-viewport hero (100% × 100%). One photograph fills the whole frame edge to edge; there are no
panels, cards or extra sections. Everything else is white or cream text floating over the photo:

| Layer | Content |
|---|---|
| 1 (back) | Full-bleed night photograph of a modern hillside villa and infinity pool, already darkened |
| 2 | Logo, nav, ENQUIRE button, headline, tagline, scroll cue, all real text |

No element overlaps the subject in a way that needs a cutout. The text sits **on top of** the photo, so no
layer sandwich (background, then text, then cutout) is needed.

## 2. Interface elements, word for word

| Element | Exact text | Bounding box (x0–x1 %, y0–y1 %) | Notes |
|---|---|---|---|
| Logo | (glyph only, no text) | 3.05–5.38 / 3.4–8.0 | Serif capital **A** monogram. The left leg is replaced by a thin calligraphic hairline that sweeps from the apex down and to the right in an S-curve, then curls into the right leg about 70% of the way down. There is no straight crossbar; the swash *is* the crossbar. Flat bracketed serifs on both feet. Colour is translucent warm cream (≈ #E6D8C6 at ~75% opacity, reading as #C9B49E over the amber ceiling). |
| Nav item 1 | `PROJECTS` | 39.08–43.90 / 5.21–6.38 (cap height) | |
| Nav item 2 | `STUDIO` | 46.09–49.55 / same | |
| Nav item 3 | `NEWS` | 51.73–54.36 / same | |
| Nav item 4 | `CONTACT` | 56.50–60.96 / same | |
| Nav group | — | 39.08–60.96, centre **50.0%** | Gap between words is a constant **≈2.17% of width** (≈42 px at 1920). Clean geometric/grotesque sans (Inter-like: round O, R with straight leg, flat-topped J that descends slightly). Uppercase, regular weight (400), pure white, near-zero tracking (≈0.02em). Cap height = 1.17% of page height (≈12.6 px at 1080, so font-size ≈ 17–18 px, ≈0.92vw). |
| Button | `ENQUIRE` | box 89.84–96.88 / 3.48–8.07 | 1 px solid white outline rectangle, transparent fill, square corners. Box ≈135×49 px at 1920. Same sans, same size and weight as the nav, centred in the box. The box's right edge sits 3.12% from the right, mirroring the logo's 3.05% left inset. Its vertical centre (5.78%) equals the nav's centre line (5.80%). |
| Headline line 1 | `ARCHITECTURAL` | 25.74–74.16 / 37.47–45.12 | High-contrast display serif, all caps, regular weight, pure white. Cap height = 7.65% of height (≈82.6 px at 1080, so font-size ≈ 118 px ≈ 6.1vw). Text width = 48.4% of page width. Wide, classical proportions: R with a straight diagonal leg, C with vertical serifs at both terminals, wide U, sharp-apexed A with a thin left stroke, L with a long foot. Bracketed wedge serifs, moderate–high stroke contrast (Didone-leaning but softer, closer to a modern transitional display serif). Tight but not touching letterspacing (≈0). |
| Headline line 2 | `MASTERY` | 36.74–63.50 / 47.79–55.44 | Same style. Cap-top to cap-top distance = 10.32% of height (≈111 px), so line-height ≈ 0.94 of font-size. Centred on 50.1%. |
| Tagline | `Bespoke residences for the modern connoisseur.` | 34.08–65.92 / 59.41–62.24 (ascender top to descender bottom) | Serif text face (book/regular weight, moderate contrast, generous x-height, like a contemporary text serif such as Newsreader or Source Serif). Sentence case with the full stop. White. Width 31.8% of page (≈611 px at 1920), so font-size ≈ 30 px (≈1.6vw). Gap from MASTERY baseline to tagline cap top ≈ 4% of height. |
| Scroll arrow | (↓ glyph) | 49.55–50.44 / 88.83–91.80 | Thin 1–1.5 px white line arrow: a long vertical stem with an open chevron head (two short strokes at ~45°). ≈32 px tall × 17 px wide at 1080. Centred. |
| Scroll label | `SCROLL TO EXPLORE` | 45.39–54.56 / 94.04–95.08 (cap height) | Same sans as the nav, uppercase, white, slightly smaller (cap ≈11.3 px, so font-size ≈ 15.5 px ≈ 0.81vw), wider tracking (≈0.08–0.1em). Centred. |

Every text element is horizontally centred on the page except the logo (left) and ENQUIRE (right).
There is no other micro-text anywhere in the image: no lettering on the building, no watermark and no
captions. All four corners are clean photo.

## 3. The hero subject (the photograph)

**What it is:** blue-hour exterior of a contemporary cantilevered hillside villa, shot from the outdoor
terrace. A warm-lit double-height living room is on the left behind floor-to-ceiling glass, and a glowing
infinity pool with a valley city view is on the right.

**Camera:** standing on the terrace at eye height (~1.5 m), wide lens (~24 mm full-frame equivalent),
looking slightly up at the corner where the living-room glazing meets the outdoor terrace. It's a
three-quarter view with no tilt; verticals are straight. Strong two-point perspective: floor and soffit
lines converge to the right.

**Region by region (x %, y %):**
- **Roof / soffit (top 0–35%, x 0–73%).** A deep overhanging flat roof whose underside is clad in narrow
  horizontal warm-brown timber boards (cedar or ipe, oiled), lit warmly from below. The dark fascia edge
  runs as a strong diagonal from the top edge at x≈45% down to x≈73%, y≈31%, ending in a sharp corner
  against the sky. A second, upper roof plane steps back at the top centre.
- **Living-room ceiling (x 0–40%, y 0–28%).** Smooth plaster glowing deep amber (#AD6D32 sampled). It is
  brighter top-left, with small square recessed downlights (bright white-gold dots), and a round speaker
  grille near x≈23%, y≈26%. A thin vertical glass mullion runs at x≈23%.
- **Pendant cluster (x 7–19%, y 19–48%).** About 7 hand-blown **smoked-amber glass pendants** hang at
  staggered heights on very long thin brass rods from small round brass ceiling canopies. There are two
  shapes: wide squat "saucer/onion" domes and tall "lantern/cylinder" bottles. Each has a glowing
  filament inside, giving a bright vertical flame-shaped core. Their reflection repeats faintly in the
  glass at far left (x 0–4%, y 48–53%).
- **Mezzanine band (x 0–40%, y 28–37%).** A thick dark (almost black-brown) horizontal beam or balcony
  edge crosses the room above the pendants' lower group, with a clerestory strip of dark window above
  it.
- **Stone fireplace column (x 30–40%, y 28–68%).** A floor-to-ceiling chimney breast of rough
  **stacked natural stone**: irregular golden-tan and grey rubble pieces with deep shadowed joints,
  grazed by warm light from above so the top glows and the texture reads strongly. At its base is a
  wide **linear fireplace** (x 31–39%, y 61–68%) with a black surround and tall orange flames dancing
  over a glass-ember bed. A long floating pale stone/concrete hearth bench extends right from the base
  (x 29–40%, y 67–70%).
- **Artwork (x 27.6–29.6%, y 55–62%).** A small framed black-and-white abstract print in a thin black
  frame with a white mat, on the wall left of the fireplace.
- **Sofa (x 3–34%, y 64–83%).** A large low **oatmeal/sand linen L-shaped modular sectional** with a
  chaise end pointing right toward the fireplace, on thin dark-bronze metal legs. A built-in walnut
  open shelf sits at the left arm end. There are beige cushions plus two deep **burgundy/oxblood** throw
  pillows. A **cognac leather** lounge chair and a small plant sit behind it near the fireplace
  (x 22–26%, y 63–67%).
- **Rug and floor (x 0–40%, y 72–95%).** A low-pile taupe-grey rug with a soft sheen. Wide-plank,
  light-to-mid **natural oak** floor with a warm satin sheen.
- **Threshold.** A flush dark-bronze sliding-door track crosses diagonally from bottom-left (x 0, y≈95%)
  up to the glass corner (x≈40%, y≈77%). Inside and outside floors are level.
- **Glass corner (x 40–66%).** Floor-to-ceiling sliding glass panels with slim black/dark-bronze frames.
  Vertical mullions sit at x≈40.5%, 51%, 57%, 63% and 66%. Through the right-hand glazing you see a
  dining table and chairs, a second sofa and a stone wall (x 46–66%, y 60–72%). An upper-storey wall
  section between the glass is clad in horizontal timber slats (x 52–56%, y 25–50%).
- **Upper balcony (x 45–72%, y 36–50%).** A cantilevered slab with a dark fascia and frameless glass
  balustrade, recessed downlights in its soffit, and a glass-walled upper room behind it.
- **Terrace (x 0–100%, y 70–100%).** Very large-format taupe-brown stone or porcelain pavers with fine
  joints converging to the right. Warm light from the interior spills onto them near the glass. They
  darken to brown-black toward the bottom and to purple-black at bottom right.
- **Infinity pool (x 61–100%, y 67–92%).** A long rectangular vanishing-edge pool whose water glows
  saturated **turquoise/cyan** from underwater lights (bright white starburst points near x≈65.5%,
  y≈80% and x≈71%, y≈74%). A shallow sun-shelf step sits at its near-left corner. The far edge vanishes
  into the view, and the right side has a raised coping and glass balustrade. Gentle caustic texture on
  the water.
- **Sky and view (x 66–100%, y 0–70%).** Deep navy at the top (#032758) shifting to royal/cobalt blue
  (#02427C) mid-frame. Long streaky cirrus and stratus clouds sweep diagonally (lower right to upper
  left), dark slate against the blue. Just above the horizon is a thin **ember-orange to dusty rose
  sunset band** (y≈56–60%). Below it is a low dark-blue mountain ridge silhouette (y≈57–58%), then a wide
  valley carpeted in **sparkling city lights**: warm sodium-orange and cool white points (x 64–100%,
  y 58–72%).

## 4. Lighting

- **Two light worlds:** inside is warm tungsten (~2700 K amber/orange, from the pendants, the downlights
  and the fire); outside is cool blue-hour ambient (~9000 K+ navy/cobalt).
- The warm/cool split runs diagonally: the left ~45% of the frame is amber, the right ~40% is blue, and
  the pool adds a cyan accent in the bottom right.
- Light direction: the interior glow spills outward, left to right, onto the terrace. The stone column is
  grazed from above, the pool is lit from below the water, and the soffit is warmly lit from beneath.
- There's no direct sun; the sky gives a soft, even fill.

## 5. Colour mood and grade

- The whole photo carries a **uniform darkening, roughly −0.8 to −1 stop**, so the white type pops.
  Mean luminance is about 55/255. Band luminance from top to bottom is 43, 57, 65, 57, 72, 54, 42, 57,
  63, 48: the darkest areas are the top sky, the region just below the headline and the bottom edge.
- Highlights (downlights, pendant cores, flames, pool lights) stay bright but small. Nothing is clipped
  to large white areas.
- The blacks are **not neutral**: warm brown-black on the left (#2B1308 in the soffit shadow), purple-
  and navy-black on the right (#181320 bottom-right, #0A0A17 in the valley).
- **Darkest tone of the design: ≈ #0E090C** (near-black warm plum), sampled behind the headline.
- Rich and filmic: moderate contrast, saturated amber and cobalt, deep but not crushed shadows, a slight
  film grain, an editorial architectural-photography feel. There's a soft vignette toward the bottom.

Key sampled colours (40×40 px averages from the reference):

| Sample | Hex |
|---|---|
| Amber ceiling | #AD6D32 |
| Soffit timber shadow | #2B1308 |
| Sky top | #032758 |
| Sky mid | #02427C |
| Sky low | #183351 |
| Sunset band | #63363B |
| Valley | #0A0A17 |
| Terrace near | #362018 |
| Terrace far bottom | #2F1D1E |
| Pool water | #035477 |
| Bottom-left corner | #664025 |
| Bottom-right corner | #181320 |
| Behind headline (darkest) | #0E090C |

## 6. Decisions that come from these notes

1. **Hero subject = the entire photograph.** In this design the subject (villa, terrace and pool) fills
   the frame and *is* the background; the sky and valley are part of the photo, not a separate backdrop.
   So the hero asset is the full scene recreated at 16:9 with every piece of typography and interface
   removed. Putting the house on an empty dark background would destroy the composition. Nano Banana
   Pro gets the reference as an image reference and is asked to reproduce the exact photograph (same
   camera, layout, lighting and darkened grade) with no logo, nav, button, headline, tagline or arrow.
2. **No cutout or layer sandwich.** No text sits behind the subject.
3. **The grade is baked in.** The generated photo must already have the −1 stop darkened, warm/cool
   look. No CSS filters and no CSS overlay to darken it.
4. **Logo** is a graphic (the swash A), so it's generated as a transparent-background image
   from a crop of the reference logo. Everything else is real HTML text.
5. **Layout units:** vertical positions in `vh`, horizontal in `vw`, type sizes in `vw` (from the
   measurements above at 1920 wide) with sensible clamps, and the hero at `100vh`/`100svh`.
   `background-size: cover` centred on the photo.
6. **Fonts:** a display serif for the headline, a text serif for the tagline, and an Inter-style sans for
   the nav, button and scroll label. The exact families are chosen by rendering candidates next to the
   reference crops.
