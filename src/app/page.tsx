"use client";

import { Header } from "@/components/layout/Header";
import { TaskInput } from "@/components/todo/TaskInput";
import { TaskList } from "@/components/todo/TaskList";
import { PowerSlider } from "@/components/todo/PowerSlider";
import { ActionBar } from "@/components/todo/ActionBar";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto px-4 py-8 w-full">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-2">
            ⚡ Flash ToDo
          </h1>
          <p className="text-[var(--foreground-secondary)] text-lg">
            Quebre tarefas grandes em passos simples com IA
          </p>
        </div>

        {/* Main Input */}
        <div className="mb-6">
          <TaskInput />
        </div>

        {/* Power Slider */}
        <div className="flex justify-center mb-6">
          <PowerSlider />
        </div>

        {/* Task List */}
        <div className="bg-[var(--background)] rounded-[var(--radius-lg)] border border-[var(--border)] p-4">
          <TaskList />
          <ActionBar />
        </div>
      </main>

      <Footer />
    </div>
  );
}
