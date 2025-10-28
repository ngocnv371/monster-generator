import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonClass = 'bg-purple-600 hover:bg-purple-700',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={onCancel}>
      <div 
        className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-sm border border-purple-500/30 p-6 flex flex-col gap-4"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          {title}
        </h2>
        <p className="text-gray-300">{message}</p>
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white font-semibold transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-white font-semibold transition-colors ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;