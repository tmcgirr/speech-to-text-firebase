import React, { useState, useEffect } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";

import "./css/styles.css";

function SpeechToText({ isAuth }) {
  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");

  const postsCollectionRef = collection(db, "posts");
  let navigate = useNavigate();

  const createPost = async () => {
    await addDoc(postsCollectionRef, {
      title,
      postText,
      author: { name: auth.currentUser.displayName, id: auth.currentUser.uid },
    });
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Speech Function
  const [isRecording, setIsRecording] = useState(false);
  const [message, setMessage] = useState();

  // set initial state of application variables
  let socket;
  let recorder;

  // runs real-time transcription and handles global variables
  const run = async () => {
    if (isRecording) {
      if (socket) {
        socket.send(JSON.stringify({ terminate_session: true }));
        socket.close();
        socket = null;
        console.log("Socket");
      }

      if (recorder) {
        recorder.pauseRecording();
        recorder = null;
        console.log("Recorder");
      }
    } else {
      const response = await fetch(process.env.PORT || "http://localhost:8000"); // get temp session token from server.js (backend)
      const data = await response.json();

      if (data.error) {
        alert(data.error);
      }

      const { token } = data;

      // establish wss with AssemblyAI (AAI) at 16000 sample rate
      socket = await new WebSocket(
        `wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`
      );

      // handle incoming messages to display transcription to the DOM
      const texts = {};
      socket.onmessage = (message) => {
        let msg = "";

        const res = JSON.parse(message.data);
        texts[res.audio_start] = res.text;
        const keys = Object.keys(texts);
        keys.sort((a, b) => a - b);
        for (const key of keys) {
          if (texts[key]) {
            msg += ` ${texts[key]}`;
          }
        }
        setMessage(msg);
        setPostText(msg);
      };

      socket.onerror = (event) => {
        console.error(event);
        socket.close();
      };

      socket.onclose = (event) => {
        console.log(event);
        socket = null;
      };

      socket.onopen = () => {
        // once socket is open, begin recording
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((stream) => {
            /*global RecordRTC*/
            recorder = new RecordRTC(stream, {
              type: "audio",
              mimeType: "audio/webm;codecs=pcm", // endpoint requires 16bit PCM audio
              /*global StereoAudioRecorder*/
              recorderType: StereoAudioRecorder,
              timeSlice: 250, // set 250 ms intervals of data that sends to AAI
              desiredSampRate: 16000,
              numberOfAudioChannels: 1, // real-time requires only one channel
              bufferSize: 4096,
              audioBitsPerSecond: 128000,
              ondataavailable: (blob) => {
                const reader = new FileReader();
                reader.onload = () => {
                  const base64data = reader.result;

                  // audio data must be sent as a base64 encoded string
                  if (socket) {
                    socket.send(
                      JSON.stringify({
                        audio_data: base64data.split("base64,")[1],
                      })
                    );
                  }
                };
                reader.readAsDataURL(blob);
              },
            });

            recorder.startRecording();
            setIsRecording(true);
          })
          .catch((err) => console.error(err));
      };
    }
  };

  function cancelPost() {
    navigate("/CreatePost");
    window.location.reload();
  }

  return (
    <div className="createPostPage">
      <div className="titleSection">
        <h3>Save Session As:</h3>
        <input
          placeholder="Your title here..."
          onChange={(event) => {
            setTitle(event.target.value);
          }}
          className="inputTitle"
        />
      </div>
      <div className="messageSection">
        <h3 style={{ display: !isRecording ? "none" : "block" }}>
          Speech-To-Text Below:
        </h3>
        <p
          style={{ display: !isRecording ? "none" : "block" }}
          className="displayMessage"
        >
          {message}
        </p>
        <div className="buttonDiv">
          <button
            id="start"
            onClick={run}
            style={{ display: isRecording ? "none" : "block" }}
            className="start_button"
          >
            Start Recording
          </button>

          <button
            id="stop"
            style={{ display: !isRecording ? "none" : "block" }}
            onClick={createPost}
            className="submit_button"
          >
            Submit Recording
          </button>
          <button
            id="cancel"
            style={{ display: !isRecording ? "none" : "block" }}
            onClick={cancelPost}
            className="cancel_button"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default SpeechToText;
