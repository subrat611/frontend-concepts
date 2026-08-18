# Core Concepts

1. Prompt Engineering
2. HTTP Streaming (Next.js)
3. SSE/WebSockets/HTTP Streaming + How to identify when to use what

## Vercel AI SDK wtf is this?

"a powerful typescript library designed to develop ai applications."

## wtf is HTTP Streaming

Understand the issue:
Issue: Traditional UI, where user ask something, wait for the response till the time see a loader.

_But in AI LLM generate long outputs where user have to wait for few or more seconds even minutes (shit latency & infra). Instead of showing all the response at once the application try to load chunk by chunk response while showing a loader (to show there is more response)._

See this mind blowing video (Blocking UI vs Streaming UI): https://www.youtube.com/watch?v=Z-fRKzLtWU0&t=128s

Why Streaming UI:
Ans is simple for great user experience. human don't want to wait brother.

want some basic example:
Printing something in for loop

```js
const str = "Hello Vercel Jii Kese he aap.";
const arr = str.split(" ");
arr.forEach((character) => {
  console.log(character);
});
```

Vercel SDK example:

```js
import { streamText } from "ai";

const { textStream } = streamText({
  model: "xai/grok-4.6",
  prompt: "Write a poem about embedding models.",
});

for await (const textPart of textStream) {
  console.log(textPart);
}
```

AI SDK gives you the abstractions for things like:

1. Streaming responses
2. Chat state
3. Tool calling
4. Structured output
5. AI model providers

## Some other concepts SSE/WebSocket/Polling

Streaming describes **how data is delivered over time**.  
SSE/WebSocket describe **the communication mechanism/protocol**.

```md
                    DATA DELIVERY
                         │
              ┌──────────┴──────────┐
              │                     │
         One response          Streaming response
              │                     │
        wait → complete       chunk → chunk → chunk
                                    │
                         ┌──────────┼──────────┐
                         │          │          │
                       HTTP        SSE      WebSocket
                     streaming
```

But ChatGPT does **not necessarily need WebSocket** to do that (streaming chunk by chunk):

```
Browser
   │
   │ HTTP request
   ↓
ChatGPT server
   │
   │ calls model
   ↓
LLM
   │
   │ token/chunk
   ↓
ChatGPT server
   │
   │ HTTP stream
   ↓
Browser
```

```
HTTP request
      ↓
HTTP response starts
      ↓
chunk
      ↓
chunk
      ↓
chunk
      ↓
chunk
      ↓
response ends
```

This is what the Vercel AI SDK means.

### HTTP normal response

```
Client ─────────────→ Server

Client ←───────────── Server
          response
             END
```

### HTTP streaming

```
Client ─────────────→ Server

Client ←──── chunk 1
Client ←──── chunk 2
Client ←──── chunk 3
Client ←──── chunk 4

             END
```

### SSE

```
Client ─────────────→ Server

Client ←──── event 1
Client ←──── event 2
Client ←──── event 3
Client ←──── event 4
...
```

### WebSocket

```
Client ←────────────→ Server

Client → message
Server → message
Server → message
Client → message
Server → message
...
```

uffff... lot of things ok now the main question "how to identify when to use what?"

1. Does the client need updates? -> No -> Normal HTTP req/res
2. Updates needed, but real-time is NOT critical? -> Polling (short vs long)
   1. Use when slight delay is acceptable.
   2. Examples: job status, payment status, background processing.
3. Updates are real-time, but mostly **Server → Client**? -> SSE
   1. Use when client mainly **listens**.
   2. Examples: live score, notifications, live progress, AI token streaming.
4. Real-time communication is **both directions**? -> WebSocket
   1. Use when both sides continuously need to communicate.
   2. Examples: chat, multiplayer games, collaborative editing, live trading.
5. Need progressive response but it's still fundamentally one request? -> HTTP Streaming
   1. `Request -> Chunk Chunk Chunk .. -> Done`
   2. Example: AI response generation.

```
                    Communication need
                           │
              ┌────────────┴────────────┐
              │                         │
         No continuous              Continuous
           updates                    updates
              │                         │
         Normal HTTP             ┌──────┴──────┐
                                 │             │
                           Server → Client   Both ways
                                 │             │
                                SSE        WebSocket
```

I will going to do a demo using [groq](https://groq.com/).
