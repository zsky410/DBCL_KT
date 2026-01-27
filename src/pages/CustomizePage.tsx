import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../sections/Footer';

export const CustomizePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />
      <div className="container-wide py-12">
        <h1 className="text-4xl font-semibold mb-4">Tùy Chỉnh Giày Của Bạn</h1>
        <p className="text-gray-600 mb-8 max-w-2xl">
          Tạo đôi giày độc đáo của riêng bạn. Chọn từ nhiều phong cách, màu sắc và chất liệu để
          thiết kế đôi giày hoàn hảo phù hợp với tính cách của bạn.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-50 p-8 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4">Thiết Kế Phong Cách Của Bạn</h2>
            <p className="text-gray-600 text-sm mb-6">
              Chọn mẫu cơ bản yêu thích và tùy chỉnh mọi chi tiết để tạo nên đôi giày độc nhất của
              riêng bạn.
            </p>
            <button className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors">
              Bắt đầu tùy chỉnh
            </button>
          </div>

          <div className="bg-gray-50 p-8 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4">Tùy Chọn Tùy Chỉnh</h2>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Chọn từ nhiều mẫu cơ bản</li>
              <li>• Chọn màu sắc và hoa văn</li>
              <li>• Thêm chữ hoặc logo cá nhân</li>
              <li>• Chọn chất liệu và hoàn thiện</li>
            </ul>
          </div>
        </div>

        <div className="text-center p-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl">
          <h2 className="text-2xl font-semibold mb-4">Sắp Ra Mắt</h2>
          <p className="text-gray-600 mb-6">
            Công cụ tùy chỉnh của chúng tôi đang được phát triển. Hãy theo dõi để cập nhật!
          </p>
          <p className="text-sm text-gray-500">
            Đăng ký nhận tin để được thông báo khi tính năng tùy chỉnh có sẵn.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};
