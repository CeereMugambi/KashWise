import { Product } from '../../app/models/product.model';

export const MOCK_PRODUCTS: Product[] = [
    {
        id: 1,
        productName: 'Wireless Headphones',
        quantity: 45,
        price: 500,
        entryDate: '2024-01-15',
        imageUrl: 'assets/product-images/wireless-headphones.jpeg'
      },
      {
        id: 2,
        productName: 'Mechanical Keyboard',
        quantity: 30,
        price: 2290,
        entryDate: '2024-02-10',
        imageUrl: 'assets/product-images/mechanical-keyboard.jpeg'
      },
      {
        id: 3,
        productName: 'USB-C Hub',
        quantity: 100,
        price: 2500,
        entryDate: '2024-03-05',
        imageUrl: 'assets/product-images/USB_C-hub.jpeg'
      },
      {
        id: 4,
        productName: 'Webcam',
        quantity: 20,
        price: 1200,
        entryDate: '2024-03-18',
        imageUrl: 'assets/product-images/webcam.jpeg'
      },
      {
        id: 5,
        productName: 'Monitor Stand',
        quantity: 60,
        price: 2300,
        entryDate: '2024-04-01',
        imageUrl: 'assets/product-images/monitor-stand.avif'
      }
];