import { render, screen } from "@testing-library/react";
import EarningGrid from "../EarningsView/EarningGrid";

describe("EarningGrid Component", () => {
    const mockLogos = {
        AAPL: { mark_vector_light: "apple-logo.png" },
        TSLA: { mark_vector_light: "tesla-logo.png" },
    };

    const mockEarnings = {
        BMO: [
            { ticker: "AAPL", name: "Apple Inc." },
            { ticker: "TSLA", name: "Tesla Inc." },
        ],
        AMC: [{ ticker: "TSLA", name: "Tesla Inc." }],
    };

    it("renders the 'Before Open' section with correct data", () => {
        render(<EarningGrid earnings={mockEarnings} logos={mockLogos} />);

        expect(screen.getByText("Before Open:")).toBeInTheDocument();
        expect(screen.getByAltText("AAPL")).toHaveAttribute(
            "src",
            "apple-logo.png"
        );
        expect(screen.getAllByAltText("TSLA")[0]).toHaveAttribute(
            "src",
            "tesla-logo.png"
        );
    });

    it("renders the 'After Close' section with correct data", () => {
        render(<EarningGrid earnings={mockEarnings} logos={mockLogos} />);

        expect(screen.getByText("After Close:")).toBeInTheDocument();
        expect(screen.getAllByAltText("TSLA")[0]).toHaveAttribute(
            "src",
            "tesla-logo.png"
        );
    });

    it("renders empty sections when no earnings data is provided", () => {
        render(<EarningGrid earnings={{}} logos={mockLogos} />);

        expect(screen.getByText("Before Open:")).toBeInTheDocument();
        expect(screen.getByText("After Close:")).toBeInTheDocument();
        expect(screen.queryByAltText("AAPL")).not.toBeInTheDocument();
        expect(screen.queryByAltText("TSLA")).not.toBeInTheDocument();
    });
});