export interface AudioTranscriptMessage {
  role: "user" | "system" | "assistant";
  content: string;
}
