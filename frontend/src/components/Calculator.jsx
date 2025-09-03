import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const SHAPES = ["Round", "Pear"];
const COLORS = ["D","E","F","G","H","I","J","K","L","M","N"];
const CLARITIES = ["IF","VVS1","VVS2","VS1","VS2","SI1","SI2","SI3","I1","I2","I3"];

export default function Calculator() {
  const [shape, setShape] = useState("Round");
  const [color, setColor] = useState("D");
  const [clarity, setClarity] = useState("IF");
  const [discount, setDiscount] = useState(0);
  const [caratWeight, setCaratWeight] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    if (!caratWeight) {
      alert("Enter carat weight");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/calculate", {
        shape,
        color,
        clarity,
        discount,
        caratWeight: parseFloat(caratWeight)
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error calculating price");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-lg mx-auto shadow-md">
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold">Price Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Shape Dropdown */}
        <div>
          <label className="font-semibold block mb-2">Shape</label>
          <select
            value={shape}
            onChange={(e) => setShape(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            {SHAPES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Color Buttons */}
        <div>
          <label className="font-semibold block mb-2">Color</label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <Button
                key={c}
                variant={color === c ? "default" : "outline"}
                onClick={() => setColor(c)}
                size="sm"
              >
                {c}
              </Button>
            ))}
          </div>
        </div>

        {/* Clarity Buttons */}
        <div>
          <label className="font-semibold block mb-2">Clarity</label>
          <div className="flex flex-wrap gap-2">
            {CLARITIES.map((cl) => (
              <Button
                key={cl}
                variant={clarity === cl ? "default" : "outline"}
                onClick={() => setClarity(cl)}
                size="sm"
              >
                {cl}
              </Button>
            ))}
          </div>
        </div>

        {/* Discount Input */}
        <div>
          <label className="block font-semibold mb-1">Discount %</label>
          <Input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />
        </div>

        {/* Carat Weight Input */}
        <div>
          <label className="block font-semibold mb-1">Carat Weight</label>
          <Input
            type="number"
            value={caratWeight}
            onChange={(e) => setCaratWeight(e.target.value)}
          />
        </div>

        {/* Calculate Button */}
        <Button
          onClick={handleCalculate}
          className="w-full"
          disabled={loading}
        >
          {loading ? "Calculating..." : "CALCULATE"}
        </Button>

        {/* Result */}
        {result && (
          <div className="mt-6 bg-gray-50 p-4 rounded text-center space-y-2">
            {result.message ? (
              <p className="text-red-600">{result.message}</p>
            ) : (
              <>
                <p><strong>Base Price:</strong> ${result.basePrice}</p>
                <p><strong>New Price per Carat:</strong> ${result.newPricePerCarat}</p>
                <p><strong>Final Amount:</strong> ${result.finalAmount}</p>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
