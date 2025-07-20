import React, { useState, useEffect } from 'react';
import { SpaceBetween, Container, Header, Button, Input } from '@cloudscape-design/components';
import { TelcoQuickActions } from './telco-quick-actions';
import '../../../src/styles/telco-theme.css';

export interface TelcoChatProps {
  initialMessage?: string;
  onSendMessage: (message: string) => void;
  messages: any[];
  isLoading?: boolean;
  error?: Error;
}

export const TelcoChat: React.FC<TelcoChatProps> = ({
  initialMessage = "Hello! I'm your telecom assistant. How can I help you today?",
  onSendMessage,
  messages,
  isLoading = false,
  error,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([]);

  useEffect(() => {
    if (messages.length === 0 && initialMessage) {
      setChatMessages([
        {
          role: 'assistant',
          content: initialMessage,
          createdAt: new Date().toISOString(),
        },
      ]);
    } else {
      setChatMessages(messages);
    }
  }, [messages, initialMessage]);

  const handleSendMessage = () => {
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyDown = ({ detail }: { detail: { key: string, ctrlKey: boolean, shiftKey: boolean } }) => {
    if (detail.key === 'Enter' && !detail.shiftKey) {
      handleSendMessage();
    }
  };

  const handleQuickActionClick = (action: string) => {
    onSendMessage(action);
  };

  return (
    <div className="telco-theme">
      <Container>
        <Header
          variant="h1"
          className="telco-header"
          description="Your telecom virtual assistant powered by AI"
        >
          <SpaceBetween direction="horizontal" size="m">
            <img 
              src="/telco-logo.png" 
              alt="Telco Logo" 
              className="telco-logo"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            Telecom Assistant
          </SpaceBetween>
        </Header>

        <div className="telco-chat-container">
          <div className="telco-messages-container">
            {chatMessages.map((message, index) => (
              <div
                key={index}
                className={message.role === 'user' ? 'telco-message-user' : 'telco-message-bot'}
              >
                <div>{message.content}</div>
              </div>
            ))}
            {isLoading && (
              <div className="telco-message-bot">
                <p>Thinking...</p>
              </div>
            )}
            {error && (
              <div className="telco-message-bot" style={{ borderLeft: '4px solid var(--telco-error)' }}>
                <p>Sorry, there was an error: {error.message}</p>
              </div>
            )}
          </div>

          <TelcoQuickActions onActionClick={handleQuickActionClick} />

          <div className="telco-input-container">
            <SpaceBetween direction="horizontal" size="s">
              <Input
                className="telco-input"
                value={inputValue}
                onChange={({ detail }) => setInputValue(detail.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your question here..."
                disabled={isLoading}
                __internalRootRef={undefined}
              />
              <Button
                className="telco-button"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
              >
                Send
              </Button>
            </SpaceBetween>
          </div>
        </div>
      </Container>
    </div>
  );
};