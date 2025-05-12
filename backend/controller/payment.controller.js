import { Payment } from "../models/payment.model.js";
import SSLCommerzPayment from 'sslcommerz-lts';

const store_id = process.env.SSLCOMMERZ_STORE_ID;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
const is_live = false; //true for live, false for sandbox

export const initPayment = async (req, res) => {
    try {
        const { amount, currency } = req.body;
        
        // Validate required fields
        if (!amount) {
            return res.status(400).json({ success: false, message: 'Amount is required' });
        }

        // Get userId from authenticated user or request body
        const userId = req.user?._id || req.body.userId;
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }

        const tran_id = `TXN${Date.now()}`; // Define tran_id first

        const data = {
            total_amount: String(amount),
            currency: String(currency || 'BDT'),
            tran_id: tran_id,
            // success_url: `http://localhost:8000/api/v1/payment/success?tran_id=${tran_id}`,
            success_url: `https:https://job-portal-kc3x.onrender.com/api/v1/payment/success?tran_id=${tran_id}`,
            // fail_url: `http://localhost:5173/payment/failed?tran_id=${tran_id}`,
            fail_url: `https://job-portal-swart-zeta.vercel.app/payment/failed?tran_id=${tran_id}`,
            // cancel_url: `http://localhost:5173/payment/cancelled?tran_id=${tran_id}`,
            cancel_url: `https://job-portal-swart-zeta.vercel.app/payment/cancelled?tran_id=${tran_id}`,
            // ipn_url: `http://localhost:8000/api/v1/payment/ipn`,
            ipn_url: `https://job-portal-kc3x.onrender.com/api/v1/payment/ipn`,
            shipping_method: 'NO',
            product_name: 'Job Posting',
            product_category: 'Service',
            product_profile: 'general',
            cus_name: String(req.user?.name || 'Customer'),
            cus_email: String(req.user?.email || 'customer@example.com'),
            cus_add1: 'N/A',
            cus_city: 'N/A',
            cus_country: 'Bangladesh',
            cus_phone: String(req.user?.phoneNumber || '01700000000'),
            shipping_name: 'N/A',
            multi_card_name: 'internetbank,mobilebank',
            value_a: String(userId),
            value_b: "N/A",
            value_c: 'job_portal_payment',
        };

        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
        const apiResponse = await sslcz.init(data);

        // Save payment info to database
        const payment = new Payment({
            tran_id: data.tran_id,
            amount: data.total_amount,
            currency: data.currency,
            user: userId,
            status: 'Pending',
            payment_data: apiResponse,
        });

        await payment.save();

        res.status(200).json({
            success: true,
            payment_url: apiResponse.GatewayPageURL,
            tran_id: tran_id // Return tran_id for reference
        });
    } catch (error) {
        console.error('Payment initiation error:', error);
        res.status(500).json({
            success: false,
            message: 'Payment initiation failed',
            error: error.message,
        });
    }
};

export const paymentSuccess = async (req, res) => {
    try {
        const { tran_id } = req.query;
        
        if (!tran_id) {
            return res.status(400).json({ success: false, message: 'Transaction ID is required' });
        }

        const updatedPayment = await Payment.findOneAndUpdate(
            { tran_id },
            { 
                status: 'Success',
                payment_date: new Date() 
            },
            { new: true }
        );

        if (!updatedPayment) {
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }

        // const frontendUrl = `http://localhost:5173/payment/success?tran_id=${tran_id}`;
        const frontendUrl =`https://job-portal-swart-zeta.vercel.app/payment/success?tran_id=${tran_id}`;
        return res.redirect(302, frontendUrl);
    } catch (error) {
        console.error('Payment success error:', error);
        // res.redirect(`http://localhost:5173/payment/failed?error=${encodeURIComponent(error.message)}`);
        res.redirect(`https://job-portal-swart-zeta.vercel.app/payment/failed?error=${encodeURIComponent(error.message)}`);
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { tran_id } = req.body;
        
        if (!tran_id) {
            return res.status(400).json({ success: false, message: 'Transaction ID is required' });
        }

        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
        const validation = await sslcz.validate({ val_id: tran_id });

        if (validation.status === 'VALID') {
            await Payment.findOneAndUpdate(
                { tran_id },
                { 
                    status: 'Success',
                    payment_date: new Date(),
                    bank_tran_id: validation.bank_tran_id,
                    card_type: validation.card_type
                }
            );
            return res.json({ success: true, data: validation });
        }
        
        return res.status(400).json({ 
            success: false, 
            message: 'Payment validation failed' 
        });
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

export const paymentIPN = async (req, res) => {
    try {
        const { tran_id, val_id } = req.body;
        
        if (!tran_id || !val_id) {
            return res.status(400).json({ error: 'Transaction ID and Validation ID are required' });
        }

        const payment = await Payment.findOne({ tran_id });
        if (!payment) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
        const validation = await sslcz.validate({ val_id });

        if (validation.status === 'VALID') {
            await Payment.findOneAndUpdate(
                { tran_id },
                {
                    status: 'Success',
                    bank_tran_id: validation.bank_tran_id,
                    card_type: validation.card_type,
                    payment_date: new Date()
                }
            );
            
            // Add your business logic here (e.g., update job posting status)
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('IPN error:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};