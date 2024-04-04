// returns data of current user in the room
import { LiveCursorProps } from '@/types/type';

import React from 'react'
import Cursor from './Cursor';
import { COLORS } from '@/constants';

// display all other live cursors
const LiveCursors = ({others} : LiveCursorProps) => {
 return others.map(({connectionId,presence}) => {
    if(!presence?.cursor) return null;

    return(
        <Cursor
            key = {connectionId}
            color = {COLORS[ Number(connectionId) % COLORS.length]}
            x = {presence.cursor.x}
            y = {presence.cursor.y}
            message = {presence.message}
        />
    )
  })
}

export default LiveCursors