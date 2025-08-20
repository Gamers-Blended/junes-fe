import React from "react";
import { Link } from "react-router-dom";
import { formatFullPlatformName } from "../utils/utils";

interface BreadcrumbProps {
  selectedPlatform?: string;
  selectedCategory?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ selectedPlatform, selectedCategory }) => {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        <li className="breadcrumb-item">
          <Link to="/" className="breadcrumb-link">
            Home
          </Link>
        </li>

        {selectedPlatform && (
          <>
            <li className="breadcrumb-separator" aria-hidden="true">
              /
            </li>
            <li className="breadcrumb-item">
              <Link
                to={`/products/listings/${selectedPlatform}`}
                className="breadcrumb-link"
              >
                {formatFullPlatformName(selectedPlatform) + ' ' + (selectedCategory ? `${selectedCategory}` : '')}
              </Link>
            </li>
          </>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
