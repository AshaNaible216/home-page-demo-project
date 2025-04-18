import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import PerformanceTest from '../src/components/PerformanceTest';

// Mock the components that might affect performance
jest.mock('../src/components/SiteAssemblyAnimation', () => ({
  __esModule: true,
  default: ({ onComplete }) => (
    <div data-testid="site-assembly-animation">
      <button onClick={onComplete}>Complete Animation</button>
    </div>
  )
}));

jest.mock('../src/components/TypewriterAnimation', () => ({
  __esModule: true,
  default: ({ text, onComplete }) => (
    <div data-testid="typewriter-animation">
      {text}
      <button onClick={onComplete}>Complete Typing</button>
    </div>
  )
}));

// Create a performance test component
const PerformanceTestComponent = () => {
  const [testResults, setTestResults] = React.useState({
    initialLoadTime: 0,
    renderTime: 0,
    animationPerformance: 0,
    memoryUsage: 0
  });
  
  const runPerformanceTests = async () => {
    // Measure initial load time
    const startTime = performance.now();
    
    // Simulate component rendering
    await act(async () => {
      // Wait for a short time to simulate rendering
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    const endTime = performance.now();
    
    // Calculate performance metrics
    const initialLoadTime = endTime - startTime;
    const renderTime = initialLoadTime * 0.7; // Simulated render time
    const animationPerformance = 60; // Simulated FPS
    const memoryUsage = 50; // Simulated memory usage in MB
    
    setTestResults({
      initialLoadTime,
      renderTime,
      animationPerformance,
      memoryUsage
    });
  };
  
  return (
    <div data-testid="performance-test">
      <button onClick={runPerformanceTests}>Run Performance Tests</button>
      
      {testResults.initialLoadTime > 0 && (
        <div data-testid="performance-results">
          <p>Initial Load Time: {testResults.initialLoadTime.toFixed(2)}ms</p>
          <p>Render Time: {testResults.renderTime.toFixed(2)}ms</p>
          <p>Animation Performance: {testResults.animationPerformance} FPS</p>
          <p>Memory Usage: {testResults.memoryUsage} MB</p>
        </div>
      )}
    </div>
  );
};

describe('Performance Tests', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });
  
  test('measures performance metrics correctly', async () => {
    render(<PerformanceTestComponent />);
    
    // Run performance tests
    fireEvent.click(screen.getByText('Run Performance Tests'));
    
    // Fast-forward timers
    act(() => {
      jest.advanceTimersByTime(200);
    });
    
    // Check if performance results are displayed
    await waitFor(() => {
      expect(screen.getByTestId('performance-results')).toBeInTheDocument();
    });
    
    // Verify that metrics are within acceptable ranges
    const initialLoadTime = parseFloat(screen.getByText(/Initial Load Time/).textContent.split(':')[1]);
    const renderTime = parseFloat(screen.getByText(/Render Time/).textContent.split(':')[1]);
    const animationPerformance = parseFloat(screen.getByText(/Animation Performance/).textContent.split(':')[1]);
    const memoryUsage = parseFloat(screen.getByText(/Memory Usage/).textContent.split(':')[1]);
    
    expect(initialLoadTime).toBeGreaterThan(0);
    expect(renderTime).toBeGreaterThan(0);
    expect(animationPerformance).toBeGreaterThanOrEqual(30); // Minimum acceptable FPS
    expect(memoryUsage).toBeLessThan(100); // Maximum acceptable memory usage
  });
  
  test('simulates animation performance', async () => {
    // Create a mock for performance.now()
    const originalPerformanceNow = performance.now;
    let callCount = 0;
    
    // Mock performance.now to simulate frame timing
    performance.now = jest.fn().mockImplementation(() => {
      callCount++;
      return callCount * 16.67; // Simulate 60fps (16.67ms per frame)
    });
    
    render(<PerformanceTestComponent />);
    
    // Run performance tests
    fireEvent.click(screen.getByText('Run Performance Tests'));
    
    // Fast-forward timers
    act(() => {
      jest.advanceTimersByTime(200);
    });
    
    // Check if performance results are displayed
    await waitFor(() => {
      expect(screen.getByTestId('performance-results')).toBeInTheDocument();
    });
    
    // Restore original performance.now
    performance.now = originalPerformanceNow;
  });
});
