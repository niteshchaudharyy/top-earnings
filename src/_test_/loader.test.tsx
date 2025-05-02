import { render, screen } from '@testing-library/react';
import Loader from '../Components/Loader';

test('renders loader component', () => {
	render(<Loader />);
	const loaderElement = screen.getByTestId("loader");
	expect(loaderElement).toBeInTheDocument();
});

