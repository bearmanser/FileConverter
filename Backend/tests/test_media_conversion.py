from __future__ import annotations

import subprocess
import unittest
from pathlib import Path

from imageio_ffmpeg import get_ffmpeg_exe

from app.converters import convert_file, create_temp_media_path


class MediaConversionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.ffmpeg_path = get_ffmpeg_exe()

    def test_audio_to_audio_conversion(self) -> None:
        source = self.create_audio_sample()

        converted, media_type = convert_file(
            filename="tone.wav",
            content=source,
            source_format="wav",
            target_format="mp3",
        )

        self.assertEqual(media_type, "audio/mpeg")
        self.assertGreater(len(converted), 0)
        self.assert_has_stream(converted, "mp3", "0:a:0")

    def test_video_to_audio_conversion(self) -> None:
        source = self.create_video_sample()

        converted, media_type = convert_file(
            filename="clip.mp4",
            content=source,
            source_format="mp4",
            target_format="mp3",
        )

        self.assertEqual(media_type, "audio/mpeg")
        self.assertGreater(len(converted), 0)
        self.assert_has_stream(converted, "mp3", "0:a:0")

    def test_video_to_video_conversion(self) -> None:
        source = self.create_video_sample()

        converted, media_type = convert_file(
            filename="clip.mp4",
            content=source,
            source_format="mp4",
            target_format="webm",
        )

        self.assertEqual(media_type, "video/webm")
        self.assertGreater(len(converted), 0)
        self.assert_has_stream(converted, "webm", "0:v:0")

    def create_audio_sample(self) -> bytes:
        output_path = create_temp_media_path("wav")
        try:
            self.run_ffmpeg(
                [
                    "-f",
                    "lavfi",
                    "-i",
                    "sine=frequency=1000:duration=1",
                    "-c:a",
                    "pcm_s16le",
                    str(output_path),
                ]
            )
            return output_path.read_bytes()
        finally:
            output_path.unlink(missing_ok=True)

    def create_video_sample(self) -> bytes:
        output_path = create_temp_media_path("mp4")
        try:
            self.run_ffmpeg(
                [
                    "-f",
                    "lavfi",
                    "-i",
                    "testsrc=size=320x240:duration=1:rate=24",
                    "-f",
                    "lavfi",
                    "-i",
                    "sine=frequency=660:duration=1",
                    "-shortest",
                    "-c:v",
                    "libx264",
                    "-pix_fmt",
                    "yuv420p",
                    "-c:a",
                    "aac",
                    str(output_path),
                ]
            )
            return output_path.read_bytes()
        finally:
            output_path.unlink(missing_ok=True)

    def assert_has_stream(self, content: bytes, extension: str, stream_selector: str) -> None:
        media_path = create_temp_media_path(extension)
        try:
            media_path.write_bytes(content)
            self.run_ffmpeg(
                [
                    "-i",
                    str(media_path),
                    "-map",
                    stream_selector,
                    "-f",
                    "null",
                    "-",
                ]
            )
        finally:
            media_path.unlink(missing_ok=True)

    def run_ffmpeg(self, args: list[str]) -> None:
        command = [
            self.ffmpeg_path,
            "-hide_banner",
            "-loglevel",
            "error",
            "-y",
            *args,
        ]
        result = subprocess.run(command, capture_output=True, text=True, check=False)
        if result.returncode != 0:
            self.fail(result.stderr.strip() or "FFmpeg command failed")


if __name__ == "__main__":
    unittest.main()
