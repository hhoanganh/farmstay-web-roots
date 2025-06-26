
import { useParams } from "react-router-dom";

const Tree = () => {
  const { treeId } = useParams();
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold">Tree: {treeId}</h1>
    </div>
  );
};

export default Tree;
