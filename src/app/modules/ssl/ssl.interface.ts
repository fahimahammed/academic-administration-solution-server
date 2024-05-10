export interface ISSLCommerzOptions {
    storeId: string;
    storePassword: string;
    basePaymentUrl: string;
    basePaymentValidationUrl: string;
}

export interface ISSLCommerzInitPaymentRequest {
    amount: number;
    transactionId: string;
    customerName: string;
    customerPhoneNumber: string;
    customerEmail: string;
    customerAddress?: string;
    customerCity?: string;
    customerCountry?: string;
    productName?: string;
    productProfile?: string;
    shippingMethod?: string;
}

export interface ISSLCommerzPaymentGatewayResponse {
    status?: string;
    failedreason?: string;
    sessionkey?: string;
    gw?: string;
    GatewayPageURL?: string;
    storeBanner?: string;
    storeLogo?: string;
    desc?: string;
    redirectGatewayURL?: string;
}

export interface IIpnResponse {
    status?: string;
    tran_date?: string;
    tran_id?: string;
    val_id?: string;
    card_type?: string;
    card_no?: string;
    bank_tran_id?: string;
    card_issuer?: string;
    card_brand?: string;
}