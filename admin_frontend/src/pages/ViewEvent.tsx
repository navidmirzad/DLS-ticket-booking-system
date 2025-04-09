import { useParams } from "react-router-dom";

const ViewEvent = () => {
  const { id } = useParams();
  return <h2 className="text-xl font-bold">Viewing Event: {id}</h2>;
};

export default ViewEvent;
