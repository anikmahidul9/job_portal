/* eslint-disable react/prop-types */
import { useState } from 'react';
import { toast } from 'sonner';

const PaymentModal = ({ amount, onSuccess, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState('bKash');
  const [paymentNumber, setPaymentNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Payment verified successfully');
      onSuccess();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Complete Payment</h2>
        <p className="mb-4">You need to pay {amount} TK to post this job.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="bKash">bKash</option>
              <option value="Nagad">Nagad</option>
              <option value="Card">Credit/Debit Card</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              {paymentMethod === 'Card' ? 'Card Number' : `${paymentMethod} Number`}
            </label>
            <input
              type="text"
              value={paymentNumber}
              onChange={(e) => setPaymentNumber(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder={`Enter ${paymentMethod} number`}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Transaction ID</label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter transaction ID"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#36A853] text-white rounded-md hover:bg-green-600 disabled:opacity-50"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Confirm Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;