# Joeunbo의 개인 소개 사이트

Hugo와 GitHub Pages로 만든 개인 소개 사이트입니다. 관심 분야와 학습 내용, 컴퓨터 그래픽스 수업에서 구현한 로봇팔 프로젝트를 소개합니다.

사이트: https://reperst213.github.io/MyProfile/

## 로컬 빌드에 필요한 도구

- **Hugo Extended 0.167.0**: GitHub Actions에서도 사용하는 버전입니다. [Hugo 0.167.0 공식 릴리스](https://github.com/gohugoio/hugo/releases/tag/v0.167.0)에서 운영체제에 맞는 Extended 버전을 설치합니다. macOS에서는 `hugo_extended_0.167.0_darwin-universal.pkg`를 내려받아 설치할 수 있습니다.
- **Python 3**: 빌드 스크립트를 실행할 때 사용합니다. 로컬 검증에는 Python 3.9.6을 사용했고, GitHub Actions는 Python 3.12를 사용합니다. 설치가 필요하면 [Python 공식 설치 안내](https://www.python.org/downloads/)를 참고합니다.
- **Git**: 저장소를 받고 변경 내용을 관리하는 데 사용합니다. 로컬에서 확인한 버전은 Git 2.54.0입니다. 설치가 필요하면 [Git 공식 설치 안내](https://git-scm.com/install/)를 참고합니다.

설치한 도구의 버전은 다음 명령으로 확인할 수 있습니다.

```bash
hugo version
python3 --version
git --version
```

## 로컬에서 빌드하기

저장소를 내려받은 뒤 루트 폴더에서 실행합니다.

```bash
git clone https://github.com/reperst213/MyProfile.git
cd MyProfile
python3 .github/pages_build.py --build
```

빌드가 완료되면 결과가 `public/`에 생성됩니다. 이 명령은 위에 적은 로컬 Hugo와 Python 버전으로, 커밋된 저장소의 임시 복사본에서 검증했습니다. 생성된 `public/`은 Git에 포함하지 않습니다.

## 소개와 활동 수정하기

- `site/data/profile.yaml`: 이름, 자기소개, 소속, 관심 분야와 GitHub 링크
- `site/data/news.yaml`: 홈 화면의 소식
- `site/data/research.yaml`: 홈 화면의 활동 카드와 링크
- `site/data/writing.yaml`: 홈 화면에서 글 목록으로 이동하는 카드
- `site/content/writing/`: 프로젝트 소개 글. 로봇팔 소개는 `robot-arm.md`
- `site/static/projects/robot-arm/`: 직접 실행할 수 있는 로봇팔 프로젝트 파일

## 수정 후 재배포하기

1. 위에서 안내한 파일을 수정하고 저장합니다.
2. 저장소의 루트 폴더에서 변경 내용을 확인하고 커밋합니다. 예를 들어 자기소개를 수정했다면 다음과 같이 실행합니다.

   ```bash
   git status
   git diff -- site/data/profile.yaml
   git add site/data/profile.yaml
   git commit -m "Update profile"
   ```

   다른 파일을 수정했다면 해당 파일 경로와 변경 내용에 맞는 커밋 메시지를 사용합니다.
3. `main` 브랜치에 커밋을 push합니다.

   ```bash
   git push origin main
   ```

4. [GitHub Actions 실행 목록](https://github.com/reperst213/MyProfile/actions)에서 해당 커밋의 `Deploy Hugo to GitHub Pages` 실행을 열고 빌드와 배포가 성공했는지 확인합니다. 이후 [공개 사이트](https://reperst213.github.io/MyProfile/)에서 수정 내용과 링크가 정상인지 확인합니다.

## 테마 출처

이 사이트는 [Yajie Xu의 Celadon 테마](https://github.com/Yajie-Xu/hugo-celadon)를 사용합니다. 테마의 MIT 라이선스 고지는 [LICENSE.txt](LICENSE.txt)에 있습니다. 아래에는 원본 테마의 안내를 보존했습니다.

---

# Celadon 🍵

**An intellectual portfolio theme exploring the equilibrium between academic rigor and creative design.**

| Preview | Alternate Profile Layout |
| - | - |
| <img src="https://github.com/Yajie-Xu/hugo-celadon/blob/main/images/screenshot.png?raw=true" alt="Celadon theme preview" width="900"> | <img src="https://github.com/Yajie-Xu/hugo-celadon/blob/main/images/screenshot2.png?raw=true" alt="Celadon alternate profile layout preview" width="900"> |

➤ Check out the [Live Demo](https://yajie-xu.github.io/hugo-celadon/) | ➤ View on [Hugo Themes](https://themes.gohugo.io/themes/hugo-celadon/)

**Celadon** is a lightweight, responsive, one-page portfolio theme for [Hugo](https://gohugo.io). It is designed for **Academics**, **Data Scientists**, and **Creative Technologists**. It balances a rigorous publication list with a soft, "Morandi" color palette and modern grid layouts.

## ✨ Features

* **🎨 Morandi Design System:** A calm, high-contrast palette featuring Muted Teal, Warm Clay, and Cinnabar accents.
* **📜 One-Page Architecture:** A smooth-scrolling homepage that acts as a gateway to deep content.
* **🌙 Auto Dark Mode:** A sophisticated "Deep Slate" theme for low-light reading.
* **🧮 Academic Ready:** Native support for **KaTeX** (Math) and **Hugo Chroma** (Code Highlighting) with a "Gemini-style" copy interface.
* **🧩 Modular Sections:** Easily reorder sections (About, News, Research, Builds, Writing) via `hugo.toml`.
* **📱 Fully Responsive:** Collapsible layouts that look great on mobile and tablets.

## 🚀 Installation

### 1. Initialize Hugo

Inside your empty project folder:

```bash
hugo new site my-portfolio
cd my-portfolio
git init
```

### 2. Add Celadon Theme

```bash
git submodule add [https://github.com/Yajie-Xu/hugo-celadon.git](https://github.com/Yajie-Xu/hugo-celadon.git) themes/celadon
```

### 3. Update Configuration

Copy the `hugo.toml` from the exampleSite folder to your root, or add this to your existing config:

```toml
theme = "celadon"
```

## 📘 User Guide: Customizing Your Site

Celadon is designed to separate your **Content** (Markdown) from your **Homepage Layout** (Data).

### 1. Project Structure

Here is a map of what you should edit and what you can ignore.

```text
my-portfolio/
├── hugo.toml                <-- ⚙️ CONFIG: Menu, Title, Section ordering
├── content/                 <-- 📝 CONTENT: Your deep pages (Blogs, Papers)
│   ├── study/               
│   │   ├── _index.md        <-- Required for the section cover info
│   │   └── math-note.md     <-- Actual content page
│   └── _index.md            <-- Do not delete (Homepage entry point)
├── data/                    <-- 🗂️ HOMEPAGE DATA: Content for the main page cards
│   ├── news.yaml            <-- Matches "news" section
│   ├── research.yaml        <-- Matches "research" section
│   └── profile.yaml         <-- Your bio info
├── static/                  <-- 🖼️ ASSETS: Images, PDFs
│   └── images/              
├── themes/                  <-- ⛔ THEME: Do not edit directly
│   └── celadon/
│       ├── images/          
│       │   ├── tn.png       <-- Ignore (Required for Hugo Gallery)
│       │   └── screenshot.png <-- Ignore (Required for Hugo Gallery)
│       └── ...
└── ...
```

### 2. Managing the Homepage

The homepage is built dynamically based on your configuration.

**Step 1: Define Sections** Open `hugo.toml`. Under `[params.homepage]`, the `sections` list determines what appears and in what order.

````toml
[params.homepage]
  sections = ["hero", "news", "research", "writing"]
````

**Step 2: Create Matching Data Files** For every item in that list (e.g., `"writing"`), Hugo looks for a matching YAML file in the `data/` folder (e.g., `data/writing.yaml`).

* *Note*: The naming is case-insensitive, but keeping them lowercase is recommended.

**Step 3: Choose the Layout** In `hugo.toml`, tell Celadon how to render that section:

```toml
[params.homepage.writing]
  enable = true
  title = "Selected Writing"
  layout = "grid"  # Options: "hero", "news", "cards", "grid"
```

For timeline-style sections that use the `news` layout, you can also set how many entries are visible before the “Show More” button appears:

```toml
[params.homepage.news]
  enable = true
  title = "Updates"
  layout = "news"
  limit = 5
```

The `limit` value controls the number of `data/news.yaml` items shown initially on the homepage. If there are more entries than the limit, Celadon hides the rest behind the expandable button.

### 3. Creating Deep Pages (Sub-pages)

To link a Homepage Card (e.g., "Study Notes") to a list of actual articles:

**3.1. Create the Folder Structure** Inside `content/`, create a folder that matches your topic. You must include an `_index.md` file for the list layout to work.

```text
content/
└── study/
    ├── _index.md       <-- The "List" page definition
    ├── note-01.md
    └── note-02.md
```

**3.2. Configure** `_index.md` This file defines the title and description users see when they click through.

```markdown
---
title: "Study Notes"
description: "My raw notes on math and code."
layout: "list"
---
(Welcome text here...)
```

**3.3. Add Articles** Inside the same folder, add your individual notes or articles as separate Markdown files.

```markdown
---
title: "Understanding Eigenvalues"
date: 2025-11-20
summary: "A deep dive into eigenvalues and their applications."
image: "/images/EigenArt.png"
tags: ["Math", "Linear Algebra"]
---
(Content of the article...)
```

**3.4. Link it from the Homepage** Open your data file (e.g., `data/writing.yaml`) and set the `link` property to the folder path.

```yaml
items:
  - title: "Study Notes"
    image: "/images/cover.jpg"
    link: "/study/"   <-- This points to content/study/_index.md
```

### 4. System Files (What to Ignore)

If you look inside themes/hugo-celadon/, you will see specific image files required for theme submission. You do not need to replace these unless you are forking the theme to release your own version.

* images/screenshot.png: Used by the Hugo Theme Gallery to preview the theme.

* images/tn.png: A thumbnail used by the Hugo Theme Gallery.

* layouts/: The logic engine. Don't touch unless you are a developer modifying the core code.

## Rich Text & Custom Labels

| Area | Field(s) | Rich Text Capabilities | Notes |
| - | - | - | - |
| Profile card (`data/profile.yaml`) | `title`, `summary`, `affiliation` | Inline HTML (`<br>`, `<em>`) + Markdown (`~~strike~~`, `**bold**`) | Rendered through `enrich-text`, so HTML/Markdown mixes safely. |
| News timeline (`data/news.yaml`) | `detail` | Markdown links `[text](url)` + inline formatting | Badges stay plain strings; only `detail` is enriched. |
| Research cards (`data/research.yaml`) | `summary`, `links`, `coauthors`, `coauthors_label` | Markdown summaries, standard YAML links, per-card label overrides | `coauthors_label`/`coauthorsLabel` replaces the default “Co-authors”. |

Common rich text patterns:

| Style | YAML example | Result |
| - | - | - |
| Bold | `detail: "Released **Celadon v2.0**"` | Normal Markdown bold |
| Accent text | `detail: "Released ~~Celadon v2.0~~"` | Theme accent color |
| Highlight pill | `detail: "Released ==Celadon v2.0=="` | Soft highlighted mark |
| Link | `detail: "Read the [docs](https://example.com)"` | Styled Markdown link |

#### Example Snippet for Profile

```yaml
# Profile
name: "Dr. Ada Sol"
title: "Research Lead • AstroEconomics<br>M.S. • Applied AI"
summary: >
  Explorer of ~~boring~~ *bold* market dynamics on Mars. Enthusiastic about
  cooperative agents and <strong>playful policy experiments</strong>.
affiliation: "New Olympus University<br><em>Institute for Stellar Trade</em>"
profile_image: "/images/profile.png"
profile_layout: "modern" # Options: "modern" or "classic"
profile_image_style: "circle" # Options: "circle" or "rectangle"
list:
  - "Bullet-style highlight"
  - "Another highlight"
keyword_sections:
  - title: "Keyword Badge Section"
    rows:
      - ["Badge One", "Badge Two"]
```

Use `list` for the original bullet-style profile highlights. Use `keyword_sections` for grouped badge rows. If both are present, both render: `keyword_sections` first, then `list`.

#### Example Snippet for News

```yaml
# News Entry
- date: "Jan 2026"
  detail: "Presented joint work with [Ravi Zenith](https://example.com) on comet-futures at the [Galactic Finance Forum](https://example.org)."
  badges: ["Talk"]
```

#### Example Snippet for Cards

```yaml
# Research Card
- title: "Agentic Hedging in Zero-G Ports"
  summary: >
    Simulates cargo-insurance strategies using cooperative RL pilots.
  coauthors_label: "Collaborators"
  coauthors:
    - name: "Eli Vega"
      url: "https://eli-vega.space"
    - name: "Mira Chen"
  image: "/images/research/zero-g.jpg"
  tags: ["RL", "finance"]
  links:
    - label: "Preprint"
      url: "https://example.com/zero-g.pdf"
```

<!-- ## Rich Text in Profile + News

Both `data/profile.yaml` and `data/news.yaml` are rendered with `safeHTML`, so you can mix Markdown + inline HTML to highlight important bits.

### Supported Patterns

| Purpose          | Syntax in YAML (raw text)                                           | Notes                              |
|------------------|---------------------------------------------------------------------|------------------------------------|
| **Bold**         | `detail: "**Accepted** to CVPR 2025."`                              | Standard Markdown bold             |
| *Italic*         | `summary: "*Behavioral* + computational economics."`                | Standard Markdown italic           |
| Hyperlink        | `detail: "Joint work with [Kazuma Takakura](https://kazumatakakura.github.io/)"` | Markdown links auto-styled         |
| Highlight text   | `summary: "Exploring <mark>Bayesian incentives</mark> in markets."` | Uses hero highlight pill colors    |
| Accent in news   | `detail: "<span class=\"news-accent\">1st Place</span> Best Overall"` | Renders in accent color for news only |
| Line break       | `title: "Ph.D. Candidate • Economics<br>M.S. • Artificial Intelligence"` | Use `<br>` where you want the break |

### Example

```yaml
# data/profile.yaml
summary: >
  Interdisciplinary researcher studying <mark>network economics</mark> and
  <a href="/writing/">computational design</a>.
highlights:
  - "Co-led the <mark>Impact Lab</mark> fellowship."
  - "Published *Bayesian Incentives* in **Econometrica**."

# data/news.yaml
- date: "Nov 2025"
  detail: "Presented joint work with [Kazuma Takakura](https://kazumatakakura.github.io/) on innovation networks."
  badges: ["Talk"]

- date: "Apr 2025"
  detail: "<span class=\"news-accent\">1st place</span> Best Overall at [HackUSF 2025](https://devpost.com/software/skin-scan)."
  badges: ["Award"]
``` -->

## 🤠 Favicon

To customize the favicon, add your `favicon.ico` files to the `static/` directory of your Hugo site. You can generate a favicon using online tools like [favicon.io](https://favicon.io/). The files' name are automactically genreated via the tool. The file structure should look like this:

```text
static/
├─ android-chrome-192x192.png
├─ android-chrome-512x512.png
├─ apple-touch-icon.png
├─ favicon-16x16.png
├─ favicon-32x32.png
├─ favicon.ico
└─ site.webmanifest
```

## ⚖️ License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/Yajie-Xu/hugo-celadon/blob/main/LICENSE.txt) file for details.

## 👩🏻‍💻 Author

[Yajie Xu](https://yajiexu.com)
