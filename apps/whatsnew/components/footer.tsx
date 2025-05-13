import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-gray-200 bg-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-500">
              © {currentYear} Zopio Labs. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <a 
              href="https://github.com/zopiolabs/zopio" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
            >
              GitHub
            </a>
            <a 
              href="https://twitter.com/zopiolabs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
            >
              Twitter
            </a>
            <a 
              href="https://zopio.dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
            >
              Website
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
