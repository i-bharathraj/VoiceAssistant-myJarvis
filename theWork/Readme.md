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

- Appends user request to all_messages.
- Sends messages to the Llama3 model.
- Collects and processes the response, splitting it into smaller chunks for better readability.
- Signals completion using llama_finished.

`record_to_file(text)`

This function converts text to speech and plays it.

- Uses gTTS to convert text to an MP3 file.
- Plays the MP3 file using the pygame mixer.

`text_to_sound(text_queue, text_done, llama_finished, audio_queue, stop_event)`

This function handles the text-to-speech conversion and adds the audio to a queue for playback.

- Converts text from text_queue to speech.
- Adds the resulting MP3 file to audio_queue.
- Signals completion using text_done.

`play_audio_from_queue(audio_queue, text_done, stop_event)`

This function plays audio from the audio_queue.

- Plays MP3 files from audio_queue using the pygame mixer.
- Signals completion when all audio has been played.

`log_activity(text)`

This function logs conversations to a file.

- Appends the given text to a log file named recordedlog-<today's date>.txt.

## Main Function

The `start()` function contains the main workflow of the voice assistant.

- Initializes the speech recognizer and microphone.
- Continuously listens for user input.
- Activates upon hearing a wake word ("vocal signal" in this script).
- Processes user requests and generates responses.
- Handles conversation termination ("that's all").
- Manages threading for Llama3 interaction, text-to-speech conversion, and audio playback.

```python

def start():
    global today_date, used_language, num_user_requests, num_tts_conversions, num_audio_playbacks, all_messages
    
    recognizer = sr.Recognizer()
    microphone = sr.Microphone()
    recognizer.dynamic_energy_threshold = False
    recognizer.energy_threshold = 400    
    is_sleeping = True 
    
    while True:     
        with microphone as source:            
            recognizer.adjust_for_ambient_noise(source, duration=1)
            print("Listening ...")
            
            try: 
                audio_input = recognizer.listen(source, timeout=20, phrase_time_limit=30)
                input_text = recognizer.recognize_google(audio_input, language=used_language)
 
                if is_sleeping:
                    if "vocal signal" in input_text.lower():
                        request_text = input_text.lower().split("vocal signal")[1]
                        is_sleeping = False
                        log_activity(f"_"*40)                    
                        today_date = str(date.today())  
                        all_messages = []                      
                        if len(request_text) < 2:
                            record_to_file("Hey, there, what can I assist you with?")
                            log_activity(f"AI: Hey, there, what can I assist you with? \n")
                            continue                      
                    else:
                        continue
                else: 
                    request_text = input_text.lower()
                    if "that's all" in request_text:
                        log_activity(f"You: {request_text}\n")
                        record_to_file("Bye now")
                        log_activity(f"AI: Bye now. \n")                        
                        print('Bye now')
                        is_sleeping = True
                        continue
                    
                    if "vocal signal" in request_text:
                        request_text = request_text.split("vocal signal")[1]                        

                log_activity(f"You: {request_text}\n ")
                print(f"You: {request_text}\n AI: ", end='')

                text_queue = queue.Queue()
                audio_queue = queue.Queue()
                
                llama_finished = threading.Event()                
                text_done = threading.Event() 
                stop_event = threading.Event()                
     
                llama_thread = threading.Thread(target=chat_with_llama, args=(request_text, text_queue, llama_finished,))
                tts_thread = threading.Thread(target=text_to_sound, args=(text_queue, text_done, llama_finished, audio_queue, stop_event,))
                play_thread = threading.Thread(target=play_audio_from_queue, args=(audio_queue, text_done, stop_event,))
 
                llama_thread.start()
                tts_thread.start()
                play_thread.start()

                llama_finished.wait()

                llama_thread.join()  
                time.sleep(0.5)
                audio_queue.join()
              
                stop_event.set()  
                tts_thread.join()
                play_thread.join()  

                num_user_requests = 0 
                num_tts_conversions = 0 
                num_audio_playbacks = 0
 
                print('\n')
 
            except Exception as e:
                continue 
 
if __name__ == "__main__":
    start()

```
## Summary

This script sets up a voice assistant that listens for a wake word, processes user requests using the Llama3 model, converts responses to speech, and plays the audio. It employs threading for concurrent execution of tasks, ensuring efficient handling of speech recognition, text processing, and audio playback.


