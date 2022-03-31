import axios from 'axios';
import env from '../../config/env';

interface IGetMerchantsResponse {
   currentPage: number,
   pageCount: number,
   pageSize: number,
   rowCount: number,
   data: IMerchant[] 
}

export interface IMerchant {
    merchId: string,
    name: string,
    imageUrl: string,
    logo: string,
    workingHours: string[],
    desctiption: string,
    address: string,
    phone: string,
    categoryNames: string,
    id: number,
    floor: string[],
    orgId: number
}


export const GetMerchants = async(address: number, ObjectTypes:number,  isPremium: boolean, categories: number[], subCategories: number[], page: number) => {
    let CategoriesQuery = '';
    let SubCategoriesQuery = '';
    
    if(categories.length > 0) {
        CategoriesQuery = categories.map((el: number) => `&Categories=${el}`).join('&');
    };

    if(subCategories.length > 0) {
        SubCategoriesQuery = subCategories.map((el: number) => `&SubCategories=${el}`).join('&');
    }
    return await axios.get<IGetMerchantsResponse>(`${env.API_URL}/api/Mobile/GetMerchants?ObjectTypes=${ObjectTypes}&Address=${address}&isPremium=${isPremium}${CategoriesQuery}${SubCategoriesQuery}&Page=${page}&PageSize=16`);
}