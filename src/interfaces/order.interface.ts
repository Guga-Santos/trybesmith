export default interface IOrder {
  id: number,
  userId: number,
  productsIds: number[],
}

export interface INewOrder {
  productsIds: number[][];
}
