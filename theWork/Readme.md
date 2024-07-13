# Voice Assistant Based on Llama3

This project is a voice assistant script running on Windows 11, utilizing various libraries such as `llama_chat`, `speech_recognition`, `datetime`, `gtts`, `pygame`, `threading`, `queue`, and `time`.

## Initialization

The script starts by importing necessary libraries and initializing the `pygame` mixer for audio playback.

```python
from llama_chat import chat_with_llama
import speech_recognition as sr
from datetime import date
from gtts import gTTS
from io import BytesIO
from pygame import mixer 
import threading
import queue
import time

mixer.init()
```

Global Variables
Several global variables are defined to keep track of the assistant's state, user requests, and conversations.

```python
today_date = str(date.today())
num_user_requests = 0 
num_tts_conversions = 0 
num_audio_playbacks = 0

all_messages = []  # Stores chat messages
```
## Functions
`chat_with_llama(request_text, text_queue, llama_finished)`
This function handles user requests and interacts with the Llama3 model to generate responses.

-Appends user request to all_messages.
-Sends messages to the Llama3 model.
-Collects and processes the response, splitting it into smaller chunks for better readability.
-Signals completion using llama_finished.

`record_to_file(text)`

This function converts text to speech and plays it.

-Uses gTTS to convert text to an MP3 file.
-Plays the MP3 file using the pygame mixer.

`text_to_sound(text_queue, text_done, llama_finished, audio_queue, stop_event)`

This function handles the text-to-speech conversion and adds the audio to a queue for playback.

-Converts text from text_queue to speech.
-Adds the resulting MP3 file to audio_queue.
-Signals completion using text_done.

`play_audio_from_queue(audio_queue, text_done, stop_event)`

This function plays audio from the audio_queue.

-Plays MP3 files from audio_queue using the pygame mixer.
-Signals completion when all audio has been played.

`log_activity(text)`

This function logs conversations to a file.

-Appends the given text to a log file named recordedlog-<today's date>.txt.

## Main Function
The `start()` function contains the main workflow of the voice assistant.

-Initializes the speech recognizer and microphone.
-Continuously listens for user input.
-Activates upon hearing a wake word ("vocal signal" in this script).
-Processes user requests and generates responses.
-Handles conversation termination ("that's all").
-Manages threading for Llama3 interaction, text-to-speech conversion, and audio playback.
