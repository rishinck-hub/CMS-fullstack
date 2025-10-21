import React, { useEffect, useState } from "react";
import Button from "../../elements/Button";
import { fetchSystemReports } from "../../services/adminService";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Reports({ refreshKey }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetchSystemReports();
      setData(res);
    } catch (err) {
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [refreshKey]);

  return (
    <div className="container mt-0 p-0">
      <div className="card p-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="mb-0">Live Reports</h5>
          <div>
            <Button color="secondary" onClick={load}>
              Refresh
            </Button>
          </div>
        </div>

        {loading ? (
          <div>Loading reports...</div>
        ) : data ? (
          <div className="row">
            <div className="col-md-6">
              <ul>
                <li>
                  Total users: <b>{data.total_users ?? "-"}</b>
                </li>
                <li>
                  Doctors: <b>{data.doctors_count ?? "-"}</b>
                </li>
                <li>
                  Appointments this month:{" "}
                  <b>{data.appointments_month ?? "-"}</b>
                </li>
              </ul>
            </div>
            <div className="col-md-6">
              <Bar
                data={{
                  labels: ["Users", "Doctors", "Appointments (month)"],
                  datasets: [
                    {
                      label: "Count",
                      data: [
                        data.total_users || 0,
                        data.doctors_count || 0,
                        data.appointments_month || 0,
                      ],
                      backgroundColor: ["#4e73df", "#1cc88a", "#36b9cc"],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                }}
              />
            </div>
          </div>
        ) : (
          <div className="text-muted">No report data available</div>
        )}
      </div>
    </div>
  );
}
