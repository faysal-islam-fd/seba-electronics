# Product Image Guidelines for Sheba Electronics

এই ওয়েবসাইটে সব জায়গায় একই রকম প্রোডাক্ট ইমেজ ব্যবহার করতে হবে যাতে সব কার্ড সুন্দর এবং সামঞ্জস্যপূর্ণ দেখায়।

## Required Image Specifications

### 1. Product Thumbnail Images (প্রোডাক্ট থাম্বনেইল)

**Recommended Size:** 800x800 pixels (1:1 aspect ratio)
**Minimum Size:** 600x600 pixels
**Maximum Size:** 1200x1200 pixels
**Background:** White or transparent
**File Size:** Maximum 200KB

#### ব্যবহার:
- Product Cards (সব জায়গায়)
- Product Listing Pages (Category, Search, Brand Pages)
- Related Products
- Cart Items
- Wishlist Items
- Recently Viewed Products

#### Required Visual Rules:
```
✅ Product should be centered in the frame
✅ Product should occupy 70-85% of the image space
✅ Clean white/transparent background
✅ Good lighting with no harsh shadows
✅ High resolution and crisp details
✅ No watermarks or text overlays
✅ Consistent angle (preferably front view)

❌ Avoid low resolution/blurry images
❌ Avoid busy backgrounds
❌ Avoid cut-off products
❌ Avoid excessive empty space
❌ Avoid multiple products in one image
```

### 2. Product Gallery Images (প্রোডাক্ট গ্যালারি)

**Recommended Size:** 1200x1200 pixels (1:1 aspect ratio)
**Minimum Size:** 800x800 pixels
**Maximum Size:** 2000x2000 pixels
**Format:** JPG, PNG, WebP
**Background:** White or transparent
**File Size:** Maximum 500KB per image

#### ব্যবহার:
- Product Detail Page Gallery
- Zoom/Lightbox View
- Different angles of the product

#### Gallery Image Requirements:
```
1. Front View (মুখ্য দৃশ্য)
2. Side View (পাশের দৃশ্য)
3. Back View (পেছনের দৃশ্য)
4. Additional angles or features (বিশেষ বৈশিষ্ট্য)
5. Packaging (optional) (প্যাকেজিং - ঐচ্ছিক)
```

### 3. Banner Images (ব্যানার ইমেজ)

**Homepage Hero Banner:**
- Size: 1920x600 pixels (16:5 aspect ratio)
- Mobile: 800x600 pixels (4:3 aspect ratio)
- Format: JPG, WebP
- File Size: Maximum 300KB

**Category Banners:**
- Size: 1200x400 pixels (3:1 aspect ratio)
- Format: JPG, WebP
- File Size: Maximum 200KB

## Image Container Sizes in Code

### ProductCard Component
```tsx
Desktop (lg):  h-64  (256px height)
Tablet (md):   h-56  (224px height)
Mobile (sm):   h-48  (192px height)
Mobile (base): h-36  (144px height)
```

### Product Detail Page
```tsx
Gallery Main Image: aspect-ratio: 1/1 (square)
Gallery Thumbnails: h-20 (80px height)
```

### Cart Items
```tsx
Cart Item Image: h-20 w-20 (80x80px)
```

## Upload Checklist (আপলোড চেকলিস্ট)

প্রতিটি প্রোডাক্ট আপলোডের সময় নিশ্চিত করুন:

- [ ] Thumbnail Image: 800x800px (minimum 600x600px)
- [ ] White/Transparent Background
- [ ] Product centered and properly sized
- [ ] High quality and clear
- [ ] File size under 200KB
- [ ] At least 3-5 gallery images
- [ ] All images same aspect ratio (1:1)
- [ ] No watermarks or text
- [ ] Consistent lighting across all images

## Example Image Processing Tools

### Online Tools:
1. **TinyPNG** - https://tinypng.com/ (Compression)
2. **Remove.bg** - https://www.remove.bg/ (Background Removal)
3. **Squoosh** - https://squoosh.app/ (Optimization)

### Photo Editing:
1. **Photoshop** - Professional editing
2. **GIMP** - Free alternative
3. **Canva** - Quick background removal

## Code Implementation

### Current ProductCard Image Implementation:
```tsx
<div className="relative w-full h-36 sm:h-48 md:h-56 lg:h-64 bg-gradient-to-br from-gray-50 to-gray-100">
  <Image
    src={image}
    alt={name}
    fill
    sizes="(max-width: 640px) 144px, (max-width: 768px) 192px, (max-width: 1024px) 224px, 256px"
    className="object-contain p-2 sm:p-4"
  />
</div>
```

### Key CSS Classes:
- `object-contain` - Maintains aspect ratio, fits within container
- `fill` - Makes image fill the parent container
- `p-2 sm:p-4` - Padding around the image for breathing room

## API Response Format

Product ইমেজ API থেকে এভাবে আসা উচিত:

```json
{
  "thumbnail": "https://cdn.example.com/products/product-name-800x800.jpg",
  "galleries": [
    {
      "type": "image",
      "file_path": "https://cdn.example.com/products/product-name-1-1200x1200.jpg"
    },
    {
      "type": "image", 
      "file_path": "https://cdn.example.com/products/product-name-2-1200x1200.jpg"
    }
  ]
}
```

## Common Issues & Solutions

### ❌ Problem: Images look stretched or distorted
**✅ Solution:** Ensure images are 1:1 ratio (square) and use `object-contain`

### ❌ Problem: Images are blurry
**✅ Solution:** Use minimum 600x600px images, ideally 800x800px

### ❌ Problem: Background shows in cards
**✅ Solution:** Use white or transparent background in original images

### ❌ Problem: Products look too small/large
**✅ Solution:** Product should occupy 70-85% of image space with proper padding

### ❌ Problem: Inconsistent sizing across pages
**✅ Solution:** Always use the ProductCard component, don't create custom card variations

## Component Usage

### ✅ CORRECT - Use ProductCard everywhere:
```tsx
import ProductCard from '@/app/components/ProductCard';

<ProductCard
  id={product.id}
  name={product.title}
  image={product.thumbnail}
  price={product.final_price}
  ...
/>
```

### ❌ INCORRECT - Don't create custom product displays:
```tsx
// Don't do this!
<div className="custom-product">
  <img src={product.image} /> 
</div>
```

---

## Summary (সারাংশ)

### মূল বিষয়:
1. **সব ইমেজ 800x800 pixels (1:1 ratio) হতে হবে**
2. **White/transparent background ব্যবহার করুন**
3. **সব জায়গায় ProductCard component ব্যবহার করুন**
4. **File size 200KB এর নিচে রাখুন**
5. **Product centered এবং 70-85% space occupy করা উচিত**

এই গাইডলাইন follow করলে সব জায়গায় সুন্দর এবং consistent প্রোডাক্ট display পাবেন।
