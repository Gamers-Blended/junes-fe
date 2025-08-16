import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetailsPage: React.FC = () => {

    const { slug } = useParams();

    return (
        <div>
            <h1>Product Details for {slug}</h1>
        </div>
    );
}

export default ProductDetailsPage;