"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { BsSoundwave } from "react-icons/bs";
import { FaStop } from "react-icons/fa6";
import { FaMicrophoneAlt } from "react-icons/fa";

const HomePage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

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

      <div className="h-[70%] flex justify-center flex-col border items-center w-full ">
        <div className="md:w-[50%] w-full border">
          <Image
            src="/soundwave.gif"
            width={100}
            height={100}
            alt="soundwave"
            className="w-full object-cover"
          />
        </div>

        <div className="my-10">
          {audioUrl && (
            <div className="text-center">
              <h3 className="py-2">Your Audio</h3>
              <audio controls src={audioUrl} />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center text-[2rem]">
        <button
          className="p-2 bg-black text-white rounded-md"
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? (
            <span className="">
              <FaStop />
            </span>
          ) : (
            <span>
              <FaMicrophoneAlt />
            </span>
          )}
        </button>
      </div>
    </section>
  );
};

export default HomePage;
