"use client";

import { useEffect, useState } from "react";
import { getAllAudioFiles } from "./indexdb";

export default function AudioList({ updated }) {
  const [audioFiles, setAudioFiles] = useState([]);

  useEffect(() => {
    const fetchAudioFiles = async () => {
      try {
        const files = await getAllAudioFiles();
        setAudioFiles(files);
      } catch (error) {
        console.error("Error fetching audio files:", error);
      }
    };

    fetchAudioFiles();
  }, [updated]);

  return (
    <div>
      <h2>Saved Audio Files</h2>
      {audioFiles.length > 0 ? (
        audioFiles.map((file, index) => (
          <div key={index}>
            <audio controls src={URL.createObjectURL(file.audioBlob)} />
          </div>
        ))
      ) : (
        <p>No audio files found</p>
      )}
    </div>
  );
}
