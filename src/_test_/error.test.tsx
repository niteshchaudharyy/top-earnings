import { render, screen } from '@testing-library/react';
import ErrorComponent from '../Components/Error';

test('renders error component with default message', () => {
    render(<ErrorComponent />);
    const titleElement = screen.getByText(/oops!/i);
    const messageElement = screen.getByText(/something went wrong. please try again later./i);
    expect(titleElement).toBeInTheDocument();
    expect(messageElement).toBeInTheDocument();
});

test('renders error component with custom message', () => {
    const customMessage = "Custom error message.";
    render(<ErrorComponent message={customMessage} />);
    const messageElement = screen.getByText(customMessage);
    expect(messageElement).toBeInTheDocument();
});