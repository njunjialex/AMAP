import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const PriceTrends = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/api/market-prices/") // Update with your actual API endpoint
            .then((response) => response.json())
            .then((data) => {
                const formattedData = data.map((item) => ({
                    date: item.date,
                    wholesale: item.wholesale,
                    retail: item.retail,
                }));
                setData(formattedData);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="wholesale" stroke="#8884d8" name="Wholesale Price" />
                <Line type="monotone" dataKey="retail" stroke="#82ca9d" name="Retail Price" />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default PriceTrends;
