import { NextRequest, NextResponse } from "next/server";
import { chatSessionsRepository, chatMessagesRepository } from "@/db/repositories/chatRepository";

// GET all messages for a chat session
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Properly await the params object
    const params = await Promise.resolve(context.params);
    
    if (!params || !params.id) {
      return NextResponse.json({ error: "Invalid session ID" }, { status: 400 });
    }
    
    const sessionId = parseInt(params.id);
    
    if (isNaN(sessionId)) {
      return NextResponse.json({ error: "Invalid session ID" }, { status: 400 });
    }
    
    // Check if session exists
    const session = await chatSessionsRepository.getSessionById(sessionId);
    
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    
    const messages = await chatMessagesRepository.getMessagesBySessionId(sessionId);
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return NextResponse.json({ error: "Failed to fetch chat messages" }, { status: 500 });
  }
}

// POST a new message to a chat session
export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Properly await the params object
    const params = await Promise.resolve(context.params);
    
    if (!params || !params.id) {
      return NextResponse.json({ error: "Invalid session ID" }, { status: 400 });
    }
    
    const sessionId = parseInt(params.id);
    
    if (isNaN(sessionId)) {
      return NextResponse.json({ error: "Invalid session ID" }, { status: 400 });
    }
    
    // Check if session exists
    const session = await chatSessionsRepository.getSessionById(sessionId);
    
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    
    const data = await req.json();
    const { content, role } = data;
    
    if (!content || !role) {
      return NextResponse.json({ error: "Content and role are required" }, { status: 400 });
    }
    
    if (role !== 'user' && role !== 'assistant') {
      return NextResponse.json({ error: "Role must be 'user' or 'assistant'" }, { status: 400 });
    }
    
    const newMessage = await chatMessagesRepository.createMessage({
      sessionId,
      content,
      role,
      timestamp: new Date(),
    });
    
    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Error creating chat message:", error);
    return NextResponse.json({ error: "Failed to create chat message" }, { status: 500 });
  }
} 