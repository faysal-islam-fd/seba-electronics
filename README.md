# Sheba Electronics E-commerce Platform

A fully functional e-commerce frontend UI for Sheba Electronics, built with Next.js 16, TypeScript, and Tailwind CSS.

## 🚀 Features

- ✅ **Next.js SSR** - Server-Side Rendering for improved SEO and faster initial load
- ✅ **Modern UI** - Clean, responsive design for Sheba Electronics
- ✅ **TypeScript** - Type-safe code for better development experience
- ✅ **Tailwind CSS** - Utility-first CSS framework for rapid styling
- ✅ **Component Architecture** - Modular, reusable components
- ✅ **SEO Optimized** - Meta tags and semantic HTML
- ✅ **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- ✅ **API Ready** - Built with modular states for easy backend integration

## 📦 Components

### Layout Components
- **Header** - Top navigation with search, cart, and user account
- **Footer** - Company info, links, and social media
- **Navigation** - Category menu bar

### Reusable Components
- **ProductCard** - Product display with image, price, discount badges, and ratings
- **Banner** - Hero slider with autoplay
- **CategorySection** - Product listing sections with "See All" functionality

### Pages
- **Home Page** - Complete e-commerce homepage with multiple product sections

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** React Icons
- **Image Handling:** Next.js Image Component

## 📂 Project Structure

```
sheba-electronics/
├── app/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   ├── Banner.tsx
│   │   └── CategorySection.tsx
│   ├── data/
│   │   └── dummyData.ts
│   ├── utils/
│   │   └── imagePlaceholder.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── public/
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd sheba-electronics
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 🎨 Features Breakdown

### Header
- Logo and branding
- Search functionality
- Shopping cart with item count
- User account access
- Category navigation menu
- Top bar with location and quick links

### Home Page Sections
1. **Hero Banner** - Rotating promotional banners
2. **Hot Deals** - Featured products with best prices
3. **Desktop Deals** - Desktop computers section
4. **Monitor Deals** - Monitor products
5. **Accessories** - Peripherals and accessories
6. **Smartphones** - Latest mobile phones
7. **Camera & Photography** - Camera equipment
8. **Smart Gadgets** - Smartwatches, drones, e-readers
9. **Info Banners** - Free delivery, authenticity, secure payment

### Product Card Features
- Product image with hover effects
- Discount percentage badges
- Special badges (New, Featured, Gaming, etc.)
- Star ratings
- Original and discounted prices
- Stock status indicator
- Add to cart button
- Wishlist button (on hover)

## 📱 Responsive Design

The UI is fully responsive and optimized for:
- **Mobile** - 320px and up
- **Tablet** - 768px and up
- **Desktop** - 1024px and up
- **Large Desktop** - 1440px and up

## 🔄 API Integration Ready

The application uses dummy data but is structured for easy API integration:

1. Replace dummy data in `app/data/dummyData.ts` with API calls
2. Add loading states to components
3. Implement error handling
4. Add empty states for no results

Example API integration point:
```typescript
// In page.tsx or a server component
async function getProducts() {
  const res = await fetch('https://api.example.com/products');
  return res.json();
}
```

## 🎯 SEO Features

- Meta tags for title, description, keywords
- Open Graph tags for social sharing
- Twitter Card tags
- Semantic HTML structure
- Server-Side Rendering for better indexing
- Optimized images with Next.js Image component

## 🔧 Customization

### Colors
Edit Tailwind colors in `tailwind.config.ts`:
```typescript
theme: {
  extend: {
    colors: {
      primary: '#2563eb',
      secondary: '#1e40af',
    }
  }
}
```

### Products
Update product data in `app/data/dummyData.ts`

### Styling
Global styles in `app/globals.css`

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Development Notes

- Uses Next.js App Router (not Pages Router)
- Server Components by default for better performance
- Client Components ('use client') only where needed
- TypeScript for type safety
- Tailwind CSS for consistent styling
- React Icons for icon library

## 🚧 Future Enhancements

- [ ] Product detail pages
- [ ] Shopping cart functionality
- [ ] User authentication
- [ ] Payment gateway integration
- [ ] Product search and filtering
- [ ] Wishlist functionality
- [ ] Order tracking
- [ ] User reviews and ratings
- [ ] Admin dashboard

## 📞 Support

For questions or issues, please refer to the Next.js documentation:
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
