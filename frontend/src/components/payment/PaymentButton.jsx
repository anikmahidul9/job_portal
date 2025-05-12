/* eslint-disable react/prop-types */
import { useState } from 'react';
import axios from 'axios';
import { Button } from '../ui/button';
import { Toaster } from '../ui/sonner';
import { toast } from 'sonner'; // Import toast directly
import { useSelector } from 'react-redux';

const PaymentButton = ({ amount, onClose }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  console.log(user)

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      const response = await axios.post('https://job-portal-kc3x.onrender.com/api/v1/payment/init', {   //'http://localhost:8000/api/v1/payment/init'
        amount,
        userId: user._id, 
        currency: 'BDT',
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data.success) {
        window.location.href = response.data.payment_url;
      } else {
        toast.error('Could not initiate payment');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Complete Payment</h2>
        <p className="mb-4">You need to pay {amount} TK to post this job.</p>
        <div className="flex justify-end space-x-3">

        <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
              disabled={loading}
            >
              Cancel
            </button>
        <Button onClick={handlePayment} disabled={loading} className="px-4 py-2 bg-[#36A853] text-white rounded-md hover:bg-green-600 disabled:opacity-50">
        {loading ? 'Processing...' : `Pay ${amount} BDT`}
      </Button>
      <Toaster position="top-right" /> {/* Render the Toaster */}
          </div>
    </div>
        </div>
        </>
  );
};

export default PaymentButton;