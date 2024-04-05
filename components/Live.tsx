"use client";

// gives data of active user on the room
import { useBroadcastEvent, useEventListener, useMyPresence, useOthers } from '@/liveblocks.config';
import React, { useCallback, useEffect, useState } from 'react'
import LiveCursors from './cursor/LiveCursors';
import { CursorMode, CursorState, Reaction, ReactionEvent } from '@/types/type';
import Cursor from './cursor/Cursor';
import CursorChat from './cursor/CursorChat';
import ReactionSelector from './reaction/ReactionButton';
import FlyingReaction from './reaction/FlyingReaction';
import useInterval from '@/hooks/useInterval';

const Live = () => {
    const others = useOthers();
    const broadcast = useBroadcastEvent();

    const [{cursor}, updateMyPresence] = useMyPresence() as any;

    const [cursorState, setCursorState] = useState<CursorState>({
      mode: CursorMode.Hidden,
    })
    
    const [reactions, setReactions] = useState<Reaction[]>([]);
     
    // Remove reactions that are not visible anymore (every 1 sec)
  useInterval(() => {
    setReactions((reactions) => reactions.filter((reaction) => reaction.timestamp > Date.now() - 4000));
  }, 1000);

  // Broadcast the reaction to other users (every 100ms)
  useInterval(() => {
    if (cursorState.mode === CursorMode.Reaction && cursorState.isPressed && cursor) {
      // concat all the reactions created on mouse click
      setReactions((reactions) =>
        reactions.concat([
          {
            point: { x: cursor.x, y: cursor.y },
            value: cursorState.reaction,
            timestamp: Date.now(),
          },
        ])
      );

      // Broadcast the reaction to other users
      broadcast({
        x: cursor.x,
        y: cursor.y,
        value: cursorState.reaction,
      });
    }
  }, 100);


    useEventListener((eventData) => {
      const event = eventData.event as ReactionEvent;
      setReactions((reactions) =>
        reactions.concat([
          {
            point: { x: event.x, y: event.y },
            value: event.value,
            timestamp: Date.now(),
          },
        ])
      );
    });
  
    // set the reaction of the cursor
      const setReaction = useCallback((reaction: string) => {
        setCursorState({ mode: CursorMode.Reaction, reaction, isPressed: false });
      }, []);

    const handlePointerMove = useCallback( (event: React.PointerEvent) => {
        event.preventDefault();

        if(cursor == null || cursorState.mode !== CursorMode.ReactionSelector){

          const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
          const y = event.clientY - event.currentTarget.getBoundingClientRect().y;
  
          updateMyPresence( { cursor: {x,y} } );
        }
    }, []);

    const handlePointerLeave = useCallback( (event: React.PointerEvent) => {
        
        setCursorState({ mode: CursorMode.Hidden });
        updateMyPresence( { cursor: null, message: null } );

    }, []);

    // Show the cursor when the mouse enters the canvas
  const handlePointerDown = useCallback(
    (event: React.PointerEvent) => {
      // get the cursor position in the canvas
      const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
      const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

      updateMyPresence({
        cursor: {
          x,
          y,
        },
      });

      // if cursor is in reaction mode, set isPressed to true
      setCursorState((state: CursorState) =>
        cursorState.mode === CursorMode.Reaction ? { ...state, isPressed: true } : state
      );
    },
    [cursorState.mode, setCursorState]
  );

  // hide the cursor when the mouse is up
  const handlePointerUp = useCallback(() => {
    setCursorState((state: CursorState) =>
      cursorState.mode === CursorMode.Reaction ? { ...state, isPressed: false } : state
    );
  }, [cursorState.mode, setCursorState]);

    // Listen to keyboard events to change the cursor state
    useEffect(() => {
      const onKeyUp = (e: KeyboardEvent) => {
        if (e.key === "/") {
          setCursorState({
            mode: CursorMode.Chat,
            previousMessage: null,
            message: "",
          });
        } else if (e.key === "Escape") {
          updateMyPresence({ message: "" });
          setCursorState({ mode: CursorMode.Hidden });
        } else if (e.key === "e") {
          setCursorState({ mode: CursorMode.ReactionSelector });
        }
      };

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "/") {
          e.preventDefault();
        }
      };

      window.addEventListener("keyup", onKeyUp);
      window.addEventListener("keydown", onKeyDown);

      return () => {
        window.removeEventListener("keyup", onKeyUp);
        window.removeEventListener("keydown", onKeyDown);
      };
    }, [updateMyPresence]);


  return (
    <div 
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className='h-[100vh] w-full flex justify-center items-center text-center border-2 border-green-500'
    >
        <h1 className="text-2xl text-white">Liveblocks Figma Clone</h1>
        
        {/* Render the reactions */}
        {reactions.map((reaction) => (
          <FlyingReaction
            key={reaction.timestamp.toString()}
            x={reaction.point.x}
            y={reaction.point.y}
            timestamp={reaction.timestamp}
            value={reaction.value}
          />
        ))}

        {cursor && (
            <CursorChat  
                cursor = {cursor}
                cursorState = {cursorState}
                setCursorState = {setCursorState}
                updateMyPresence = {updateMyPresence}
            />
        )}

          {
            cursorState.mode === CursorMode.ReactionSelector && (
              <ReactionSelector 
                setReaction={(reaction) => {
                  setReaction(reaction);
                }}
              />
            )
          }

        <LiveCursors others={others} />
    </div>
  )
}

export default Live