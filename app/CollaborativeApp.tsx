"use client";

import { useOthers } from "../liveblocks.config";

export function CollaborativeApp() {
    // Get information about other users
    const others = useOthers();
    // Calculate the number of other users online
    const userCount = others.length;

    // Render the user count
    return <div>There are {userCount} other user(s) online</div>;
}
