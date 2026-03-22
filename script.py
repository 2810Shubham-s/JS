"""
Image File Renamer (Folder)
===========================
Renames all image files in a folder by appending a rotating 2-character
suffix: ab, bc, cd, de, ..., yz, za, ab, bc, ... (loops forever)

Supported formats: .png, .jpg, .jpeg, .webp, .gif, .bmp, .tiff, .svg

Usage:
    python rename_images_in_folder.py <folder_path>

Example:
    python rename_images_in_folder.py C:/Users/You/Pictures/categories_2026-03-21_20_43
    python rename_images_in_folder.py ./my_images

Optional - dry run (just preview, don't rename):
    python rename_images_in_folder.py <folder_path> --dry-run
"""

import os
import sys
import string


SUPPORTED_EXTENSIONS = {'.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.tiff', '.svg'}


def get_suffix(index: int) -> str:
    """
    Returns rotating 2-char suffix for a given index.
    0 -> 'ab', 1 -> 'bc', 2 -> 'cd', ..., 24 -> 'yz', 25 -> 'za', 26 -> 'ab', ...
    """
    alphabet = string.ascii_lowercase
    i = index % 26
    return alphabet[i] + alphabet[(i + 1) % 26]


def rename_images(folder_path: str, dry_run: bool = False):
    if not os.path.isdir(folder_path):
        print(f"❌ Error: '{folder_path}' is not a valid folder.")
        sys.exit(1)

    # Collect all image files, sorted for consistency
    image_files = sorted([
        f for f in os.listdir(folder_path)
        if os.path.splitext(f)[1].lower() in SUPPORTED_EXTENSIONS
    ])

    if not image_files:
        print("⚠️  No image files found in the folder.")
        return

    print(f"\n📁 Folder : {folder_path}")
    print(f"🖼️  Images found: {len(image_files)}")
    if dry_run:
        print("👁️  DRY RUN MODE — no files will be renamed\n")
    print("-" * 60)

    renamed = 0
    skipped = 0

    for index, filename in enumerate(image_files):
        name, ext = os.path.splitext(filename)
        suffix = get_suffix(index)
        new_filename = f"{name}{suffix}{ext}"

        old_path = os.path.join(folder_path, filename)
        new_path = os.path.join(folder_path, new_filename)

        # Skip if new name already exists (avoid overwrite)
        if os.path.exists(new_path) and old_path != new_path:
            print(f"  ⚠️  SKIP (target exists): '{filename}' -> '{new_filename}'")
            skipped += 1
            continue

        print(f"  ✅ '{filename}'  ->  '{new_filename}'")

        if not dry_run:
            os.rename(old_path, new_path)
            renamed += 1
        else:
            renamed += 1  # count as "would rename" in dry run

    print("-" * 60)
    if dry_run:
        print(f"\n👁️  Would rename: {renamed} file(s), Skip: {skipped} file(s)")
        print("    Run without --dry-run to apply changes.")
    else:
        print(f"\n✅ Renamed: {renamed} file(s) | Skipped: {skipped} file(s)")
        print("🎉 Done!")


def main():
    if len(sys.argv) < 2:
        print("Usage: python rename_images_in_folder.py <folder_path> [--dry-run]")
        print("Example: python rename_images_in_folder.py ./my_images")
        print("Preview:  python rename_images_in_folder.py ./my_images --dry-run")
        sys.exit(1)

    folder_path = sys.argv[1]
    dry_run = "--dry-run" in sys.argv

    rename_images(folder_path, dry_run)


if __name__ == "__main__":
    main()