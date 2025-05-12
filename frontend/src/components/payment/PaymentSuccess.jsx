// import { useParams, useNavigate } from 'react-router-dom';
// import { useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import axios from 'axios';
// import { USER_API_ENDPOINT } from '@/utils/constant';
// import { toast } from 'sonner';


// const PaymentSuccess = () => {
//   const { tran_id } = useParams();
//   const navigate = useNavigate();


//   useEffect(() => {
//     const verifyPayment = async () => {
//       try {
//         await axios.post(`${USER_API_ENDPOINT}payment/success/${tran_id}`);
//         toast({
//           title: 'Payment Successful',
//           description: 'Your payment has been processed successfully',
//         });
//       } catch (error) {
//         console.error('Verification error:', error);
//         toast({
//           title: 'Verification Failed',
//           description: 'Could not verify your payment',
//           variant: 'destructive',
//         });
//         navigate('/payment/failed');
//       }
//     };

//     if (tran_id) {
//       verifyPayment();
//     } else {
//       navigate('/');
//     }
//   }, [tran_id, navigate, toast]);

//   return (
    // <div className="flex flex-col items-center justify-center min-h-screen p-4">
    //   <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
    //     <svg
    //       className="w-16 h-16 text-green-500 mx-auto mb-4"
    //       fill="none"
    //       stroke="currentColor"
    //       viewBox="0 0 24 24"
    //       xmlns="http://www.w3.org/2000/svg"
    //     >
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth={2}
    //         d="M5 13l4 4L19 7"
    //       />
    //     </svg>
    //     <h1 className="text-2xl font-bold mb-2">Payment Successful</h1>
    //     <p className="text-gray-600 mb-6">
    //       Thank you for your payment. Your transaction ID: {tran_id}
    //     </p>
    //     <Button onClick={() => navigate('/dashboard')}>
    //       Return to Dashboard
    //     </Button>
    //   </div>
    // </div>
//   );
// };

// export default PaymentSuccess;


import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../ui/button';


const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const tran_id = searchParams.get('tran_id');
  const navigate = useNavigate();
  
  console.log(tran_id)


  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
    <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
      <svg
        className="w-16 h-16 text-green-500 mx-auto mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
      <h1 className="text-2xl font-bold mb-2">Payment Successful</h1>
      <p className="text-gray-600 mb-6">
        Thank you for your payment. Your transaction ID: {tran_id}
      </p>
      <Button onClick={() => navigate('/recruiter/dashboard')}>
        Return to Dashboard
      </Button>
    </div>
  </div>
  );
};

export default PaymentSuccess;
