# Laptop E-commerce Web Application

A full-stack e-commerce platform for laptop sales with integrated QR code banking payment system and comprehensive product management features.

## 🏗️ Project Structure

```
project-laptop-web-nodejs/
├── backend/          # Node.js Express API server
├── frontend/         # React.js client application  
├── production/       # Docker & deployment configuration
└── README.md        # This file
```

## 🚀 Features

### Core E-commerce Functionality
- **Product Management**: Browse, search, filter laptops by brand, price, specifications
- **User Authentication**: Registration, login, JWT-based authentication
- **Shopping Cart**: Add/remove items, quantity management, cart persistence
- **Order Management**: Place orders, order tracking, order history
- **Review System**: Product reviews and ratings
- **Admin Dashboard**: Product CRUD, order management, user management

### Payment Integration
- **QR Code Banking**: Generate QR codes for bank transfers via PayOS
- **Multiple Payment Methods**: 
  - Bank transfer (QR Code)
  - Cash on delivery (COD)
- **Payment Verification**: Webhook handling for payment status updates
- **Real-time Payment Tracking**: Live payment status monitoring

### Additional Features
- **Coupon System**: Discount codes and promotional offers
- **Email Notifications**: Order confirmations, payment updates
- **File Upload**: Product images, user avatars
- **Responsive Design**: Mobile-friendly interface
- **Search & Filtering**: Advanced product search capabilities

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js (≥18.x)
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Payment Gateway**: PayOS API
- **File Upload**: Multer
- **Email**: Nodemailer
- **QR Code**: QRCode library
- **Security**: Bcrypt.js, CORS
- **Development**: Babel, Nodemon, ESLint

### Frontend
- **Framework**: React.js 19.x
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **UI Components**: Ant Design (antd)
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **QR Display**: qrcode.react
- **Notifications**: React Toastify
- **Carousel**: Swiper.js

### DevOps & Deployment
- **Containerization**: Docker
- **Web Server**: Nginx
- **Process Management**: PM2
- **Environment**: Cross-platform environment variables

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (≥18.16.0)
- **npm** (≥9.8.1) or **yarn** (≥1.22.19)
- **MongoDB** database
- **Docker** (for production deployment)
- **PayOS Account** (for payment integration)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd project-laptop-web-nodejs
```

### 2. Backend Setup
```bash
cd backend
npm install
# or
yarn install

# Create .env file with required environment variables
cp .env.example .env

# Start development server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# or
yarn install

# Start development server
npm run dev
```

### 4. Production Deployment
```bash
cd production
docker-compose up -d
```

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=8017
MONGODB_URI=mongodb://localhost:27017/laptop-store
JWT_ACCESS_TOKEN_SECRET=your-jwt-secret
JWT_REFRESH_TOKEN_SECRET=your-refresh-secret
PAYOS_CLIENT_ID=your-payos-client-id
PAYOS_API_KEY=your-payos-api-key
PAYOS_CHECKSUM_KEY=your-payos-checksum-key
PAYOS_API_URL=https://api-merchant.payos.vn
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8017/api/v1
VITE_BUILD_MODE=development
```

## 📁 Project Details

### Backend Structure
- **Controllers**: Handle HTTP requests and responses
- **Services**: Business logic and data processing
- **Models**: MongoDB schema definitions
- **Routes**: API endpoint definitions
- **Middlewares**: Authentication, error handling, validation
- **Config**: Database, CORS, environment configuration
- **Utils**: Helper functions, constants, validators

### Frontend Structure
- **Components**: Reusable React components
- **Pages**: Route-based page components
- **Store**: Redux state management
- **Services**: API integration
- **Utils**: Helper functions and utilities
- **Assets**: Static files, images, icons

### Key API Endpoints
- `POST /api/v1/auth/login` - User authentication
- `GET /api/v1/products` - Get products list
- `POST /api/v1/orders` - Create new order
- `POST /api/v1/payments/create` - Create payment link
- `POST /api/v1/payments/webhook` - Payment webhook
- `GET /api/v1/orders/:id` - Get order details

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Request validation with Joi
- CORS configuration
- Rate limiting
- SQL injection prevention
- XSS protection

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📦 Deployment

### Development
- Backend: `npm run dev` (runs on http://localhost:8017)
- Frontend: `npm run dev` (runs on http://localhost:5173)

### Production
- Use Docker Compose: `docker-compose up -d`
- Backend: `npm run production`
- Frontend: `npm run build`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 🙏 Acknowledgments

- PayOS for payment gateway services
- Ant Design for UI components
- MongoDB for database solution
- React community for frontend framework


