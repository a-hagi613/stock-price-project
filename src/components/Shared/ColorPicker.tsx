import { Check } from 'lucide-react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

// Preset color palette
const PRESET_COLORS = [
  { hex: '#3B82F6', name: 'Blue' },
  { hex: '#10B981', name: 'Green' },
  { hex: '#EF4444', name: 'Red' },
  { hex: '#F59E0B', name: 'Amber' },
  { hex: '#8B5CF6', name: 'Purple' },
  { hex: '#EC4899', name: 'Pink' },
];

/**
 * ColorPicker - Preset color swatch selector
 * Features:
 * - 6 preset colors in a grid
 * - Selected color highlighted with border and checkmark
 * - Visual feedback on hover
 */
const ColorPicker = ({ value, onChange, label = 'Choose Color' }: ColorPickerProps) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="grid grid-cols-6 gap-2">
        {PRESET_COLORS.map((color) => {
          const isSelected = value === color.hex;

          return (
            <button
              key={color.hex}
              type="button"
              onClick={() => onChange(color.hex)}
              className={`
                relative w-full aspect-square rounded-lg transition-all
                ${isSelected ? 'ring-2 ring-offset-2 ring-gray-900 scale-110' : 'hover:scale-105'}
              `}
              style={{ backgroundColor: color.hex }}
              aria-label={`Select ${color.name}`}
              title={color.name}
            >
              {isSelected && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Check className="w-5 h-5 text-white drop-shadow-lg" strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Display selected color name */}
      {value && (
        <p className="text-sm text-gray-600 mt-2">
          Selected:{' '}
          <span className="font-medium">
            {PRESET_COLORS.find((c) => c.hex === value)?.name || 'Custom'}
          </span>
        </p>
      )}
    </div>
  );
};

export default ColorPicker;
