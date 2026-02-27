import { Product } from '../../app/models/product.model';

export const MOCK_PRODUCTS: Product[] = [

  // Bread
  {
    id: 1,
    productName: 'Supa Loaf White Bread',
    quantity: 80,
    price: 65,
    entryDate: '2024-04-14',
    imageUrl: 'assets/product-images/supa-loaf-white.jpeg',
    category: 'Bread',
    brand: 'Supa Loaf',
    size: '400g',
    breadType: 'White',
    sliced: 'Sliced',
    description: 'Soft sliced white bread'
  },
  {
    id: 2,
    productName: 'Festive Brown Bread',
    quantity: 60,
    price: 75,
    entryDate: '2024-04-14',
    imageUrl: 'assets/product-images/festive-brown.jpeg',
    category: 'Bread',
    brand: 'Festive',
    size: '400g',
    breadType: 'Brown',
    sliced: 'Sliced',
    description: 'Wholesome sliced brown bread'
  },
  {
    id: 3,
    productName: 'Bakers Inn Multigrain',
    quantity: 40,
    price: 90,
    entryDate: '2024-04-14',
    imageUrl: 'assets/product-images/bakers-inn-multigrain.jpeg',
    category: 'Bread',
    brand: 'Bakers Inn',
    size: '500g',
    breadType: 'Multigrain',
    sliced: 'Sliced',
    description: 'Nutritious multigrain bread with seeds'
  },
  {
    id: 4,
    productName: 'Elliots Wholemeal Bread',
    quantity: 35,
    price: 80,
    entryDate: '2024-04-14',
    imageUrl: 'assets/product-images/elliots-wholemeal.jpeg',
    category: 'Bread',
    brand: 'Elliots',
    size: '400g',
    breadType: 'Wholegrain',
    sliced: 'Sliced',
    description: 'Soft wholemeal bread packed with fibre'
  },

  // Dairy
  {
    id: 5,
    productName: 'KCC Full Cream Milk',
    quantity: 150,
    price: 75,
    entryDate: '2024-04-15',
    imageUrl: 'assets/product-images/kcc-full-cream.jpeg',
    category: 'Dairy',
    brand: 'KCC',
    size: '500ml',
    fatContent: 'Full Fat',
    description: 'Fresh full cream pasteurised milk'
  },
  {
    id: 6,
    productName: 'Brookside Low Fat Milk',
    quantity: 120,
    price: 70,
    entryDate: '2024-04-15',
    imageUrl: 'assets/product-images/brookside-low-fat.jpeg',
    category: 'Dairy',
    brand: 'Brookside',
    size: '500ml',
    fatContent: 'Low Fat',
    description: 'Low fat pasteurised milk'
  },
  {
    id: 7,
    productName: 'Tuzo Strawberry Yoghurt',
    quantity: 90,
    price: 120,
    entryDate: '2024-04-15',
    imageUrl: 'assets/product-images/tuzo-strawberry.jpeg',
    category: 'Dairy',
    brand: 'Tuzo',
    size: '250ml',
    fatContent: 'Full Fat',
    description: 'Creamy strawberry flavoured yoghurt'
  },
  {
    id: 8,
    productName: 'Daima Butter',
    quantity: 70,
    price: 200,
    entryDate: '2024-04-15',
    imageUrl: 'assets/product-images/daima-butter.jpeg',
    category: 'Dairy',
    brand: 'Daima',
    size: '250g',
    fatContent: 'Full Fat',
    description: 'Creamy salted butter'
  },

  // Beverages
  {
    id: 9,
    productName: 'Coca-Cola 300ml',
    quantity: 300,
    price: 80,
    entryDate: '2024-04-12',
    imageUrl: 'assets/product-images/coca-cola.jpeg',
    category: 'Beverages',
    brand: 'Coca-Cola',
    size: '300ml',
    description: 'Classic Coca-Cola soft drink'
  },
  {
    id: 10,
    productName: 'Fanta Orange 300ml',
    quantity: 280,
    price: 80,
    entryDate: '2024-04-12',
    imageUrl: 'assets/product-images/fanta-orange.jpeg',
    category: 'Beverages',
    brand: 'Fanta',
    size: '300ml',
    description: 'Refreshing orange flavoured soft drink'
  },
  {
    id: 11,
    productName: 'Quencher Water 1L',
    quantity: 500,
    price: 60,
    entryDate: '2024-04-13',
    imageUrl: 'assets/product-images/quencher-water.jpeg',
    category: 'Beverages',
    brand: 'Quencher',
    size: '1L',
    description: 'Purified drinking water'
  },
  {
    id: 12,
    productName: 'Delmonte Juice Mango 500ml',
    quantity: 180,
    price: 120,
    entryDate: '2024-04-13',
    imageUrl: 'assets/product-images/delmonte-mango.jpeg',
    category: 'Beverages',
    brand: 'Delmonte',
    size: '500ml',
    description: 'Natural mango fruit juice drink'
  },

  // Snacks
  {
    id: 13,
    productName: 'Pringles Original 165g',
    quantity: 100,
    price: 450,
    entryDate: '2024-04-16',
    imageUrl: 'assets/product-images/pringles-original.jpeg',
    category: 'Snacks',
    brand: 'Pringles',
    size: '165g',
    description: 'Original flavour potato crisps'
  },
  {
    id: 14,
    productName: 'Lays Classic 100g',
    quantity: 150,
    price: 120,
    entryDate: '2024-04-16',
    imageUrl: 'assets/product-images/lays-classic.jpeg',
    category: 'Snacks',
    brand: 'Lays',
    size: '100g',
    description: 'Classic salted potato chips'
  },
  {
    id: 15,
    productName: 'Digestive Biscuits 400g',
    quantity: 90,
    price: 180,
    entryDate: '2024-04-16',
    imageUrl: 'assets/product-images/digestive-biscuits.jpeg',
    category: 'Snacks',
    brand: 'McVities',
    size: '400g',
    description: 'Classic wholemeal digestive biscuits'
  },
  {
    id: 16,
    productName: 'Cadbury Dairy Milk 90g',
    quantity: 120,
    price: 200,
    entryDate: '2024-04-16',
    imageUrl: 'assets/product-images/cadbury-dairy-milk.jpeg',
    category: 'Snacks',
    brand: 'Cadbury',
    size: '90g',
    description: 'Classic creamy milk chocolate bar'
  },

  // Produce
  {
    id: 17,
    productName: 'Tomatoes 1kg',
    quantity: 200,
    price: 80,
    entryDate: '2024-04-17',
    imageUrl: 'assets/product-images/tomatoes.jpeg',
    category: 'Produce',
    brand: 'Fresh Farm',
    size: '1kg',
    description: 'Fresh ripe tomatoes'
  },
  {
    id: 18,
    productName: 'Onions 1kg',
    quantity: 250,
    price: 60,
    entryDate: '2024-04-17',
    imageUrl: 'assets/product-images/onions.jpeg',
    category: 'Produce',
    brand: 'Fresh Farm',
    size: '1kg',
    description: 'Fresh red onions'
  },
  {
    id: 19,
    productName: 'Bananas 1 bunch',
    quantity: 100,
    price: 50,
    entryDate: '2024-04-17',
    imageUrl: 'assets/product-images/bananas.jpeg',
    category: 'Produce',
    brand: 'Fresh Farm',
    size: '1 bunch',
    description: 'Sweet ripe bananas'
  },
  {
    id: 20,
    productName: 'Avocado x3',
    quantity: 80,
    price: 90,
    entryDate: '2024-04-17',
    imageUrl: 'assets/product-images/avocado.jpeg',
    category: 'Produce',
    brand: 'Fresh Farm',
    size: 'x3',
    description: 'Ripe Kenyan avocados'
  },

  // Grains & Cereals
  {
    id: 21,
    productName: 'Unga Pembe Maize Flour 2kg',
    quantity: 300,
    price: 180,
    entryDate: '2024-04-18',
    imageUrl: 'assets/product-images/unga-pembe.jpeg',
    category: 'Grains & Cereals',
    brand: 'Unga Pembe',
    size: '2kg',
    description: 'Premium fortified maize meal flour'
  },
  {
    id: 22,
    productName: 'Weetabix Original 430g',
    quantity: 120,
    price: 380,
    entryDate: '2024-04-18',
    imageUrl: 'assets/product-images/weetabix.jpeg',
    category: 'Grains & Cereals',
    brand: 'Weetabix',
    size: '430g',
    description: 'Wholegrain wheat breakfast cereal'
  },
  {
    id: 23,
    productName: 'Golden Penny Rice 1kg',
    quantity: 200,
    price: 140,
    entryDate: '2024-04-18',
    imageUrl: 'assets/product-images/golden-penny-rice.jpeg',
    category: 'Grains & Cereals',
    brand: 'Golden Penny',
    size: '1kg',
    description: 'Parboiled long grain white rice'
  },
  {
    id: 24,
    productName: 'Kellogs Corn Flakes 500g',
    quantity: 90,
    price: 420,
    entryDate: '2024-04-18',
    imageUrl: 'assets/product-images/kellogs-cornflakes.jpeg',
    category: 'Grains & Cereals',
    brand: 'Kellogs',
    size: '500g',
    description: 'Classic toasted corn flakes breakfast cereal'
  }
];