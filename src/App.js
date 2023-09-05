import React, { useState, useEffect } from "react";
import RecordRTC from "recordrtc";

function AudioRecorder() {
  const [stream, setStream] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioFiles, setAudioFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    // Check if the user has granted microphone permission
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        setStream(stream);
        setRecorder(RecordRTC(stream, { type: "audio" }));
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      }, []);

    return () => {
      // Release the microphone when the component unmounts
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = () => {
    if (recorder) {
      recorder.startRecording();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recorder) {
      recorder.stopRecording(() => {
        const blob = recorder.getBlob();
        const audioURL = URL.createObjectURL(blob);
        const newAudioFile = { audioURL, name: "sample" };
        setAudioFiles([...audioFiles, newAudioFile]);
        setIsRecording(false);
      });
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    debugger;
  };

  const uploadAudio = () => {
    if (selectedFile) {
      const audioURL = URL.createObjectURL(selectedFile);
      const newAudioFile = { audioURL, name: selectedFile.name };
      setAudioFiles([...audioFiles, newAudioFile]);
      setSelectedFile(null);
    }
  };

  const playAudio = (audioURL) => {
    const audioElement = new Audio(audioURL);
    audioElement.play();
  };

  const downloadAudio = (audioURL, audioName) => {
    const a = document.createElement("a");
    a.href = audioURL;
    a.download = audioName;
    a.click();
  };

  return (
    <div>
      <h2>Audio Recorder and Uploader</h2>
      {isRecording ? (
        <>
          <button onClick={stopRecording}>Stop Recording</button>
        </>
      ) : (
        <>
          <button onClick={startRecording}>Start Recording</button>
          {!stream && <span>*Allow microphone access</span>}
          <br />
          <br />

          <input
            type="file"
            accept="audio/*"
            onChange={handleFileInputChange}
          />
          <button onClick={uploadAudio} disabled={!selectedFile}>
            Upload Audio
          </button>
        </>
      )}
      <table>
        <thead>
          <tr>
            <th>Serial Number</th>
            <th>Audio Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {audioFiles.map((file, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <input
                  type="text"
                  value={file.name}
                  onChange={(e) => {
                    const updatedAudioFiles = [...audioFiles];
                    updatedAudioFiles[index].name = e.target.value;
                    setAudioFiles(updatedAudioFiles);
                  }}
                />
              </td>
              <td>
                <button onClick={() => playAudio(file.audioURL)}>Play</button>
                <button onClick={() => downloadAudio(file.audioURL, file.name)}>
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AudioRecorder;
