import axios from 'axios';
import httpStatus from 'http-status';
import config from '../../../config';
import ApiError from '../../../errors/apiError';
import { IIpnResponse, ISSLCommerzInitPaymentRequest, ISSLCommerzPaymentGatewayResponse } from './ssl.interface';


const initPayment = async (
    data: ISSLCommerzInitPaymentRequest
): Promise<ISSLCommerzPaymentGatewayResponse> => {
    try {
        const payload = {
            store_id: config.ssl.storeId,
            store_passwd: config.ssl.storePass,
            total_amount: data.amount,
            currency: 'BDT',
            tran_id: data.transactionId,
            product_category: 'Academic Payment',
            success_url: config.ssl.successUrl + `&tnxId=${data.transactionId}`,
            fail_url: config.ssl.failedUrl,
            cancel_url: config.ssl.cancelUrl,
            cus_name: data?.customerName,
            cus_email: data?.customerEmail,
            cus_add1: data?.customerAddress,
            cus_city: data?.customerCity,
            cus_postcode: 'N/A',
            cus_country: data?.customerCountry,
            cus_phone: data?.customerPhoneNumber,
            product_name: data?.productName,
            product_profile: data?.productProfile,
            shipping_method: data?.shippingMethod,
            num_of_item: 1
        };

        const opts = {
            method: 'post',
            url: config.ssl.paymentApi,
            data: payload,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        };

        const response = await axios(opts);

        return response.data;
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'SSLCommerz Payment Error');
    }
};

const validate = async (data: IIpnResponse) => {
    try {
        const opts = {
            method: 'GET',
            url: `${config.ssl.validationApi}?val_id=${data.val_id}&store_id=${config.ssl.storeId}&store_passwd=${config.ssl.storePass}&format=json`
        };

        const response = await axios(opts);

        return response.data;
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'SSLCommerz Payment Error');
    }
};

export const SslService = {
    initPayment,
    validate
};