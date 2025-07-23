#!/bin/bash

set -e

out_file_name="godotNodeTreeCore$LIB_EXTENSION"
core_lib_file_name="godotNodeTreeCore-$CORE_LIB_VERSION-$TARGET_PLATFORM$LIB_EXTENSION"
core_lib_url="https://github.com/$CORE_LIB_REPO/releases/latest/download/$core_lib_file_name"

echo "Downloading $out_file_name ($core_lib_url)"
file_path="out/$out_file_name"
curl -s -L -o "$file_path" "$core_lib_url"

if [ ! -e "$file_path" ]; then
  echo "Failed to download $out_file_name library." >&2
  exit 1
fi
