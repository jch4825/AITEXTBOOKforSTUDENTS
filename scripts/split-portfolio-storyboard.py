"""Store a module-close storyboard and export its first three panels as WebP."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageOps


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--module", required=True, choices=[f"m{number}" for number in range(1, 7)])
    parser.add_argument("--gutter", type=int, default=10)
    parser.add_argument("--quality", type=int, default=88)
    return parser.parse_args()


def save_webp(image: Image.Image, output: Path, size: tuple[int, int], quality: int) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    prepared = ImageOps.fit(
        image,
        size,
        method=Image.Resampling.LANCZOS,
        centering=(0.5, 0.5),
    )
    prepared.save(output, "WEBP", quality=quality, method=6, exact=True)
    with Image.open(output) as result:
        if result.format != "WEBP" or result.size != size:
            raise RuntimeError(f"Invalid output: {output}")


def main() -> None:
    args = parse_args()
    if not args.input.is_file():
        raise FileNotFoundError(args.input)

    with Image.open(args.input) as source:
        image = ImageOps.exif_transpose(source).convert("RGB")
        save_webp(
            image,
            Path(f"docs/storyboards/generated/module-close/{args.module}-close-storyboard.webp"),
            (1600, 1600),
            args.quality,
        )

        width, height = image.size
        center_x = width // 2
        center_y = height // 2
        half_gutter = max(0, args.gutter // 2)
        boxes = [
            (0, 0, center_x - half_gutter, center_y - half_gutter),
            (center_x + half_gutter, 0, width, center_y - half_gutter),
            (0, center_y + half_gutter, center_x - half_gutter, height),
        ]
        for index, box in enumerate(boxes, start=1):
            output = Path(
                f"public/lessons/story/module-close/{args.module}/"
                f"{args.module}-close-scene-{index:02d}.webp"
            )
            save_webp(image.crop(box), output, (1200, 900), args.quality)
            print(f"{output} | 1200x900 | WebP")


if __name__ == "__main__":
    main()
