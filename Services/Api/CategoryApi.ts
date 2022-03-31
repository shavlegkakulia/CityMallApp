import axios from 'axios';
import env from '../../config/env';

export interface IObjectTypes {
    id: number,
    name: string
}

export interface IMainCategories {
    id: number,
    name: string,
    objectTypeId: number,
    objectTypeName: string,
    subCategories: string | string[]
}

export const GetObjectTypes = async () => {
    return await axios.get<IObjectTypes[]>(`${env.API_URL}/api/Category/GetObjectTypes`);
};

export const GetMainCategories = async (data: Array<number>) => {
    let queryParams = '';
    if(data.length) {
        queryParams = data.map((el: number) => `ObjectTypes=${el}`).join('&');
        queryParams = `?${queryParams}`
    };

    return await axios.get<IMainCategories[]>(`${env.API_URL}/api/Category/Get${queryParams}`);
};

export const GetSubCategories = async (data: Array<number>) => {
    
    let queryParams = '';
    if(data.length) {
        queryParams = data.map((el: number) => `ObjectTypes=${el}`).join('&');
        queryParams = `?${queryParams}`
    };
    return await axios.get<IMainCategories[]>(`${env.API_URL}/api/Category/GetSubCategories${queryParams}`);
};

