import axios from 'axios';
import env from '../../config/env';



export interface IVoucherClientCategories {
    clientCategory: number,
    voucherCode: string
}

export interface IVoucherMerchants {
    voucherCode: string,
    merchantID: string,
    id: number,
    createDate: string,
    isActive: number,
    logo: string,
    merchantName: string
}

export interface IVouchers {
    voucherID: number,
    voucherCode: string,
    voucherDescription: string,
    voucherSegmentID: number,
    centre: number,
    voucherStartDate: string,
    voucherEndDate: string,
    voucherPerMerchant: number,
    numberOfVouchers: number,
    createDate: string,
    discountPercentage: number,
    amount: number,
    sqlScript: string,
    isActive: number,
    voucherPurchasePoints: number,
    voucherVolume: number,
    userID: number,
    merchants: IVoucherMerchants[],
    clientCategories?: IVoucherClientCategories[],
}

export interface IBuyVoucherRequest {
    voucherCode: string,
    card: string
}

export interface IBuyVoucherResponse {
    data: string,
    success: boolean,
    error: {
        errorDesc: string,
        errorCode: string
    }
}


export const GetClientVouchers = async () => {
    return await axios.get<IVouchers[]>(`${env.API_URL}/api/Clients/GetClientVouchers`);
};

export const GetVouchersToBuy = async () => {
    return await axios.get<IVouchers[]>(`${env.API_URL}/api/Voucher/GetVouchersToBuy`);
}

export const BuyVoucher = async (data: IBuyVoucherRequest) => {
    return await axios.post<IBuyVoucherResponse>(`${env.API_URL}/api/Voucher/BuyVoucher`, data)
};

