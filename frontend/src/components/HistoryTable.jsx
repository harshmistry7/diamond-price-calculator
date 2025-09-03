import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react"; // Import icon from lucide-react

export default function HistoryTable() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // dynamic rows per page
  const [loading, setLoading] = useState(true);

  // Fetch history data
  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/history");
      setHistory(res.data.items || []);
    } catch (error) {
      console.error("Error fetching history:", error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Clear all history
  const clearHistory = async () => {
    if (window.confirm("Are you sure you want to clear all history?")) {
      try {
        await axios.delete("http://localhost:5000/api/history");
        fetchHistory();
        setCurrentPage(1);
      } catch (error) {
        console.error("Error clearing history:", error);
      }
    }
  };

  // Search filter
  const filteredHistory = history.filter((item) =>
    [item.shape || "", item.color || "", item.clarity || ""]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  if (loading) return <p>Loading history...</p>;

  return (
    <Card className="shadow-md">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-xl font-bold">Calculation History</CardTitle>

        {/* Professional Clear Button */}
        <Button
          variant="destructive"
          size="sm"
          onClick={clearHistory}
          className="flex items-center gap-2 hover:scale-105 transition-transform duration-200"
        >
          <Trash2 className="w-4 h-4" />
          Clear All
        </Button>
      </CardHeader>

      <CardContent>
        {/* Search Bar + Rows per page */}
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-2">
          <Input
            type="text"
            placeholder="Search by shape, color, clarity..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-1/2"
          />

          {/* Rows per page dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Rows per page:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1); // reset to first page when changing rows
              }}
              className="border rounded px-2 py-1"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* History Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Shape</th>
                <th className="p-2 border">Color</th>
                <th className="p-2 border">Clarity</th>
                <th className="p-2 border">Carat Weight</th>
                <th className="p-2 border font-sans">Price ($)</th>
                <th className="p-2 border">Discount (%)</th>
                <th className="p-2 border">Final Amount ($)</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2 border">{item.shape}</td>
                    <td className="p-2 border">{item.color}</td>
                    <td className="p-2 border">{item.clarity}</td>
                    <td className="p-2 border">{item.caratWeight}</td>
                    <td className="p-2 border">${item.basePrice}</td>
                    <td className="p-2 border">{item.discount}</td>
                    <td className="p-2 border">${item.finalAmount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-500">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 gap-2">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Prev
            </Button>
            <span className="flex items-center">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
