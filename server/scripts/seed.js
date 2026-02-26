import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from '../src/config/db.js';
import User from '../src/models/User.js';
import Category from '../src/models/Category.js';
import Product from '../src/models/Product.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400';
const FF_DIAMOND_IMG = 'https://images.unsplash.com/photo-1611791484670-ce19b801dd1c?w=400';
const FF_GAMING_IMG = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400';

async function seed() {
  await connectDB();

  const admin = await User.findOne({ email: 'admin@shield.com' });
  if (!admin) {
    await User.create({
      name: 'Admin',
      email: 'admin@shield.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('Admin created: admin@shield.com / admin123');
  }

  const categories = await Category.find();
  if (categories.length === 0) {
    const diamonds = await Category.create({ name: 'Diamonds', slug: 'free-fire-diamonds', description: 'Free Fire diamonds' });
    const subscriptions = await Category.create({ name: 'Subscriptions', slug: 'free-fire-subscriptions', description: 'Free Fire subscriptions' });
    const fashion = await Category.create({ name: 'Fashion', slug: 'fashion', description: 'Apparel' });
    await Category.insertMany([
      { name: 'Hoodies', slug: 'fashion-hoodies', parent: fashion._id },
      { name: 'T-Shirt', slug: 'fashion-tshirts', parent: fashion._id },
    ]);
    console.log('Categories created: Diamonds, Subscriptions, Fashion (Hoodies, T-Shirt)');
  }

  const diamondsCat = await Category.findOne({ slug: 'free-fire-diamonds' });
  const subsCat = await Category.findOne({ slug: 'free-fire-subscriptions' });
  const fashionCat = await Category.findOne({ slug: 'fashion' });
  if (fashionCat) {
    if (!(await Category.findOne({ slug: 'fashion-hoodies' }))) {
      await Category.create({ name: 'Hoodies', slug: 'fashion-hoodies', parent: fashionCat._id });
      console.log('Fashion subcategory Hoodies created');
    }
    if (!(await Category.findOne({ slug: 'fashion-tshirts' }))) {
      await Category.create({ name: 'T-Shirt', slug: 'fashion-tshirts', parent: fashionCat._id });
      console.log('Fashion subcategory T-Shirt created');
    }
  }
  const ffDiamondCount = await Product.countDocuments({ category: diamondsCat?._id });
  const ffSubsCount = await Product.countDocuments({ category: subsCat?._id });

  if (diamondsCat && ffDiamondCount === 0) {
    const diamondPacks = [
      { name: '25 Diamonds', price: 35 },
      { name: '50 Diamonds', price: 55 },
      { name: '115 Diamonds', price: 100 },
      { name: '240 Diamonds', price: 195 },
      { name: '355 Diamonds', price: 290 },
      { name: '480 Diamonds', price: 385 },
      { name: '610 Diamonds', price: 480 },
      { name: '725 Diamonds', price: 575 },
      { name: '850 Diamonds', price: 670 },
      { name: '965 Diamonds', price: 765 },
      { name: '1090 Diamonds', price: 860 },
      { name: '1240 Diamonds', price: 955 },
      { name: '2530 Diamonds', price: 1905 },
      { name: '3060 Diamonds', price: 3805 },
    ];
    await Product.insertMany(
      diamondPacks.map((p, i) => ({
        name: p.name,
        slug: `free-fire-${p.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${i}`,
        description: `Free Fire ${p.name} - in-game diamonds`,
        price: p.price,
        currency: 'NPR',
        image: FF_DIAMOND_IMG,
        category: diamondsCat._id,
        stock: 999,
        featured: i < 4,
      }))
    );
    console.log('Free Fire diamond packs created');
  }
  if (subsCat && ffSubsCount === 0) {
    const subs = [
      { name: 'Weekly Lite', price: 65 },
      { name: 'Weekly', price: 190 },
      { name: 'Monthly', price: 950 },
    ];
    await Product.insertMany(
      subs.map((s, i) => ({
        name: s.name,
        slug: `free-fire-${s.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${i}`,
        description: `Free Fire ${s.name} subscription`,
        price: s.price,
        currency: 'NPR',
        image: FF_GAMING_IMG,
        category: subsCat._id,
        stock: 999,
        featured: true,
      }))
    );
    console.log('Free Fire subscriptions created');
  }

  console.log('Seed done.');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
