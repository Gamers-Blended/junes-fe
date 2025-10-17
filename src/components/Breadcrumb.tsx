import React from "react";
import { Link } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  path: string;
  state?: any;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items = [] }) => {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {/* Root node: Home */}
        <li className="breadcrumb-item">
          <Link to="/" className="breadcrumb-link">
            Home
          </Link>
        </li>

        {items.map((item, index) => (
          <React.Fragment key={index}>
            <li className="breadcrumb-separator" aria-hidden="true">
              /
            </li>
            <li className="breadcrumb-item">
              <Link
                to={item.path}
                className="breadcrumb-link"
                state={item.state}
              >
                {item.label}
              </Link>
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
