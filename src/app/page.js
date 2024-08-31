"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { BsSoundwave } from "react-icons/bs";
import { FaPause, FaPlay, FaStop } from "react-icons/fa6";
import { FaMicrophoneAlt } from "react-icons/fa";

const HomePage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone: ", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const pauseRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "paused"
    ) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const handleRecordingControl = () => {
    if (isRecording) {
      if (isPaused) {
        resumeRecording();
      } else {
        pauseRecording();
      }
    } else {
      startRecording();
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <section className="px-5 h-[100vh]">
      <div className="p-2 flex justify-center py-8">
        <h1 className="px-6 py-3 bg-black text-white rounded-[3rem] font-bold flex items-center">
          <span>
            <BsSoundwave />
          </span>
          WebPodcaast
          <span>
            <BsSoundwave />
          </span>
        </h1>
      </div>

      <div className="h-[70%] flex justify-center flex-col items-center w-full ">
        <div className="md:w-[20%] w-full">
          <Image
            src="/soundwave.gif"
            width={100}
            height={100}
            alt="soundwave"
            className="w-full object-cover"
          />
        </div>

        <div className="my-5 w-[20%]">
          {audioUrl && (
            <div className="text-center">
              <h3 className="py-2">Your Audio</h3>
              <audio
                ref={audioRef}
                controls
                src={audioUrl}
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center text-[2rem] items-center">
        <button
          className="p-2 bg-black text-white rounded-md mx-2"
          onClick={handleRecordingControl}
        >
          {isRecording ? (
            isPaused ? (
              <FaPlay />
            ) : (
              <FaPause />
            )
          ) : (
            <FaMicrophoneAlt />
          )}
        </button>
        <button
          onClick={stopRecording}
          className="p-2 bg-black text-white rounded-md mx-2"
        >
          <FaStop />
        </button>
      </div>
    </section>
  );
};

export default HomePage;
