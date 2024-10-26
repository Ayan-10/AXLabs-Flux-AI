import { useEffect, useState } from "react";
import {
  LinearProgress,
  Button,
  Card,
  CardContent,
  Typography,
  Collapse,
  dividerClasses,
} from "@mui/material";
import { Loader } from "lucide-react";
// Define a type for each training record
type Training = {
  id: string;
  name: string;
  status: "IN PROGRESS" | "completed";
  images: string[]; // assuming it's an array of image URLs
};

// Define props for the component
type TrainingHistoryProps = {
  userId: string | undefined; // assuming userId is a string
  uploadTrigger: boolean | number; // assuming a boolean or number triggers re-fetch
};

const TrainingHistory: React.FC<TrainingHistoryProps> = ({
  userId,
  uploadTrigger,
}) => {
  const [trainingData, setTrainingData] = useState<Training[]>([]);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({}); // Add type for expanded state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrainingData();
    const interval = setInterval(fetchTrainingData, 5000); // Poll every 5 seconds
    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [userId, uploadTrigger]);

  const fetchTrainingData = async () => {
    try {
      const response = await fetch(`/api/training/history?userId=${userId}`, {
        method: "GET",
      });

      const data = await response.json();
      setTrainingData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching training data:", error);
    }
  };
  const handleToggle = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center">
          <Loader className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : trainingData && trainingData.length > 0 ? (
        <div className="p-4 max-w-xl mx-auto">
          {trainingData.map((training) => (
            <Card
              key={training.id}
              className="shadow-md border rounded-md mb-1 dark:bg-slate-700"
            >
              <CardContent>
                <div className="flex justify-between items-center">
                  <Typography variant="h6" className="pb-3 dark:text-white">
                    {training.name}
                  </Typography>
                  {/* <Typography
                    variant="body2"
                    color={training.status === "completed" ? "green" : "orange"}
                  >
                    {training.status}
                  </Typography> */}
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded ms-3 ${
                      training.status.toLowerCase() === "in progress"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-200"
                        : training.status.toLowerCase() === "completed"
                        ? "bg-green-100 text-green-800 dark:bg-gren-200"
                        : "bg-red-100 text-red-800 dark:bg-red-200"
                    }`}
                  >
                    {training.status}
                  </span>
                </div>

                <Button
                  variant="contained"
                  onClick={() => handleToggle(training.id)}
                  style={{
                    backgroundColor: "#6b21a8",
                  }}
                >
                  {expanded[training.id] ? "Collapse" : "Show Images"}
                </Button>
                <Collapse in={expanded[training.id]}>
                  <div className="mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {/* {console.log(training.images)} */}
                      {training.images.map((imageUrl, index) => (
                        <img
                          key={index}
                          src={imageUrl}
                          alt={`Training Image ${index}`}
                          className="w-full h-24 object-cover rounded-md"
                        />
                      ))}
                    </div>
                  </div>
                </Collapse>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <h2>no history</h2>
        </div>
      )}
    </div>
  );
};

export default TrainingHistory;
