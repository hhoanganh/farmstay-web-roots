
import { useParams } from "react-router-dom";

const Article = () => {
  const { articleName } = useParams();
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold">Article: {articleName}</h1>
    </div>
  );
};

export default Article;
