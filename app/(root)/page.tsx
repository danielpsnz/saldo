"use client";

import HeaderBox from "@/components/HeaderBox";
import { DataCharts } from "@/components/DataCharts";
import { DataGrid } from "@/components/DataGrid";

const Home = () => {
  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={"Guest"}
            subtext="Access and manage your account and transactions efficiently."
          />
        </header>
        <DataGrid />
        <DataCharts />
      </div>
    </section>
  );
};

export default Home;
