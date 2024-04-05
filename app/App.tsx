"use client";

import LeftSidebar from "@/components/LeftSidebar";
import Live from "@/components/Live";
import RightSidebar from "@/components/RightSidebar";
import Navbar from "@/components/navbar/Navbar";
// import { Room } from "./Room";
// import { CollaborativeApp } from "./CollaborativeApp";

export default function Page() {
  return (
    <main className="h-screen overflow-hidden">
      
      <Navbar />

      <section className="flex h-full flex-row">
        
        <LeftSidebar />
        
        <Live />
        
        <RightSidebar />
      </section>
    </main>

  );
}