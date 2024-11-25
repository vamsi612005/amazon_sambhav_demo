import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Star, Heart, Share2, ArrowLeft, ShoppingCart } from 'lucide-react';

const ProductDisplay = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { link, description, pictureCount } = location.state || {}; // Extract the data passed in the navigation state

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [feature1, setFeature1] = useState('');
  const [feature2, setFeature2] = useState('');
  const [benefit1, setBenefit1] = useState('');
  const [benefit2, setBenefit2] = useState('');

  useEffect(() => {
    if (!link) return; // If no link, do nothing

    const fetchProductData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://127.0.0.1:8000/api/scrape_instagram/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ instagramLink: link, pictureCount, description }),
        });

        const data = await response.json();
        console.log(data);

        if (response.ok) {
          // Update state with API response data
          setImages(data.images);
          const { Name, Price, Feature1, Feature2, Benefit1, Benefit2 } = data.apiResponse.result;
          setName(Name);
          setPrice(Price);
          setFeature1(Feature1);
          setFeature2(Feature2);
          setBenefit1(Benefit1);
          setBenefit2(Benefit2);
          setLoading(false);
          setError(null);
        } else {
          throw new Error(data.error || 'Failed to load product data');
        }
      } catch (error) {
        setError(error.message || 'Error fetching data');
        setLoading(false);
      }
    };

    fetchProductData();
  }, [link]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl font-semibold text-red-600">{error}</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Input</span>
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden">
                <img
                  src={images[0] || '/placeholder.jpg'}
                  alt="Product main view"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {images.slice(1).map((img, idx) => (
                  <div key={idx} className="aspect-square rounded-lg overflow-hidden">
                    <img
                      src={img}
                      alt={`Product view ${idx + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{name || 'Product Name'}</h1>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-blue-600">4 ratings</span>
                </div>
              </div>

              <div className="border-t border-b py-4">
                <div className="text-3xl font-bold text-gray-900">{price || '$0.00'}</div>
                <div className="text-sm text-gray-500 mt-1">Free Returns & Free Delivery</div>
              </div>

              <div className="border-t border-b py-4">
                <div className="text-xl font-semibold text-gray-900">Features:</div>
                <ul className="list-disc ml-6 text-gray-700">
                  <li>{feature1 || 'Feature 1'}</li>
                  <li>{feature2 || 'Feature 2'}</li>
                </ul>
              </div>

              <div className="border-t border-b py-4">
                <div className="text-xl font-semibold text-gray-900">Benefits:</div>
                <ul className="list-disc ml-6 text-gray-700">
                  <li>{benefit1 || 'Benefit 1'}</li>
                  <li>{benefit2 || 'Benefit 2'}</li>
                </ul>
              </div>

              <div className="space-y-4">
                <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium py-3 rounded-lg transition flex items-center justify-center space-x-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;
