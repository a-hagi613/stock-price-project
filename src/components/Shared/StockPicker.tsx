import { STOCKS } from '../../data/mockData';

interface StockPickerProps {
  value: string;
  onChange: (stockId: string) => void;
  label?: string;
}

const StockPicker = ({ value, onChange, label = 'Select Stock' }: StockPickerProps) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
      >
        <option value="">Choose a stock...</option>
        {STOCKS.map((stock) => {
          const changeSign = stock.change > 0 ? '+' : '';

          return (
            <option key={stock.id} value={stock.id}>
              {stock.id} - {stock.name} | ${stock.price} ({changeSign}
              {stock.change}%)
            </option>
          );
        })}
      </select>

      {/* Display selected stock details */}
      {value && (
        <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
          {(() => {
            const selectedStock = STOCKS.find((s) => s.id === value);
            if (!selectedStock) return null;

            const changeColor =
              selectedStock.change > 0
                ? 'text-green-600'
                : selectedStock.change < 0
                ? 'text-red-600'
                : 'text-gray-600';

            const changeSign = selectedStock.change > 0 ? '+' : '';

            return (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">
                    {selectedStock.id}
                  </p>
                  <p className="text-sm text-gray-600">{selectedStock.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ${selectedStock.price}
                  </p>
                  <p className={`text-sm font-medium ${changeColor}`}>
                    {changeSign}
                    {selectedStock.change}%
                  </p>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default StockPicker;
