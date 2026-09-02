# Hero video

Place your hero background video here:

- `video-site.webm` (recommended — WebM/VP9 for smallest size)
- `video-site.mp4` (optional fallback for Safari)

Specs:
- 16:9 or 16:10 aspect ratio
- 1920×1200 recommended (will be cropped with `object-fit: cover`)
- Duration: 6–12 seconds (seamless loop)
- Muted, no audio track needed (`muted` attribute is required for autoplay)
- Keep file size under 3–5 MB; compress with `ffmpeg -i input.mp4 -an -c:v libvpx-vp9 -crf 35 -b:v 0 -pix_fmt yuv420p -vf "scale=1920:-2" video-site.webm`
- Content should be dark / atmospheric (fursuits, nature, con footage, aurora-like visuals) to match the purple theme

If the video fails to load or is blocked (slow connection, reduced-motion preference), the gradient+emoji fallback will show automatically.

## Community card video
Place `video-community.webm` (and optional `video-community.mp4`) in this folder for the "Community at the center" card. Same specs as hero video: muted, looped, 16:9, compressed to a few MB. If not present, the card falls back to a gradient background.
