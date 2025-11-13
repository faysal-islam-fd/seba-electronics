// Utility function to generate placeholder images for products

export const getPlaceholderImage = (category: string = 'product'): string => {
  // Return a placeholder image URL based on category
  const placeholders: Record<string, string> = {
    laptop: 'https://via.placeholder.com/400x400/e8f4f8/1e88e5?text=Laptop',
    desktop: 'https://via.placeholder.com/400x400/e8f4f8/1e88e5?text=Desktop',
    monitor: 'https://via.placeholder.com/400x400/e8f4f8/1e88e5?text=Monitor',
    mouse: 'https://via.placeholder.com/400x400/e8f4f8/1e88e5?text=Mouse',
    keyboard: 'https://via.placeholder.com/400x400/e8f4f8/1e88e5?text=Keyboard',
    headphone: 'https://via.placeholder.com/400x400/e8f4f8/1e88e5?text=Headphone',
    webcam: 'https://via.placeholder.com/400x400/e8f4f8/1e88e5?text=Webcam',
    ssd: 'https://via.placeholder.com/400x400/e8f4f8/1e88e5?text=SSD',
    phone: 'https://via.placeholder.com/400x400/e8f4f8/1e88e5?text=Smartphone',
    camera: 'https://via.placeholder.com/400x400/e8f4f8/1e88e5?text=Camera',
    watch: 'https://via.placeholder.com/400x400/e8f4f8/1e88e5?text=Smartwatch',
    drone: 'https://via.placeholder.com/400x400/e8f4f8/1e88e5?text=Drone',
    kindle: 'https://via.placeholder.com/400x400/e8f4f8/1e88e5?text=E-Reader',
    speaker: 'https://via.placeholder.com/400x400/e8f4f8/1e88e5?text=Speaker',
  };

  return placeholders[category] || 'https://via.placeholder.com/400x400/e8f4f8/1e88e5?text=Product';
};

export const getBannerPlaceholder = (title: string): string => {
  return `https://via.placeholder.com/1200x450/2563eb/ffffff?text=${encodeURIComponent(title)}`;
};



