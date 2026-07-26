"""Compose four production scenes into one 2x2 source storyboard."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageOps


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--inputs", required=True, type=Path, nargs=4)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--width", type=int, default=1600)
    parser.add_argument("--height", type=int, default=900)
    parser.add_argument("--gutter", type=int, default=10)
    parser.add_argument("--quality", type=int, default=88)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    missing = [path for path in args.inputs if not path.is_file()]
    if missing:
        raise FileNotFoundError(", ".join(str(path) for path in missing))
    if args.gutter < 0 or args.gutter >= min(args.width, args.height):
        raise ValueError("gutter must fit inside the storyboard canvas")

    panel_width = (args.width - args.gutter) // 2
    panel_height = (args.height - args.gutter) // 2
    canvas = Image.new("RGB", (args.width, args.height), "white")
    positions = [
        (0, 0),
        (panel_width + args.gutter, 0),
        (0, panel_height + args.gutter),
        (panel_width + args.gutter, panel_height + args.gutter),
    ]

    for source_path, position in zip(args.inputs, positions, strict=True):
        with Image.open(source_path) as source:
            panel = ImageOps.fit(
                ImageOps.exif_transpose(source).convert("RGB"),
                (panel_width, panel_height),
                method=Image.Resampling.LANCZOS,
                centering=(0.5, 0.5),
            )
            canvas.paste(panel, position)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(args.output, "WEBP", quality=args.quality, method=6, exact=True)
    with Image.open(args.output) as result:
        if result.format != "WEBP" or result.size != (args.width, args.height):
            raise RuntimeError(f"Invalid output: {args.output}")
    print(f"{args.output} | {args.width}x{args.height} | WebP")


if __name__ == "__main__":
    main()
