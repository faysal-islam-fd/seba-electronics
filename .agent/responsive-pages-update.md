# Responsive Design Update for Order & Request Pages

## Pages to Update:
1. Order Details Page (`app/account/orders/[orderNumber]/page.tsx`)
2. Track Order Page (`app/order-track/page.tsx`)
3. Service Requests List (`app/account/service-requests/page.tsx`)
4. Service Request Details (`app/account/service-requests/[id]/page.tsx`)
5. Return Requests List (`app/account/return-requests/page.tsx`)
6. Return Request Details (`app/account/return-requests/[id]/page.tsx`)

## Responsive Improvements Needed:

### Common Patterns:
- ✅ Mobile-first approach with sm:, md:, lg:, xl: breakpoints
- ✅ Flexible grid layouts that stack on mobile
- ✅ Touch-friendly button sizes (min-height: 44px)
- ✅ Readable font sizes on small screens
- ✅ Proper spacing and padding adjustments
- ✅ Horizontal scrolling prevention
- ✅ Image responsiveness
- ✅ Modal/overlay full-screen on mobile

### Specific Updates:

#### 1. Order Details Page
- Stack order items vertically on mobile
- Responsive sidebar (full-width on mobile, sidebar on desktop)
- Touch-friendly action buttons
- Responsive status timeline

#### 2. Track Order Page
- Stack tracking form fields on mobile
- Responsive timeline/progress indicator
- Full-width cards on mobile

#### 3. Service/Return Request Pages
- Responsive table/card layout
- Stack filters on mobile
- Touch-friendly buttons and inputs
- Responsive modals

## Implementation Status:
- [ ] Order Details Page
- [ ] Track Order Page  
- [ ] Service Requests List
- [ ] Service Request Details
- [ ] Return Requests List
- [ ] Return Request Details
