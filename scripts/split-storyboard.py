"""Split a generated 2x2 lesson storyboard into four production WebP scenes."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageOps


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument(
        "--output-prefix",
        required=True,
        type=Path,
        help="Example: public/lessons/story/m1/m1-l2-scene",
    )
    parser.add_argument("--gutter", type=int, default=10)
    parser.add_argument("--width", type=int, default=1280)
    parser.add_argument("--height", type=int, default=720)
    parser.add_argument("--quality", type=int, default=88)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if not args.input.is_file():
        raise FileNotFoundError(args.input)

    with Image.open(args.input) as source:
        image = ImageOps.exif_transpose(source).convert("RGB")
        width, height = image.size
        center_x = width // 2
        center_y = height // 2
        half_gutter = max(0, args.gutter // 2)
        boxes = [
            (0, 0, center_x - half_gutter, center_y - half_gutter),
            (center_x + half_gutter, 0, width, center_y - half_gutter),
            (0, center_y + half_gutter, center_x - half_gutter, height),
            (center_x + half_gutter, center_y + half_gutter, width, height),
        ]

        for index, box in enumerate(boxes, start=1):
            panel = image.crop(box)
            prepared = ImageOps.fit(
                panel,
                (args.width, args.height),
                method=Image.Resampling.LANCZOS,
                centering=(0.5, 0.5),
            )
            output = Path(f"{args.output_prefix}-{index:02d}.webp")
            output.parent.mkdir(parents=True, exist_ok=True)
            prepared.save(
                output,
                "WEBP",
                quality=args.quality,
                method=6,
                exact=True,
            )
            with Image.open(output) as result:
                if result.format != "WEBP" or result.size != (args.width, args.height):
                    raise RuntimeError(f"Invalid output: {output}")
            print(f"{output} | {args.width}x{args.height} | WebP")


if __name__ == "__main__":
    main()
