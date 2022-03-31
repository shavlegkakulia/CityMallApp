

export interface Vouchers{
    id: number,
    amount: number,
    percent: string,
    text: string,
    amountText: string,
    image: string,
    more: string,
    icon: string,
}

export default [
    {
        id: 1,
        amount: 15,
        percent: '%',
        text: 'ვადა: 15 სექტ - 20 სექტ',
        amountText: 'რაოდენობა: 2',
        image: require('../assets/images/H&M.png'),
        more: 'ვრცლად',
        icon: require('../assets/images/Polygon.png'),
      },
      {
        id: 2,
        amount: 20,
        percent: '%',
        text: 'ვადა: 15 სექტ - 20 სექტ',
        amountText: 'რაოდენობა: 2',
        image: require('../assets/images/H&M.png'),
        more: 'ვრცლად',
        icon: require('../assets/images/Polygon.png'),
      },
      {
        id: 3,
        amount: 10,
        percent: '%',
        text: 'ვადა: 15 სექტ - 20 სექტ',
        amountText: 'რაოდენობა: 2',
        image: require('../assets/images/H&M.png'),
        more: 'ვრცლად',
        icon: require('../assets/images/Polygon.png'),
      },
]

