import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Instagram, ArrowRight, FileText, Loader2, Images } from 'lucide-react';

const InputScreen = () => {
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [pictureCount, setPictureCount] = useState(1);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!link.includes('instagram.com')) {
      setError('Please enter a valid Instagram link');
      return;
    }

    // setIsLoading(true);
    // try {
    //   const response = await fetch('http://localhost:8000/api/scrape_instagram/', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       instagramLink: link,
    //       description: description,
    //       pictureCount: pictureCount,
    //     }),
    //   });

    //   if (!response.ok) throw new Error('API request failed');

      // const data = await response.json();
      navigate('/product', { state: { link, description, pictureCount} });
    // } catch (err) {
    //   setError('Failed to process your request. Please try again.');
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Instagram className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Instagram to Amazon</h1>
            <p className="text-gray-600 mt-2">Transform your Instagram content into an Amazon-style product listing</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="instagram-link" className="block text-sm font-medium text-gray-700 mb-1">
                Instagram Post Link
              </label>
              <div className="relative">
                <input
                  id="instagram-link"
                  type="url"
                  value={link}
                  onChange={(e) => {
                    setLink(e.target.value);
                    setError('');
                  }}
                  placeholder="https://www.instagram.com/p/..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            <div>
              <label htmlFor="picture-count" className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-2">
                  <Images className="w-4 h-4" />
                  <span>Number of Pictures In The Post</span>
                </div>
              </label>
              <div className="relative">
                <input
                  id="picture-count"
                  type="number"
                  min="1"
                  max="10"
                  value={pictureCount}
                  onChange={(e) => setPictureCount(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Select how many pictures from the post you want to process (1-10)
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Item Description (Skip if not needed)</span>
                </div>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter your product description here for a more in-depth amazon page"
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Add details about your product to enhance the transformation
              </p>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition flex items-center justify-center space-x-2 group disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Transform</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-center text-gray-500">
            Enter any Instagram post link and description to see it transformed into an Amazon-style product listing
          </p>
        </div>
      </div>
    </div>
  );
};

export default InputScreen;