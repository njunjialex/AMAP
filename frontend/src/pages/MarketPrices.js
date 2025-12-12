import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "./MarketPrice.css";
import PriceTrends from "./PriceTrends";
import { CSVLink } from "react-csv";

function MarketPrices() {
  const [prices, setPrices] = useState([]);
  const [filteredPrices, setFilteredPrices] = useState([]);
  const [commodity, setCommodity] = useState("");
  const [county, setCounty] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [commoditySuggestions, setCommoditySuggestions] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/market-prices/")
      .then(response => response.json())
      .then(data => {
        setPrices(data);
        setFilteredPrices(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    handleFilter();
  }, [commodity, county, date]);

  useEffect(() => {
    if (commodity) {
      const uniqueCommodities = [...new Set(prices.map(item => item.commodity))];
      setCommoditySuggestions(uniqueCommodities.filter(c => c.toLowerCase().includes(commodity.toLowerCase())));
    } else {
      setCommoditySuggestions([]);
    }
  }, [commodity, prices]);

  const handleFilter = () => {
    let filtered = prices;

    if (commodity) {
      filtered = filtered.filter(item => item.commodity.toLowerCase().includes(commodity.toLowerCase()));
    }
    if (county) {
      filtered = filtered.filter(item => item.county.toLowerCase().includes(county.toLowerCase()));
    }
    if (date) {
      filtered = filtered.filter(item => item.date === date);
    }

    setFilteredPrices(filtered);
  };

  const resetFilters = () => {
    setCommodity("");
    setCounty("");
    setDate("");
    setFilteredPrices(prices);
  };

  return (
    <div>
      <Navbar />
      <h2>Market Prices</h2>
      
      {loading ? <p>Loading data...</p> : (
        <>
          <div className="filters">
            <div className="autocomplete">
              <input 
                type="text" 
                placeholder="Commodity" 
                value={commodity} 
                onChange={(e) => setCommodity(e.target.value)} 
              />
              {commoditySuggestions.length > 0 && (
                <ul className="suggestions">
                  {commoditySuggestions.map((suggestion, index) => (
                    <li key={index} onClick={() => setCommodity(suggestion)}>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
              <input type="text" placeholder="County" value={county} onChange={(e) => setCounty(e.target.value)} />
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              <button onClick={resetFilters}>Reset</button>
              <CSVLink data={filteredPrices} filename="market_prices.csv" className="export-button">
                 Export CSV
                </CSVLink>
            </div>
            
          </div>

          

          <table>
            <thead>
              <tr>
                <th>Commodity</th>
                <th>Wholesale Price</th>
                <th>Retail Price</th>
                <th>County</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredPrices.map((item) => (
                <tr key={item.id}>
                  <td>{item.commodity}</td>
                  <td>{item.wholesale}</td>
                  <td>{item.retail}</td>
                  <td>{item.county}</td>
                  <td>{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div>
            <h2>Market Price Trends</h2>
            <PriceTrends />
          </div>
        </>
      )}
    </div>
  );
}

export default MarketPrices;
