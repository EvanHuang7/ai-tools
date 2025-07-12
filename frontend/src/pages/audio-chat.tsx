import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
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
import { Textarea } from "@/components/ui/textarea";
import { UsageGuard } from "@/components/usage-guard";
import {
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Settings,
  MessageCircle,
  Loader2,
  Volume2,
  User,
  Bot,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import Vapi from "@vapi-ai/web";
import { configureAssistant } from "@/lib/utils";
import { voiceOptions, styleOptions } from "@/constants/vapi";
import type { TranscriptMessage } from "@/types/vapi";
import { getVapi } from "@/lib/vapi";

export function AudioChat() {
  // Vapi instance
  const vapiRef = useRef<any>(null);

  // Call state
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // Configuration
  const [topic, setTopic] = useState("");
  const [conversationStyle, setConversationStyle] = useState("friendly");
  const [selectedVoice, setSelectedVoice] = useState("sarah");

  // Transcript
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [isListening, setIsListening] = useState(false);

  // Refs
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Vapi
  useEffect(() => {
    vapiRef.current = getVapi();

    // Set up event listeners only ONCE
    vapiRef.current.on("call-start", () => {
      console.log("Call started");
      setIsConnected(true);
      setIsConnecting(false);
      startCallTimer();
      toast.success("Connected to AI assistant");
    });

    vapiRef.current.on("call-end", () => {
      console.log("Call ended");
      setIsConnected(false);
      setIsConnecting(false);
      setIsListening(false);
      stopCallTimer();
      toast.info("Call ended");
    });

    vapiRef.current.on("speech-start", () => {
      console.log("User started speaking");
      setIsListening(true);
    });

    vapiRef.current.on("speech-end", () => {
      console.log("User stopped speaking");
      setIsListening(false);
    });

    vapiRef.current.on("message", (message: any) => {
      console.log("Message received:", message);

      if (message.type === "transcript") {
        const newMessage: TranscriptMessage = {
          id: Date.now().toString() + Math.random(),
          type: message.role === "user" ? "user" : "assistant",
          content: message.transcript,
          timestamp: new Date(),
          isPartial:
            !message.transcriptType || message.transcriptType === "partial",
        };

        setTranscript((prev) => {
          // Remove previous partial message of the same type if this is a final transcript
          if (!newMessage.isPartial) {
            const filtered = prev.filter(
              (msg) => !(msg.type === newMessage.type && msg.isPartial)
            );
            return [...filtered, newMessage];
          }

          // For partial messages, replace the previous partial of the same type
          const filtered = prev.filter(
            (msg) => !(msg.type === newMessage.type && msg.isPartial)
          );
          return [...filtered, newMessage];
        });
      }
    });

    vapiRef.current.on("error", (error: any) => {
      console.error("Vapi error:", error);
      toast.error("Connection error occurred");
      setIsConnecting(false);
      setIsConnected(false);
    });

    // Clean up in useEffect
    return () => {
      vapiRef.current?.stop();
      stopCallTimer();
    };
  }, []);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  // Call timer functions
  const startCallTimer = () => {
    setCallDuration(0);
    callTimerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  };

  const stopCallTimer = () => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
  };

  // Format call duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Start conversation
  const startConversation = async () => {
    if (!vapiRef.current) {
      toast.error("Vapi not initialized");
      return;
    }

    // Make sure it's not already on a call before calling start
    if (isConnected) {
      toast.info("You're already in a call");
      return;
    }

    if (!topic.trim()) {
      toast.error("Please enter a topic for conversation");
      return;
    }

    setIsConnecting(true);
    setTranscript([]);

    try {
      const config = configureAssistant(
        selectedVoice,
        conversationStyle,
        topic
      );
      console.log("Starting conversation with config:", config);
      await vapiRef.current.start(config);
    } catch (error) {
      // TODO: Change to display different error toast if it is no HTTPS set up issue
      console.error("Failed to start conversation:", error);
      toast.error(
        "Failed to start conversation. Please check your configuration."
      );
      setIsConnecting(false);
    }
  };

  // End conversation
  const endConversation = () => {
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (vapiRef.current && isConnected) {
      if (isMuted) {
        vapiRef.current.setMuted(false);
        setIsMuted(false);
        toast.info("Microphone unmuted");
      } else {
        vapiRef.current.setMuted(true);
        setIsMuted(true);
        toast.info("Microphone muted");
      }
    }
  };

  // Clear transcript
  const clearTranscript = () => {
    setTranscript([]);
    toast.info("Transcript cleared");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />

        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">AI Voice Chat</h1>
              <p className="text-muted-foreground">
                Have natural voice conversations with AI. Choose your topic,
                select a voice style, and start chatting!
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Settings Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Conversation Setup
                  </CardTitle>
                  <CardDescription>
                    Configure your AI chat experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <UsageGuard
                    feature="audioChat"
                    action="start this conversation"
                  >
                    {/* Topic Input */}
                    <div>
                      <Label htmlFor="topic">Conversation Topic *</Label>
                      <Textarea
                        id="topic"
                        placeholder="What would you like to talk about? (e.g., 'space exploration', 'cooking tips', 'business strategy')"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="mt-2"
                        rows={3}
                        disabled={isConnected || isConnecting}
                      />
                    </div>

                    {/* Conversation Style */}
                    <div>
                      <Label>Conversation Style</Label>
                      <Select
                        value={conversationStyle}
                        onValueChange={setConversationStyle}
                        disabled={isConnected || isConnecting}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {styleOptions.map((style) => (
                            <SelectItem key={style.id} value={style.id}>
                              <div>
                                <div className="font-medium">{style.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {style.description}
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Voice Selection */}
                    <div>
                      <Label>AI Voice</Label>
                      <Select
                        value={selectedVoice}
                        onValueChange={setSelectedVoice}
                        disabled={isConnected || isConnecting}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {voiceOptions.map((voice) => (
                            <SelectItem key={voice.id} value={voice.id}>
                              <div>
                                <div className="font-medium">{voice.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {voice.description}
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Call Controls */}
                    <div className="space-y-3 pt-4">
                      {!isConnected ? (
                        <Button
                          onClick={startConversation}
                          disabled={isConnecting || !topic.trim()}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          {isConnecting ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Connecting...
                            </>
                          ) : (
                            <>
                              <Phone className="w-4 h-4 mr-2" />
                              Start Conversation
                            </>
                          )}
                        </Button>
                      ) : (
                        <div className="space-y-3">
                          <Button
                            onClick={endConversation}
                            className="w-full bg-red-600 hover:bg-red-700"
                          >
                            <PhoneOff className="w-4 h-4 mr-2" />
                            End Conversation
                          </Button>

                          <Button
                            onClick={toggleMute}
                            variant="outline"
                            className="w-full"
                          >
                            {isMuted ? (
                              <>
                                <MicOff className="w-4 h-4 mr-2" />
                                Unmute
                              </>
                            ) : (
                              <>
                                <Mic className="w-4 h-4 mr-2" />
                                Mute
                              </>
                            )}
                          </Button>
                        </div>
                      )}

                      <Button
                        onClick={clearTranscript}
                        variant="outline"
                        className="w-full"
                        disabled={transcript.length === 0}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Clear Transcript
                      </Button>
                    </div>

                    {/* Call Status */}
                    {isConnected && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-green-800 font-medium">
                              Connected
                            </span>
                          </div>
                          <Badge
                            variant="outline"
                            className="text-green-700 border-green-300"
                          >
                            {formatDuration(callDuration)}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-green-700">
                          <div className="flex items-center gap-1">
                            {isListening ? (
                              <>
                                <Mic className="w-3 h-3" />
                                <span>Listening...</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3 h-3" />
                                <span>Ready</span>
                              </>
                            )}
                          </div>

                          {isMuted && (
                            <div className="flex items-center gap-1">
                              <MicOff className="w-3 h-3" />
                              <span>Muted</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </UsageGuard>
                </CardContent>
              </Card>

              {/* Transcript */}
              <div className="lg:col-span-2">
                <Card className="h-[700px] flex flex-col">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        <CardTitle>Live Transcript</CardTitle>
                      </div>
                      {transcript.length > 0 && (
                        <Badge variant="secondary">
                          {transcript.filter((m) => !m.isPartial).length}{" "}
                          messages
                        </Badge>
                      )}
                    </div>
                    <CardDescription>
                      Real-time conversation transcript
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                      {transcript.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground mb-2">
                              No conversation yet
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {!topic.trim()
                                ? "Enter a topic and start your conversation"
                                : "Click 'Start Conversation' to begin"}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          {transcript.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${
                                message.type === "user"
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >
                              <div
                                className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                                  message.type === "user"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                                } ${message.isPartial ? "opacity-70" : ""}`}
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  {message.type === "user" ? (
                                    <User className="w-4 h-4" />
                                  ) : (
                                    <Bot className="w-4 h-4" />
                                  )}
                                  <span className="text-xs font-medium">
                                    {message.type === "user"
                                      ? "You"
                                      : "AI Assistant"}
                                  </span>
                                  {message.isPartial && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      Typing...
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm leading-relaxed">
                                  {message.content}
                                </p>
                                <div className="text-xs opacity-70 mt-2">
                                  {message.timestamp.toLocaleTimeString()}
                                </div>
                              </div>
                            </div>
                          ))}
                          <div ref={transcriptEndRef} />
                        </>
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
                <h3 className="text-lg font-semibold mb-2">Natural Speech</h3>
                <p className="text-muted-foreground text-sm">
                  Advanced voice recognition and synthesis
                </p>
              </Card>
              <Card className="text-center p-6">
                <MessageCircle className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Live Transcript</h3>
                <p className="text-muted-foreground text-sm">
                  Real-time conversation transcription
                </p>
              </Card>
              <Card className="text-center p-6">
                <Settings className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Customizable</h3>
                <p className="text-muted-foreground text-sm">
                  Choose topics, voices, and conversation styles
                </p>
              </Card>
              <Card className="text-center p-6">
                <Volume2 className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Premium Voices</h3>
                <p className="text-muted-foreground text-sm">
                  High-quality AI voices with different personalities
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
