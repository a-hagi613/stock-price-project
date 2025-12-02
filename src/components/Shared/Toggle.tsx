import { useId } from 'react';

interface ToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

/**
 * Toggle - Reusable switch component
 * Features:
 * - Green when on, gray when off
 * - Disabled state support
 * - Accessible keyboard navigation
 * - Optional description text
 */
const Toggle = ({ value, onChange, label, description, disabled = false }: ToggleProps) => {
  const autoId = useId();
  const toggleId = label
    ? `toggle-${label.replace(/\s+/g, '-').toLowerCase()}`
    : `toggle-${autoId}`;

  // If no label, just return the switch
  if (!label) {
    return (
      <button
        id={toggleId}
        type="button"
        role="switch"
        aria-checked={value}
        disabled={disabled}
        onClick={() => !disabled && onChange(!value)}
        className={`
          relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-all
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          ${value ? 'bg-blue-600' : 'bg-gray-300'}
        `}
      >
        <span
          className={`
            inline-block h-5 w-5 transform rounded-full transition-all shadow-sm
            bg-white
            ${value ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
      <div className="flex-1 pr-4">
        <label
          htmlFor={toggleId}
          className={`block text-sm font-medium ${
            disabled ? 'text-gray-400' : 'text-gray-900'
          }`}
        >
          {label}
        </label>
        {description && (
          <p className={`text-xs mt-1 ${disabled ? 'text-gray-300' : 'text-gray-500'}`}>
            {description}
          </p>
        )}
      </div>

      <button
        id={toggleId}
        type="button"
        role="switch"
        aria-checked={value}
        disabled={disabled}
        onClick={() => !disabled && onChange(!value)}
        className={`
          relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-all
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          ${value ? 'bg-blue-600' : 'bg-gray-300'}
        `}
      >
        <span
          className={`
            inline-block h-5 w-5 transform rounded-full transition-all shadow-sm
            bg-white
            ${value ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
};

export default Toggle;
