#!/bin/bash

filepath="$1"

filename="$(basename $filepath)"

# Use ffprobe to get the duration of the video
duration=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$1")

# Output the duration
echo "File Duration: $duration seconds"

splitDuration=$(python3 -c "print(round((round($duration) / 100),2))")

mkdir -p /tmp/img_collection_ffmpeg/$filename 2>/dev/null
echo $splitDuration
echo $filename
echo $filepath

# Splitting video into 120 different images
echo "\nExtracting frames from the video"
ffmpeg -i $1 -vf fps=1/$splitDuration -q:v 31 /tmp/img_collection_ffmpeg/$filename/img%03d.jpg

directoryPath="/tmp/img_collection_ffmpeg/$filename"
#stitching frames together to create a larger sprite image

echo "Stiching the generated frames together"
montage -border 0 -geometry 1000x -tile 10x10 "$directoryPath"/img*.jpg "$directoryPath/stitched01.jpg"

echo "Compressing the stictched image"
convert "$directoryPath/stitched01.jpg" -strip -interlace Plane -gaussian-blur 0.05 -quality 10% "$directoryPath/stitched01_compressed.jpg"

echo "Clearing the extracted frames"
for img in "$directoryPath"/img*.jpg; do
	rm $img
done
