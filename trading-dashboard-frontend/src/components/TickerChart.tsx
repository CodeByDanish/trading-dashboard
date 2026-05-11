import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import type { ChartPoint } from "../hooks/livePrices";

type Props = {
  symbol: string;
  data: ChartPoint[];
};

export const TickerChart: React.FC<Props> = ({ symbol, data }) => {
  return (
    <div className="chart-container">
      <h2 className="chart-title">{symbol} Real-time Price</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />

          <XAxis dataKey="time" minTickGap={20} />

          <YAxis domain={["auto", "auto"]} />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="price"
            stroke="#4f46e5"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
