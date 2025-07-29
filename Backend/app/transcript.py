from youtube_transcript_api import YouTubeTranscriptApi
from fastapi import HTTPException
from pydantic import BaseModel, Field
from typing import Literal

class TranscriptRequest(BaseModel):
    video_id: str = Field(..., description="ID of YT video.")
    lang: Literal["en", "hi"] = Field(..., description="Language for QA.")

def get_transcript(data:TranscriptRequest):
    try:
        yt = YouTubeTranscriptApi()
        transcript = yt.fetch(data.video_id, languages=[data.lang])
        full_text = " ".join([entry.text for entry in transcript])
        return full_text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid video ID or selected language(use 'en' or 'hi') transcript not avialable!")
