import React from 'react'
import { useEffect, useRef, useState } from "react";
import './NewPrompt.css'
import Markdown from "react-markdown";
import Upload from '../uploads/upload';
import { IKImage } from 'imagekitio-react';
import model from '../../lib/gemini';
import { useMutation, useQueryClient } from "@tanstack/react-query";

function NewPrompt({data}) {

    const endRef = useRef(null);
  const formRef = useRef(null);
    const [question, setquestion] = useState("")
    const [answer, setAnswer] = useState("");

    const [img, setImg] = useState({
        isLoading: false,
        error: "",
        dbData: {},
        aiData: {}
    })


    // Ai model 
    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: "Hello" }],
            },
            {
                role: "model",
                parts: [{ text: "Great to meet you. What would you like to know?" }],
            },
        ],
        generationConfig: {
            // maxOutputTokens:100,
        }
    });


    useEffect(() => {
        endRef.current.scrollIntoView({ behavior: "smooth" })
    }, [data,question, answer, img.data])

     const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.length ? question : undefined,
          answer,
          img: img.dbData?.filePath || undefined,
        }),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ["chat", data._id] })
        .then(() => {
          formRef.current.reset();
          setquestion("");
          setAnswer("");
          setImg({
            isLoading: false,
            error: "",
            dbData: {},
            aiData: {},
          });
        });
    },
    onError: (err) => {
      console.log(err);
    },
  });

    // Testing model Promt

    const add = async (text, isInitial) => {
        
         if (!isInitial) setquestion(text);

        try {
            const result = await chat.sendMessageStream(Object.entries(img.aiData).length ? [img.aiData, text] : [text]);
        let accumulatedText = "";
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                console.log(chunkText);
                accumulatedText += chunkText;
                setAnswer(accumulatedText);

            }
              mutation.mutate();

            
        } catch (error) {
             console.log(err);
        }
        }

    
    const handlesubmit = (e) => {
        e.preventDefault();

        const text = e.target.text.value
        if (!text) return;

        add(text, false)
    }

     // IN PRODUCTION WE DON'T NEED IT
    const hasRun = useRef(false);
    
  useEffect(() => {
    if (!hasRun.current) {
      if (data?.history?.length === 1) {
        add(data.history[0].parts[0].text, true);
      }
    }
    hasRun.current = true;
  }, []);

    return (
        <>
            {
                img.isLoading && <div>
                    Looding...
                </div>
            }

            {/* Fetch the Image and show on Screen */}
            {

                img.dbData?.filePath && (
                    <IKImage
                        urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT_KEY}
                        path={img.dbData?.filePath}
                        width="380"
                        transformation={[{ width: 380 }]}
                    />
                )
            }

            {question && <div className='message user'>{question}</div>}

            {answer &&
                (

                    <div className='message'>
                        <Markdown>
                            {answer}
                        </Markdown>
                    </div>
                )}

            {/* <button onClick={() => add()}>Tesr Ao</button> */}
            <div className='endChat' ref={endRef}></div>
            <form className="newForm" onSubmit={handlesubmit}  ref={formRef}>

                {/* Uplaod Component here */}
                <Upload setImg={setImg} />

                <input id="file" type="file" multiple={false} hidden />
                <input type="text" name="text" placeholder="Ask anything..." />


                <button>
                    <img src="/arrow.png" alt="" />
                </button>
            </form>
        </>
    )
}

export default NewPrompt