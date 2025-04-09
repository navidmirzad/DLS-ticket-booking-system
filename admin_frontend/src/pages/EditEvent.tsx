import { useParams } from "react-router-dom";

const EditEvent = () => {
  const { id } = useParams();
  return <h2 className="text-xl font-bold">Editing Event: {id}</h2>;
};

export default EditEvent;
