# UIUC Center for Autonomy — Industry & Partnership Site

Live at: **https://uiuc-robotics.github.io/CFA-Research/**

## Site structure

```
index.html          ← Home: 7 research area cards
area/index.html     ← Area detail page (?id=field-mobile, etc.)
faculty/index.html  ← Searchable/filterable faculty directory
data/
  areas.json        ← Research area definitions
  faculty.json      ← Faculty profiles
  capabilities.json ← Capabilities & prototypes
```

---

## How to update content (no coding required)

Edit any file in `data/` directly on GitHub using the pencil ✏️ icon. Changes go live in ~1 minute.

### Add or update a faculty member → `data/faculty.json`

```json
{
  "id": "first-last",
  "name": "First Last",
  "title": "Professor",
  "dept": "ECE",
  "photo": "https://ws.engr.illinois.edu/directory/viewphoto.aspx?photo=XXXX&s=300",
  "url": "https://your-lab.illinois.edu",
  "research": ["Topic 1", "Topic 2", "Topic 3"],
  "areas": ["safe-autonomy", "ai-adaptive"]
}
```

**To find a photo URL**: go to `https://autonomy.illinois.edu/people/[name-slug]` and copy the image src.

### Add a capability → `data/capabilities.json`

```json
{
  "id": "short-unique-id",
  "title": "Capability Title",
  "description": "1–2 sentence description.",
  "areas": ["simulation", "field-mobile"],
  "faculty": ["first-last"],
  "videos": ["YOUTUBE_ID"],
  "tags": ["ROS 2", "Tag 2"],
  "trl": 6
}
```

`videos` = list of YouTube video IDs (the part after `?v=`). Leave `[]` if none.
`trl` = Technology Readiness Level (1–9). Omit if not applicable.

### Add or edit a research area → `data/areas.json`

Each area has: `id`, `title`, `icon` (emoji), `color` (hex), `tagline`, `description`, `narrative`.

**Valid area IDs** (used in faculty and capabilities):
- `field-mobile`
- `dexterous-manipulation`
- `multi-agent`
- `safe-autonomy`
- `ai-adaptive`
- `simulation`
- `new-eyes-bodies`

---

## Local preview

```bash
cd site/
python3 -m http.server 8080
# Open http://localhost:8080
```

(Required because JS uses `fetch()` to load JSON — won't work on `file://`)

## Deploy to GitHub Pages

1. Create repo **`UIUC-Robotics/CFA-Research`** (public)
2. Push this folder's contents to the `main` branch
3. Settings → Pages → Source: **Deploy from branch `main` / `/ (root)`**
4. Live in ~2 minutes at `https://uiuc-robotics.github.io/CFA-Research/`
