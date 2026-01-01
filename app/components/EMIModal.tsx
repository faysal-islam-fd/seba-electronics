'use client';

import { useState, useEffect } from 'react';
import { FiX, FiChevronRight, FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface EMIOption {
  months: number;
  convenienceFee: number;
  monthlyPayment: number;
}

interface BankEMI {
  id: string;
  name: string;
  logo?: string;
  options: EMIOption[];
}

interface EMIModalProps {
  isOpen: boolean;
  onClose: () => void;
  productPrice: number;
}

const getBanks = (productPrice: number): BankEMI[] => {
  const calculateEMI = (price: number, months: number, feePercent: number) => {
    const feeAmount = (price * feePercent) / 100;
    const total = price + feeAmount;
    return total / months;
  };

  return [
    {
      id: 'sheba-ebl',
      name: 'Sheba EBL Mastercard',
      options: [
        { months: 3, convenienceFee: 0, monthlyPayment: calculateEMI(productPrice, 3, 0) },
        { months: 6, convenienceFee: 0, monthlyPayment: calculateEMI(productPrice, 6, 0) },
        { months: 9, convenienceFee: 5, monthlyPayment: calculateEMI(productPrice, 9, 5) },
        { months: 12, convenienceFee: 6, monthlyPayment: calculateEMI(productPrice, 12, 6) },
        { months: 18, convenienceFee: 8, monthlyPayment: calculateEMI(productPrice, 18, 8) },
      ],
    },
    {
      id: 'city-bank',
      name: 'City Bank',
      options: [
        { months: 3, convenienceFee: 0, monthlyPayment: calculateEMI(productPrice, 3, 0) },
        { months: 6, convenienceFee: 0, monthlyPayment: calculateEMI(productPrice, 6, 0) },
        { months: 9, convenienceFee: 5, monthlyPayment: calculateEMI(productPrice, 9, 5) },
        { months: 12, convenienceFee: 6, monthlyPayment: calculateEMI(productPrice, 12, 6) },
      ],
    },
    {
      id: 'brac-bank',
      name: 'BRAC Bank',
      options: [
        { months: 3, convenienceFee: 0, monthlyPayment: calculateEMI(productPrice, 3, 0) },
        { months: 6, convenienceFee: 0, monthlyPayment: calculateEMI(productPrice, 6, 0) },
        { months: 12, convenienceFee: 6, monthlyPayment: calculateEMI(productPrice, 12, 6) },
      ],
    },
    {
      id: 'eastern-bank',
      name: 'Eastern Bank',
      options: [
        { months: 3, convenienceFee: 0, monthlyPayment: calculateEMI(productPrice, 3, 0) },
        { months: 6, convenienceFee: 0, monthlyPayment: calculateEMI(productPrice, 6, 0) },
        { months: 9, convenienceFee: 5, monthlyPayment: calculateEMI(productPrice, 9, 5) },
      ],
    },
    {
      id: 'southeast-bank',
      name: 'Southeast Bank',
      options: [
        { months: 3, convenienceFee: 0, monthlyPayment: calculateEMI(productPrice, 3, 0) },
        { months: 6, convenienceFee: 0, monthlyPayment: calculateEMI(productPrice, 6, 0) },
      ],
    },
    {
      id: 'ucb',
      name: 'United Commercial Bank',
      options: [
        { months: 3, convenienceFee: 0, monthlyPayment: calculateEMI(productPrice, 3, 0) },
        { months: 6, convenienceFee: 0, monthlyPayment: calculateEMI(productPrice, 6, 0) },
        { months: 12, convenienceFee: 6, monthlyPayment: calculateEMI(productPrice, 12, 6) },
      ],
    },
    {
      id: 'trust-bank',
      name: 'Trust Bank',
      options: [
        { months: 3, convenienceFee: 0, monthlyPayment: calculateEMI(productPrice, 3, 0) },
        { months: 6, convenienceFee: 0, monthlyPayment: calculateEMI(productPrice, 6, 0) },
      ],
    },
    {
      id: 'lankabangla',
      name: 'LankaBangla Finance',
      options: [
        { months: 3, convenienceFee: 0, monthlyPayment: calculateEMI(productPrice, 3, 0) },
        { months: 6, convenienceFee: 0, monthlyPayment: calculateEMI(productPrice, 6, 0) },
        { months: 9, convenienceFee: 5, monthlyPayment: calculateEMI(productPrice, 9, 5) },
        { months: 12, convenienceFee: 6, monthlyPayment: calculateEMI(productPrice, 12, 6) },
      ],
    },
    {
      id: 'mtb',
      name: 'Mutual Trust Bank',
      options: [
        { months: 3, convenienceFee: 0, monthlyPayment: calculateEMI(productPrice, 3, 0) },
        { months: 6, convenienceFee: 0, monthlyPayment: calculateEMI(productPrice, 6, 0) },
      ],
    },
  ];
};

export default function EMIModal({ isOpen, onClose, productPrice }: EMIModalProps) {
  const [selectedBank, setSelectedBank] = useState('sheba-ebl');
  const [expandedEMI, setExpandedEMI] = useState<number | null>(0);

  // Reset to first bank when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedBank('sheba-ebl');
      setExpandedEMI(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const banks = getBanks(productPrice);
  const selectedBankData = banks.find((bank) => bank.id === selectedBank) || banks[0];

  const calculateTotal = (option: EMIOption) => {
    const convenienceFeeAmount = (productPrice * option.convenienceFee) / 100;
    return productPrice + convenienceFeeAmount;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-2 sm:p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg sm:rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b flex-shrink-0">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">EMI Details</h2>
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="text-orange-600 font-semibold hover:underline text-xs sm:text-sm">T&C</button>
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
            >
              <FiX size={18} className="sm:w-5 sm:h-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-0">
          {/* Left Sidebar - Banks */}
          <div className="w-full md:w-64 border-r md:border-r md:border-b-0 border-b bg-gray-50 overflow-x-auto md:overflow-y-auto flex-shrink-0 md:flex-shrink">
            <div className="p-2 flex md:flex-col gap-2 md:gap-0">
              {banks.map((bank) => (
                <button
                  key={bank.id}
                  onClick={() => {
                    setSelectedBank(bank.id);
                    setExpandedEMI(0);
                  }}
                  className={`flex-shrink-0 md:w-full flex items-center justify-between p-2.5 sm:p-3 rounded-lg mb-0 md:mb-1 transition-colors ${selectedBank === bank.id
                      ? 'bg-white border-l-4 border-orange-500 shadow-sm'
                      : 'hover:bg-white/50 border-l-4 border-transparent'
                    }`}
                >
                  <span className="text-xs sm:text-sm font-medium text-gray-900 text-left">{bank.name}</span>
                  {selectedBank === bank.id && <FiChevronRight className="text-orange-500 flex-shrink-0 ml-2" size={14} />}
                </button>
              ))}
            </div>
          </div>

          {/* Right Content - EMI Options */}
          <div className="flex-1 overflow-y-auto bg-white min-h-0">
            <div className="p-3 sm:p-4 md:p-6">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-4 sm:mb-6">{selectedBankData.name}</h3>
              <div className="space-y-2 sm:space-y-3">
                {selectedBankData.options.map((option, index) => {
                  const isExpanded = expandedEMI === index;
                  const totalAmount = calculateTotal(option);
                  const convenienceFeeAmount = (productPrice * option.convenienceFee) / 100;

                  return (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedEMI(isExpanded ? null : index)}
                        className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 hover:bg-gray-50 transition-colors gap-2 sm:gap-0"
                      >
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-left">
                          <span className="font-semibold text-sm sm:text-base text-gray-900">
                            {option.months} EMIs
                          </span>
                          <span className="hidden sm:inline text-sm text-gray-600">
                            |
                          </span>
                          <span className="text-xs sm:text-sm text-gray-600">
                            Fee ({option.convenienceFee}%)
                          </span>
                          <span className="font-semibold text-sm sm:text-base text-gray-900 w-full sm:w-auto">
                            ৳{option.monthlyPayment.toFixed(2)}/m
                          </span>
                        </div>
                        {isExpanded ? (
                          <FiChevronUp className="text-gray-500 flex-shrink-0 self-end sm:self-auto" size={18} />
                        ) : (
                          <FiChevronDown className="text-gray-500 flex-shrink-0 self-end sm:self-auto" size={18} />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="px-3 sm:px-4 pb-3 sm:pb-4 bg-gray-50 border-t border-gray-200">
                          <div className="pt-3 sm:pt-4 space-y-2">
                            <div className="flex justify-between text-xs sm:text-sm">
                              <span className="text-gray-600">Price:</span>
                              <span className="font-semibold text-gray-900">
                                ৳{productPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            </div>
                            <div className="flex justify-between text-xs sm:text-sm">
                              <span className="text-gray-600">Convenience Fee:</span>
                              <span className="font-semibold text-gray-900">
                                ৳{convenienceFeeAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            </div>
                            <div className="flex justify-between text-xs sm:text-sm pt-2 border-t border-gray-300">
                              <span className="font-semibold text-gray-900">Total Amount Payable:</span>
                              <span className="font-bold text-gray-900">
                                ৳{totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

