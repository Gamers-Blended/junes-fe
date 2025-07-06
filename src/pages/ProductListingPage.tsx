import { useParams } from "react-router-dom";

const ProductListingPage = () => {
    const { platform } = useParams<{ platform: string }>();

    return (
        <div>
            <h1>
                {platform}
            </h1>
        </div>
    );
};

export default ProductListingPage;