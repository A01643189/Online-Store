import { useConfirmation } from '../hooks/useConfirmation';
import { useCallback } from 'react';

type DeleteButtonProps = {
  onDelete: () => void;
  className?: string; 
};

export const DeleteButton = ({ onDelete, className = 'delete-button' }: DeleteButtonProps) => {
  const { confirm, Confirmation } = useConfirmation();

  const handleDelete = useCallback(async () => {
    try {
      await onDelete();
      // Optional: Show success message
    } catch (error) {
      console.error('Delete failed:', error);
      // Optional: Show error message
    }
  }, [onDelete]);

  const showConfirmation = useCallback(() => {
    confirm({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this item?',
      confirmText: 'Delete',
      variant: 'danger',
      onConfirm: handleDelete,
    });
  }, [confirm, handleDelete]);

  return (
    <>
      <button className={className} onClick={showConfirmation}>
        Delete
      </button>
      <Confirmation />
    </>
  );
};
