import { Address } from "../types/address";
import { PaymentMethod } from "../types/paymentMethod";

interface SavedItemCardActionContentProps {
  item: Address | PaymentMethod;
  onEdit: () => void;
  onRemove: () => void;
  onSetDefault: () => void;
}

const SavedItemCardActionContent: React.FC<SavedItemCardActionContentProps> = ({
  item,
  onEdit,
  onRemove,
  onSetDefault,
}) => {
  return (
    <div className="card-actions">
      <button className="action-link" onClick={onEdit}>
        Edit
      </button>
      <span className="action-separator">|</span>
      <button className="action-link" onClick={onRemove}>
        Remove
      </button>
      {!item.isDefault && (
        <>
          <span className="action-separator">|</span>
          <button className="action-link" onClick={onSetDefault}>
            Set as Default
          </button>
        </>
      )}
    </div>
  );
};

export default SavedItemCardActionContent;
