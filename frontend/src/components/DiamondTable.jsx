import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

export default function DiamondTable() {
  const [diamonds, setDiamonds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiamonds = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/diamonds");
        setDiamonds(res.data.items);
      } catch (error) {
        console.error("Error fetching diamonds:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDiamonds();
  }, []);

  if (loading) return <p>Loading diamonds...</p>;

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Diamond Price List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shape</TableHead>
                <TableHead>Size Range</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Clarity</TableHead>
                <TableHead>Carat Price ($)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {diamonds.map((d, index) => (
                <TableRow key={index}>
                  <TableCell>{d.shape}</TableCell>
                  <TableCell>
                    {d.lowSize && d.highSize ? `${d.lowSize} - ${d.highSize}` : "-"}
                  </TableCell>

                  <TableCell>{d.color}</TableCell>
                  <TableCell>{d.clarity}</TableCell>
                  <TableCell>{d.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
