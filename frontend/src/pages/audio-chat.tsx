import { useState, useRef } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Settings,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  isAudio?: boolean;
}

export function AudioChat() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [voiceType, setVoiceType] = useState("sarah");
  const [language, setLanguage] = useState("en");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Mock mutations since API is commented out
  const sendMessageMutation = {
    mutate: (message: string) => {
      setTimeout(() => {
        const aiMessage: Message = {
          id: Date.now().toString(),
          type: "ai",
          content: `AI response to: "${message}"`,
          timestamp: new Date(),
          isAudio: true,
        };
        setMessages((prev) => [...prev, aiMessage]);
        toast.success("Message processed");
      }, 1000);
    },
    isPending: false,
  };

  const sendAudioMutation = {
    mutate: () => {
      setTimeout(() => {
        const userMessage: Message = {
          id: Date.now().toString(),
          type: "user",
          content: "Hello, how are you today?",
          timestamp: new Date(),
          isAudio: true,
        };
        setMessages((prev) => [...prev, userMessage]);

        // Send transcription to get AI response
        sendMessageMutation.mutate(userMessage.content);
      }, 1500);
    },
    isPending: false,
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        sendAudioMutation.mutate();
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success("Recording started");
    } catch (error) {
      toast.error("Could not access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);
      toast.info("Recording stopped");
    }
  };

  const playAIResponse = () => {
    setIsPlaying(true);
    // Simulate audio playback
    setTimeout(() => {
      setIsPlaying(false);
      toast.success("Audio played");
    }, 3000);
  };

  const clearChat = () => {
    setMessages([]);
    toast.info("Chat cleared");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />

        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">AI Voice Chat</h1>
              <p className="text-muted-foreground">
                Have natural conversations with AI using voice. Speak naturally
                and get intelligent audio responses.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Settings Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Voice Settings
                  </CardTitle>
                  <CardDescription>
                    Customize your chat experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>AI Voice</Label>
                    <Select value={voiceType} onValueChange={setVoiceType}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sarah">Sarah (Female)</SelectItem>
                        <SelectItem value="john">John (Male)</SelectItem>
                        <SelectItem value="emma">Emma (British)</SelectItem>
                        <SelectItem value="alex">Alex (Neutral)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="it">Italian</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 space-y-3">
                    <Button
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={sendAudioMutation.isPending}
                      className={`w-full ${
                        isRecording
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {isRecording ? (
                        <>
                          <MicOff className="w-4 h-4 mr-2" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Mic className="w-4 h-4 mr-2" />
                          Start Recording
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={clearChat}
                      variant="outline"
                      className="w-full"
                    >
                      Clear Chat
                    </Button>
                  </div>

                  {isRecording && (
                    <div className="flex items-center justify-center p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-red-600 font-medium">
                          Recording...
                        </span>
                      </div>
                    </div>
                  )}

                  {sendAudioMutation.isPending && (
                    <div className="flex items-center justify-center p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                        <span className="text-blue-600 font-medium">
                          Processing...
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Chat Messages */}
              <div className="lg:col-span-2">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      Conversation
                    </CardTitle>
                    <CardDescription>Your voice chat with AI</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                      {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <Mic className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground mb-2">
                              Start a conversation
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Click "Start Recording" to begin your voice chat
                            </p>
                          </div>
                        </div>
                      ) : (
                        messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.type === "user"
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                                message.type === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                {message.type === "ai" && (
                                  <Badge variant="secondary">AI</Badge>
                                )}
                                {message.isAudio && (
                                  <Badge variant="outline">Audio</Badge>
                                )}
                              </div>
                              <p className="text-sm">{message.content}</p>
                              {message.type === "ai" && (
                                <div className="mt-3">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => playAIResponse()}
                                    disabled={isPlaying}
                                    className="h-auto p-0"
                                  >
                                    {isPlaying ? (
                                      <>
                                        <VolumeX className="w-3 h-3 mr-1" />
                                        Playing...
                                      </>
                                    ) : (
                                      <>
                                        <Volume2 className="w-3 h-3 mr-1" />
                                        Play
                                      </>
                                    )}
                                  </Button>
                                </div>
                              )}
                              <div className="text-xs text-muted-foreground mt-2">
                                {message.timestamp.toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Features */}
            <div className="mt-12 grid md:grid-cols-4 gap-6">
              <Card className="text-center p-6">
                <Mic className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Voice Recognition
                </h3>
                <p className="text-muted-foreground text-sm">
                  Advanced speech-to-text processing
                </p>
              </Card>
              <Card className="text-center p-6">
                <Volume2 className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Natural Speech</h3>
                <p className="text-muted-foreground text-sm">
                  Realistic AI voice responses
                </p>
              </Card>
              <Card className="text-center p-6">
                <MessageCircle className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Real-time Chat</h3>
                <p className="text-muted-foreground text-sm">
                  Instant conversation processing
                </p>
              </Card>
              <Card className="text-center p-6">
                <Settings className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Customizable</h3>
                <p className="text-muted-foreground text-sm">
                  Multiple voices and languages
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
