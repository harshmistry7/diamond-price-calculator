import { Routes, Route, Link } from "react-router-dom";
import CalculatorPage from "./pages/CalculatorPage";
import HistoryPage from "./pages/HistoryPage";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-black text-white p-4">
        <nav className="container mx-auto flex justify-between">
          <h1 className="text-xl font-bold">Diamond Price Calculator</h1>
          <div className="flex gap-6">
            <Link to="/calculator" className="hover:underline">Calculator</Link>
            <Link to="/history" className="hover:underline">History</Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto p-6">
        <Routes>
          <Route path="/" element={<CalculatorPage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </main>
    </div>
  );
}
