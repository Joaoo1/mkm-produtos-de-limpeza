import moment from 'moment';

import SaleController from './SaleController';
import ProductController from './ProductController';
import { SALE_DATE } from '../constants/firestore';

function incrementOneDay(finalDate) {
  const date = new Date(finalDate);
  date.setDate(date.getDate() + 1);
  return moment(date).endOf('day').toDate();
}

const ProductSoldController = {
  async index(dateRange) {
    const sales = await SaleController.index(null, [
      {
        field: SALE_DATE,
        operator: '>=',
        value: moment(dateRange.startDate).startOf('day').toDate(),
      },
      {
        field: SALE_DATE,
        operator: '<',
        /*
         * Because of the way the database works, it is necessary to increment
         * 1 day on the end date and use the operator less than instead of equal
         * to or less than the end date
         */
        value: incrementOneDay(dateRange.finalDate),
      },
    ]);

    const products = await ProductController.index();

    const productsSold = products.map(product => {
      let quantitySold = 0;
      sales.forEach(sale =>
        sale.products.forEach(productSale => {
          if (productSale.parentId === product.id) {
            quantitySold += productSale.quantity;
          }
        })
      );

      return { product: product.name, quantity: quantitySold };
    });

    return productsSold;
  },
};

export default ProductSoldController;
