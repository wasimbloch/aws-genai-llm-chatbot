import React, { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { sendQuery } from '../../../graphql/mutations';
import { TelcoChat } from '../../../components/chatbot/telco-chat';
import { useSessionContext } from '../../../contexts/session-context';

export const TelcoPlayground: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);
  const { sessionId, createSession } = useSessionContext();

  useEffect(() => {
    if (!sessionId) {
      createSession();
    }
  }, [sessionId, createSession]);

  const handleSendMessage = async (message: string) => {
    if (!sessionId) {
      setError(new Error('No active session'));
      return;
    }

    setIsLoading(true);
    setError(undefined);

    // Add user message to chat
    const userMessage = {
      role: 'user',
      content: message,
      createdAt: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Send message to API
      const data = JSON.stringify({
        sessionId,
        message,
        // Set telco-specific context
        additionalContext: {
          domain: 'telecommunications',
          userType: 'customer',
          capabilities: ['billing', 'technical-support', 'plan-management', 'network-status']
        }
      });
      
      const response: any = await API.graphql(
        graphqlOperation(sendQuery, { data })
      );

      // Add assistant response to chat
      const assistantMessage = {
        role: 'assistant',
        content: response.data.sendQuery,
        createdAt: new Date().toISOString(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err as Error);
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TelcoChat
      onSendMessage={handleSendMessage}
      messages={messages}
      isLoading={isLoading}
      error={error}
      initialMessage="Welcome to our Telecom Assistant! I can help you with billing inquiries, technical support, plan management, and more. How can I assist you today?"
    />
  );
};