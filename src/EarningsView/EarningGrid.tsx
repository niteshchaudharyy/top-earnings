import React from "react";
import { Grid } from "@mui/material";
import { Earnings } from "../utils";

interface EarningsViewProps {
  title: string;
  earnings: any[];
  logos: Record<string, { mark_vector_light: string }>;
}

const EarningsSection: React.FC<EarningsViewProps> = ({
  title,
  earnings,
  logos,
}) => (
  <Grid
    size={{ xs: 6 }}
    direction="column"
    alignContent={"flex-start"}
    justifyContent="center"
  >
    <p className="center">{title}</p>
    {earnings?.map((item: Earnings) => (
      <div key={item.ticker}>
        <a target="_blank" rel="noreferrer" href={`https://www.benzinga.com/quote/${item.ticker}`} ><img
          className="logo"
          src={logos[item.ticker]?.mark_vector_light}
          alt={item.ticker}
          width="50"
          height="50"
        /></a>
      </div>
    ))}
  </Grid>
);

interface EarningGridProps {
  earnings: {
    BMO?: any[];
    AMC?: any[];
  };
  logos: Record<string, { mark_vector_light: string }>;
}

const EarningGrid: React.FC<EarningGridProps> = ({ earnings, logos }) => (
  <Grid
    container
    spacing={2}
    direction="row"
    alignContent="space-between"
    justifyContent="center"
  >
    <EarningsSection
      title="Before Open:"
      earnings={earnings.BMO || []}
      logos={logos}
    />
    <EarningsSection
      title="After Close:"
      earnings={earnings.AMC || []}
      logos={logos}
    />
  </Grid>
);

export default EarningGrid;
