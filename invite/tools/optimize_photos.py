"""invite/photos/ 에 새로 넣은 사진을 웹용으로 줄인다.

- 원본은 photos/_original/ 로 옮긴다 (git에 올라가지 않음).
- 웹용은 같은 이름의 .jpg 로 photos/ 에 저장한다. 긴 변 1600px, 위치 정보(EXIF) 제거.
- 이미 처리한 사진은 건너뛴다. 다시 만들려면 웹용 파일을 지우고 실행.

실행: python invite/tools/optimize_photos.py
"""
from pathlib import Path
from PIL import Image, ImageOps

PHOTOS = Path(__file__).resolve().parent.parent / 'photos'
ORIGINAL = PHOTOS / '_original'
EXTS = {'.jpg', '.jpeg', '.png', '.webp', '.heic'}
MAX_SIDE = 1600


def web_version(src: Path, dst: Path) -> None:
    im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
    im.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
    im.save(dst, 'JPEG', quality=82, optimize=True, progressive=True)  # EXIF를 넘기지 않아 위치 정보가 빠진다


def main() -> None:
    ORIGINAL.mkdir(exist_ok=True)
    for f in sorted(PHOTOS.iterdir()):
        if not f.is_file() or f.suffix.lower() not in EXTS:
            continue
        dst = PHOTOS / (f.stem + '.jpg')
        orig = ORIGINAL / f.name
        if (orig.exists() and dst.exists()) or f.name == 'og.jpg':
            continue  # 이미 처리된 웹용 파일
        f.replace(orig)
        web_version(orig, dst)
        print(f'{f.name} -> {dst.name} ({dst.stat().st_size // 1024}KB)')

    # 카카오톡 미리보기용 og.jpg (1200x630) 를 커버 사진으로 만든다
    cfg = (PHOTOS.parent / 'config.js').read_text(encoding='utf-8')
    import re
    m = re.search(r"cover:\s*'([^']+)'", cfg)
    if m and (PHOTOS / m.group(1)).exists():
        im = Image.open(PHOTOS / m.group(1)).convert('RGB')
        im = ImageOps.fit(im, (1200, 630), Image.LANCZOS, centering=(0.5, 0.35))
        im.save(PHOTOS / 'og.jpg', 'JPEG', quality=82, optimize=True)
        print('og.jpg updated from', m.group(1))


if __name__ == '__main__':
    main()
