import { useState, useEffect, useRef, useMemo } from "react";
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
  Phone,
  PhoneOff,
  Settings,
  MessageCircle,
  Loader2,
  Volume2,
  User,
  Bot,
} from "lucide-react";
import { toast } from "sonner";
import { configureAssistant } from "@/lib/utils";
import { voiceOptions, styleOptions } from "@/constants/vapi";
import { vapi } from "@/lib/vapi";
import type { AudioTranscriptMessage } from "@/types/index";
import { useStartAudio, useCreateAudio } from "@/api/audioChat/audio.queries";

// Call status enum following ai-interview pattern
enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

export function AudioChat() {
  // Call state - simplified like ai-interview
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<AudioTranscriptMessage[]>([]);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // Refs
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // API hooks
  const startAudioMutation = useStartAudio();
  const createAudioMutation = useCreateAudio();

  // Group messages by consecutive same-role
  const groupedMessages = useMemo(() => {
    const groups: AudioTranscriptMessage[] = [];

    for (const msg of messages) {
      const last = groups[groups.length - 1];
      if (last && last.role === msg.role) {
        last.content += ` ${msg.content}`;
      } else {
        groups.push({ role: msg.role, content: msg.content });
      }
    }

    return groups;
  }, [messages]);

  // Configuration
  const [topic, setTopic] = useState("");
  const [conversationStyle, setConversationStyle] = useState("friendly");
  const [selectedVoice, setSelectedVoice] = useState("sarah");

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    const container = transcriptEndRef.current?.parentElement;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [groupedMessages]);

  // Subscribe to VAPI event
  useEffect(() => {
    const onCallStart = () => {
      console.log("Call started");
      setCallStatus(CallStatus.ACTIVE);
      startCallTimer();
      toast.success("Connected to AI assistant");
    };

    const onCallEnd = () => {
      console.log("Call ended");
      setCallStatus(CallStatus.FINISHED);
      setIsAiSpeaking(false);
      stopCallTimer();
      toast.info("Call ended");
    };

    const onMessage = (message: any) => {
      console.log("Message received:", message);

      // Follow ai-interview pattern for transcript handling
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("AI started speaking");
      setIsAiSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("AI stopped speaking");
      setIsAiSpeaking(false);
    };

    const onError = (error: any) => {
      // Ignore specific "meeting ended" errors like ai-interview
      if (error?.message?.includes("Meeting has ended")) return;
      console.error("Vapi error:", error);
      toast.error("Connection error occurred");
      setCallStatus(CallStatus.INACTIVE);
    };

    // Subscribe to events
    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    // Cleanup
    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  // Create transcript record after finishing conversation
  useEffect(() => {
    const handleCreateTranscriptRecord = async (
      groupedMessages: AudioTranscriptMessage[]
    ) => {
      try {
        await createAudioMutation.mutateAsync({
          topic: topic,
          transcript: groupedMessages,
        });
        toast.success("Transcript record created successfully");
      } catch (error) {
        console.error("Error creating transcript record :", error);
        toast.error("An error occurs when creating transcript record");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      handleCreateTranscriptRecord(groupedMessages);
    }
  }, [groupedMessages, callStatus]);

  // Start conversation - following ai-interview pattern
  const startConversation = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic for conversation");
      return;
    }

    try {
      // Check if user has available app usage
      const usageResponse = await startAudioMutation.mutateAsync();

      // If user has run out of audio usage, STOP starting conversation
      if (!usageResponse.passUsageCheck) {
        toast.error("You've reached your monthly audio chat limit");
        return;
      }

      // If user has available usage, start the conversation
      setCallStatus(CallStatus.CONNECTING);
      setMessages([]);

      const config = configureAssistant(
        selectedVoice,
        conversationStyle,
        topic
      ) as any;

      await vapi.start(config);
    } catch (error) {
      console.error("Failed to start conversation:", error);
      toast.error(
        "Failed to start conversation. Please check your configuration."
      );
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  // End conversation - following ai-interview pattern
  const endConversation = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

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

  // Check if call is active
  const isConnected = callStatus === CallStatus.ACTIVE;
  const isConnecting = callStatus === CallStatus.CONNECTING;

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
                        </div>
                      )}
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
                            {isAiSpeaking ? (
                              <>
                                <Volume2 className="w-3 h-3" />
                                <span>AI Speaking...</span>
                              </>
                            ) : (
                              <>
                                <Mic className="w-3 h-3" />
                                <span>Listening...</span>
                              </>
                            )}
                          </div>
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
                      {groupedMessages.length > 0 && (
                        <Badge variant="secondary">
                          {groupedMessages.length} Messages
                        </Badge>
                      )}
                    </div>
                    <CardDescription>
                      Real-time conversation transcript
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[500px]">
                      {groupedMessages.length === 0 ? (
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
                          {groupedMessages.map((message, idx) => (
                            <div
                              key={idx}
                              className={`flex ${
                                message.role === "user"
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >
                              <div
                                className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                                  message.role === "user"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  {message.role === "user" ? (
                                    <User className="w-4 h-4" />
                                  ) : (
                                    <Bot className="w-4 h-4" />
                                  )}
                                  <span className="text-xs font-medium">
                                    {message.role === "user"
                                      ? "You"
                                      : "AI Assistant"}
                                  </span>
                                </div>
                                <p className="text-sm leading-relaxed">
                                  {message.content}
                                </p>
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
