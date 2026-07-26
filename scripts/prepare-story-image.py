"""Prepare one generated story illustration as a production WebP asset."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageOps


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--width", type=int, default=1280)
    parser.add_argument("--height", type=int, default=720)
    parser.add_argument("--quality", type=int, default=88)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if not args.input.is_file():
        raise FileNotFoundError(args.input)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(args.input) as source:
        image = ImageOps.exif_transpose(source).convert("RGB")
        prepared = ImageOps.fit(
            image,
            (args.width, args.height),
            method=Image.Resampling.LANCZOS,
            centering=(0.5, 0.5),
        )
        prepared.save(
            args.output,
            "WEBP",
            quality=args.quality,
            method=6,
            exact=True,
        )

    with Image.open(args.output) as result:
        if result.format != "WEBP":
            raise RuntimeError(f"Expected WEBP, got {result.format}")
        if result.size != (args.width, args.height):
            raise RuntimeError(f"Expected {(args.width, args.height)}, got {result.size}")

    print(f"{args.output} | {args.width}x{args.height} | WebP")


if __name__ == "__main__":
    main()
