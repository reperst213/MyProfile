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

## 자료 출처와 이용 조건

이 사이트는 [Yajie Xu의 Celadon 테마](https://github.com/Yajie-Xu/hugo-celadon)를 사용합니다. 테마의 MIT 라이선스 고지는 [LICENSE.txt](LICENSE.txt)에 있습니다. 테마 사용법은 [원본 테마 README](site/themes/template/README.md)에서 확인할 수 있습니다.

| 자료 | 사용 위치·구분 | 출처와 이용 조건 |
| --- | --- | --- |
| Celadon 테마 | 사이트 레이아웃과 스타일 · 외부 자료 | [Yajie Xu의 Celadon](https://github.com/Yajie-Xu/hugo-celadon) · MIT 라이선스, [라이선스 고지](LICENSE.txt) 유지 |
| Pretendard 글꼴 | 사이트 글꼴 · 외부 자료 | [Pretendard](https://github.com/orioncactus/pretendard) · [SIL Open Font License](https://github.com/orioncactus/pretendard/blob/main/LICENSE) |
| gl-matrix 3.4.3 | 로봇팔 행렬 계산 · 외부 자료 | [gl-matrix](https://github.com/toji/gl-matrix) · MIT 라이선스, 사용한 [파일](site/static/projects/robot-arm/lib/gl-matrix-min.js)에 저작권·라이선스 고지 포함 |
| KaTeX 0.16.9 | 테마의 수식 표시 · 외부 자료 | [KaTeX](https://github.com/KaTeX/KaTeX/tree/v0.16.9) · 코드의 [MIT 라이선스](https://github.com/KaTeX/KaTeX/blob/v0.16.9/LICENSE) |
| 수업 제공 자료 | `prepare_github_pages.py`, 로봇팔 과제의 예제 코드 · 수업 자료 | 초급프로젝트 및 컴퓨터 그래픽스 수업에서 제공 |
| 프로필 이미지 | `site/static/images/profile.png` · AI 생성 | ChatGPT로 생성 |
| 로봇팔 이미지 | `site/static/images/robot-arm.jpg` · 화면 캡처 | 직접 구현한 로봇팔 실행 화면을 캡처 |
| 사이트 문구와 수정 코드 | 소개·활동 글, 사이트 설정과 스타일 · 직접 작성·AI 도움 | 직접 작성과 ChatGPT/Codex의 문장 정리·구현 도움을 함께 사용 |
| Writing 카드 배경 | [Celadon 테마 예제 이미지](https://github.com/Yajie-Xu/hugo-celadon/blob/main/exampleSite/static/images/ZenBrushstroke.png) | 원본 프로젝트는 [MIT 라이선스](https://github.com/Yajie-Xu/hugo-celadon/blob/main/LICENSE.txt)로 배포됨; 이미지 제작자와 별도 이용 조건은 명시되지 않음 |
