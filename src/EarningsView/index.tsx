import { useEffect } from "react";
import { Grid } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { getLatestEarnings } from "../redux/slices/earningSlice";
import { Earnings, weekdaysFull } from "../utils";
import type { RootState, AppDispatch } from "../redux/store";
import EarningGrid from "./EarningGrid";
import Loader from "../Components/Loader";
import ErrorComponent from "../Components/Error";
import "./style.scss";

const TopEarningsComponent = () => {
  const { topEarningsByDay, logos, loading, error } = useSelector(
    (state: RootState) => state.earnings
  );
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getLatestEarnings());
  }, [dispatch]);

  return (
    <div className="earnings">
      <div>
        <h1 className="earnings-title">Top Earnings (This Week)
            <br />
            Most Anticipated earnings Releases {moment().format("Do MMMM YYYY")}
        </h1>
        <Grid container columns={5} direction="row" spacing={2}>
          {loading ? (
            <Loader />
          ) : error ? (
            <ErrorComponent message={error} />
          ) : (
            (
              Object.entries(topEarningsByDay) as [
                string,
                { BMO?: Earnings[]; AMC?: Earnings[] }
              ][]
            ).map(([day, earnings], index: number) => (
              <Grid
                direction="column"
                size={{ xs: 1 }}
                component={"div"}
                alignContent="flex-start"
                justifyContent="center"
                key={day}
              >
                <h3 className="day">{moment(day).format("Do MMMM")} <span>({weekdaysFull[index]})</span></h3>
                <EarningGrid earnings={earnings} logos={logos} />
              </Grid>
            ))
          )}
        </Grid>
      </div>
    </div>
  );
};

export default TopEarningsComponent;
