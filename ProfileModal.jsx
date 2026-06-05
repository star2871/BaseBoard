import { X } from 'lucide-react';

const ProfileModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-surface-secondary p-6 rounded-lg shadow-xl w-full max-w-md border border-border-color">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-text-primary">Edit Profile</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <X size={24} />
          </button>
        </div>
        <div>
          <p className="text-text-secondary">
            Profile editing form will be implemented here.
          </p>
          {/* Example Form Field */}
          <div className="mt-4">
            <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">Name</label>
            <input
              type="text"
              id="name"
              defaultValue="Coach Kim"
              className="w-full bg-surface-primary border border-border-color rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="mt-6 flex justify-end">
            <button onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-text-primary font-bold py-2 px-4 rounded-md mr-2">
              Cancel
            </button>
            <button onClick={onClose} className="bg-primary hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-md">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;