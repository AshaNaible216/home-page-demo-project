import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConversationPrompt from '../src/components/ConversationPrompt';

describe('ConversationPrompt', () => {
  const mockOnResponse = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders question text correctly', () => {
    render(
      <ConversationPrompt
        question="What is your favorite color?"
        onResponse={mockOnResponse}
        isWaiting={false}
        questionNumber={1}
        totalQuestions={3}
      />
    );
    
    expect(screen.getByText('What is your favorite color?')).toBeInTheDocument();
  });
  
  test('shows progress indicator with correct numbers', () => {
    render(
      <ConversationPrompt
        question="What is your favorite color?"
        onResponse={mockOnResponse}
        isWaiting={false}
        questionNumber={2}
        totalQuestions={5}
      />
    );
    
    expect(screen.getByText('2/5')).toBeInTheDocument();
  });
  
  test('renders options when provided', () => {
    const options = ['Red', 'Blue', 'Green', 'Yellow'];
    
    render(
      <ConversationPrompt
        question="What is your favorite color?"
        onResponse={mockOnResponse}
        options={options}
        isWaiting={false}
        questionNumber={1}
        totalQuestions={3}
      />
    );
    
    options.forEach(option => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });
  
  test('calls onResponse when an option is clicked', () => {
    const options = ['Red', 'Blue', 'Green', 'Yellow'];
    
    render(
      <ConversationPrompt
        question="What is your favorite color?"
        onResponse={mockOnResponse}
        options={options}
        isWaiting={false}
        questionNumber={1}
        totalQuestions={3}
      />
    );
    
    fireEvent.click(screen.getByText('Blue'));
    expect(mockOnResponse).toHaveBeenCalledWith('Blue');
  });
  
  test('shows color picker when showColorPicker is true', () => {
    render(
      <ConversationPrompt
        question="Choose a color"
        onResponse={mockOnResponse}
        showColorPicker={true}
        isWaiting={false}
        questionNumber={1}
        totalQuestions={3}
      />
    );
    
    // Look for color picker elements
    expect(screen.getByTestId('color-picker')).toBeInTheDocument();
  });
  
  test('disables interaction when isWaiting is true', () => {
    const options = ['Red', 'Blue', 'Green', 'Yellow'];
    
    render(
      <ConversationPrompt
        question="What is your favorite color?"
        onResponse={mockOnResponse}
        options={options}
        isWaiting={true}
        questionNumber={1}
        totalQuestions={3}
      />
    );
    
    // Options should be disabled
    const optionButtons = screen.getAllByRole('button');
    optionButtons.forEach(button => {
      expect(button).toBeDisabled();
    });
    
    // Should show loading indicator
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });
  
  test('allows custom input when options are provided', async () => {
    const options = ['Red', 'Blue', 'Green', 'Yellow'];
    
    render(
      <ConversationPrompt
        question="What is your favorite color?"
        onResponse={mockOnResponse}
        options={options}
        isWaiting={false}
        questionNumber={1}
        totalQuestions={3}
      />
    );
    
    // Find the custom input field
    const input = screen.getByPlaceholderText('Type your own answer...');
    fireEvent.change(input, { target: { value: 'Purple' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    expect(mockOnResponse).toHaveBeenCalledWith('Purple');
  });
});
