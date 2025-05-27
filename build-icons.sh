#!/bin/sh

# Build all SVG favicons in the current directory into ICO and PNGs

set -e

SIZES="16 32 48 64 128 256"

for svg in *.svg; do
  base="${svg%.svg}"
  echo "Converting $svg to $base.ico..."
  magick "$svg" -background none -define icon:auto-resize=16,32,48,64,128,256 "$base.ico"

  for size in $SIZES; do
    echo "Converting $svg to $base-${size}x${size}.png..."
    magick "$svg" -background none -resize ${size}x${size} "$base-${size}x${size}.png"
  done

done

echo "All icons generated!" 