"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Save } from "lucide-react";
import Textarea from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AlNasHospital() {
  const [currentPopup, setCurrentPopup] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [notes, setNotes] = useState<
    { id: number; text: string; timestamp: number }[]
  >([]);
  const [currentNote, setCurrentNote] = useState("");
  const noteInputRef = useRef<HTMLTextAreaElement>(null);

  const popupMessages = [
    "Hi how are you?",
    "I'm the AI of Al Nas Hospital",
    "Ask me anything about the hospital and I will tell you",
  ];

  // Load notes from localStorage and clean up old entries
  useEffect(() => {
    const storedNotes = localStorage.getItem("userNotes");
    if (storedNotes) {
      const parsedNotes = JSON.parse(storedNotes);
      const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000; // 2 weeks in milliseconds
      const filteredNotes = parsedNotes.filter(
        (item: { timestamp: number }) => item.timestamp > twoWeeksAgo
      );
      setNotes(filteredNotes);
    }
  }, []);

  // Save notes to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("userNotes", JSON.stringify(notes));
  }, [notes]);

  // Popup sequence logic and repetition
  useEffect(() => {
    const startPopupSequence = () => {
      setShowPopup(true);
      setCurrentPopup(0);
    };

    // Initial popup after 2 seconds
    const initialTimer = setTimeout(startPopupSequence, 2000);

    // Repeat popup sequence every 50 seconds
    const repeatInterval = setInterval(startPopupSequence, 50 * 1000); // 50 seconds

    return () => {
      clearTimeout(initialTimer);
      clearInterval(repeatInterval);
    };
  }, []);

  useEffect(() => {
    if (showPopup && currentPopup < popupMessages.length) {
      const timer = setTimeout(() => {
        if (currentPopup < popupMessages.length - 1) {
          setShowPopup(false);
          setTimeout(() => {
            setCurrentPopup(currentPopup + 1);
            setShowPopup(true);
          }, 500);
        } else {
          setShowPopup(false);
        }
      }, 5000); // Increased to 5 seconds to make messages more readable

      return () => clearTimeout(timer);
    }
  }, [currentPopup, showPopup, popupMessages.length]);

  const addNote = () => {
    if (currentNote.trim()) {
      const newNote = {
        id: Date.now(),
        text: currentNote.trim(),
        timestamp: Date.now(),
      };
      setNotes((prevNotes) => [...prevNotes, newNote]);
      setCurrentNote("");
      if (noteInputRef.current) {
        noteInputRef.current.focus();
      }
    }
  };

  const deleteNote = (id: number) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Green Line */}
      <div className="h-1 bg-[#e0ffe0] w-full"></div>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img
                  src="/alnas-logo.png"
                  alt="Al Nas Hospital Logo"
                  className="h-14 w-auto"
                />
              </div>
            </div>

            <Button
              onClick={() =>
                window.open("https://alnas-hospital.com/", "_blank")
              }
              className="bg-gradient-to-r from-[#00c6ff] to-[#0072ff] hover:from-[#00b0e6] hover:to-[#0060d1] text-white shadow-md rounded-full px-6 py-3"
            >
              Hospital Website
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
      {/* Bottom Cyan Line */}
      <div className="h-2 bg-[#00bcd4] w-full"></div>
      {/* Main Content */}
      <div className="flex-1">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar - AI Assistant & Notes */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <Card className="border-2 border-cyan-200 bg-white shadow-sm">
                <CardContent className="p-4 text-center">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center relative">
                      <img
                        src="/doctor.png"
                        alt="AI Doctor Assistant"
                        className="w-20 h-20 rounded-full"
                      />
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                      </div>

                      {/* Chat bubble popup coming directly from doctor */}
                      {showPopup && currentPopup < popupMessages.length && (
                        <div className="absolute top-1/2 left-full transform -translate-y-1/2 ml-2 z-20">
                          <div className="bg-blue-500 text-white text-sm px-4 py-3 rounded-lg shadow-lg animate-fade-in-fixed w-[225px] text-left">
                            {popupMessages[currentPopup]}
                            {/* Chat bubble tail pointing to doctor */}
                            <div className="absolute top-1/2 right-full transform -translate-y-1/2">
                              <div className="w-0 h-0 border-t-4 border-b-4 border-r-6 border-transparent border-r-blue-500"></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    AI Information Assistant
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Hospital Services & Information
                  </p>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    Available 24/7
                  </Badge>
                </CardContent>
              </Card>

              {/* Notes Widget */}
              <Card className="border border-gray-200 shadow-sm flex-1 flex flex-col">
                <CardContent className="p-4 flex-1 flex flex-col">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Your Notes
                  </h4>
                  <Alert className="mb-4 bg-yellow-50 border-yellow-200 text-yellow-800">
                    <AlertTitle>Important!</AlertTitle>
                    <AlertDescription>
                      Notes are automatically deleted after 2 weeks.
                    </AlertDescription>
                  </Alert>
                  <div className="flex-1 overflow-y-auto space-y-2 mb-4 max-h-60">
                    {notes.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No notes yet. Type something below!
                      </p>
                    ) : (
                      notes.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start justify-between bg-gray-50 p-2 rounded-md border border-gray-200"
                        >
                          <p className="text-sm text-gray-700 flex-1 pr-2 whitespace-normal break-all">
                            {item.text}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNote(item.id)}
                            className="text-red-500 hover:text-red-700 shrink-0"
                          >
                            &times;
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mt-auto">
                    <Textarea
                      ref={noteInputRef}
                      placeholder="Write your note here..."
                      value={currentNote}
                      onChange={(e) => setCurrentNote(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          addNote();
                        }
                      }}
                      className="flex-1 min-h-[40px] max-h-[100px] resize-y"
                    />
                    <Button onClick={addNote} size="icon" className="shrink-0">
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {/* Welcome Section */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <img
                    src="/doctor.png"
                    alt="Doctor"
                    className="w-16 h-16 rounded-full"
                  />
                  <div className="absolute ml-12 mt-12">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"></div>
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Welcome to Al Nas Hospital Information Center
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed text-lg">
                  I'm your AI information assistant, here to provide details
                  about Al Nas Hospital services, facilities, departments,
                  staff, and general hospital information. Ask me about our
                  medical services, appointment procedures, or hospital
                  facilities.
                </p>
              </div>

              {/* Direct Chat Interface */}
              <div className="h-[500px] border border-gray-200 shadow-sm rounded-lg">
                <iframe
                  src="https://copilotstudio.microsoft.com/environments/Default-c583d714-2e15-4040-a7f0-084dcdee4dca/bots/cr0bf_alNasHospitalDoctorsChatbot/webchat?__version__=2"
                  className="w-full h-full border-0 rounded-lg"
                  title="Al Nas Hospital AI Chatbot"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-600">
            © 2025 Al Nas Hospital - Hospital Information System | All Rights
            Reserved
          </div>
        </div>
      </footer>
      <style jsx>{`
        @keyframes fade-in-fixed {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in-fixed {
          animation: fade-in-fixed 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
