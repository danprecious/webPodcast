"use client";

// import {openDB} from 'idb'

import Image from "next/image";
import { useState, useRef } from "react";
import { BsSoundwave } from "react-icons/bs";
import { FaPause, FaPlay, FaStop } from "react-icons/fa6";
import { FaMicrophoneAlt } from "react-icons/fa";
import { openDatabase, saveAudioToDb } from "./indexdb";
import AudioList from "./audioList";

const HomePage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  openDatabase();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        setIsUpdated(!isUpdated)
        await saveAudioToDb(audioBlob);
        console.log("Audio saved to IndexedDB");
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
    console.log("Stop recording");
    setIsPaused(false);
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
    // if(!isRecording){

    // }
    if (isRecording) {
      if (isPaused) {
        resumeRecording();
        console.log("resume recording while already recording");
      } else {
        pauseRecording();
        console.log("pause recording while already recording");
      }
    } else {
      startRecording();
      console.log("start new recording");
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

  const loadAudio = async () => {
    const audioData = await getAudioFromDb(1); // Example ID
    if (audioData) {
      const audioBlob = audioData.audioBlob;
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      console.log("Audio loaded from IndexedDB");
    }
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

      <div className="h-[70%]   w-full justify-center items-center flex-col flex">
        <div className="md:w-[20%] w-full flex justify-center ">
          <button className="" onClick={handleRecordingControl}>
            {isRecording ? (
              isPaused ? (
                <FaPlay className="text-[10rem] cursor-pointer" />
              ) : (
                <Image
                  src="/soundwave.jpeg"
                  width={100}
                  height={100}
                  alt="soundwave"
                  className="w-full object-cover"
                />
              )
            ) : (
              <div className="flex justify-center">
                <FaMicrophoneAlt className="text-[10rem] cursor-pointer" />
              </div>
            )}
          </button>
        </div>

        <div className="my-5 w-[50%] md:w-[20%]">
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
          onClick={stopRecording}
          className="p-2 bg-black text-white rounded-md mx-2"
        >
          <FaStop />
        </button>
      </div>


      <div className="">
        <AudioList Updated= {isUpdated} />
      </div>
    </section>
  );
};

export default HomePage;
