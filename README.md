# ChatApp

A full-stack real-time chat application built with Next.js (client) and Node.js/Express (server). Features include user authentication, group chats, friend requests, real-time messaging, admin panel, and more.

## Live Url

https://chattapps.netlify.app/

## Features

- **Real-time Messaging**: Instant messaging with Socket.io for real-time communication.
- **User Authentication**: Login, register, forgot password, email verification, and Google OAuth integration.
- **Group Chats**: Create groups, add/remove members, rename groups, leave groups.
- **Friend System**: Send friend requests, accept/reject, manage friends list.
- **Admin Panel**: Dashboard with stats, manage users, chats, and messages.
- **Notifications**: Real-time notifications for messages and friend requests.
- **Search Users**: Search and add friends.
- **File Uploads**: Upload images and files via Cloudinary.
- **Responsive Design**: Mobile-friendly UI with Material-UI and Tailwind CSS.
- **Speech Recognition**: Voice-to-text messaging support.

## Tech Stack

### Client
- **Framework**: Next.js 15.3.3
- **Language**: TypeScript
- **State Management**: Redux Toolkit, Redux Persist
- **API Calls**: TanStack Query (React Query)
- **UI Library**: Material-UI (MUI), Tailwind CSS
- **Real-time**: Socket.io-client
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **Charts**: Chart.js, React-Chartjs-2
- **Other**: Axios, Moment.js, React Hot Toast, React Intersection Observer

### Server
- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens), bcrypt
- **Real-time**: Socket.io
- **File Storage**: Cloudinary
- **Email**: Nodemailer
- **Validation**: Joi, Express Validator
- **Other**: Cors, Cookie Parser, Multer

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd chatapp
   ```

2. **Set up the server**:
   ```bash
   cd server
   npm install
   # Create a .env file in server/ directory (see Environment Variables section)
   node index.js
   ```
   The server will run on the port specified in `BASE_URL` (default: 8000).

3. **Set up the client**:
   ```bash
   cd ../client
   npm install
   # Create a .env.local file in client/ directory (see Environment Variables section)
   npm run dev
   ```
   The client will run on http://localhost:3000.

## Environment Variables

### Server (.env in server/ directory)
Create a `.env` file in the `server/` directory with the following variables:

- `MONGO_URL`:mongodb+srv://saikatlidhroni20019:Er6T6bMAQQZ9wcvm@cluster0.unzp57d.mongodb.net
- `BASE_URL`: Server port (e.g., `8000`)
- `CLIENT_URL`: Client URL (e.g., `http://localhost:3000`)
- `ACCESS_SECRET_TOKEN`: Secret key for access JWT tokens (e.g., `your-access-secret`)
- `REFRESH_SECRET_TOKEN`: Secret key for refresh JWT tokens (e.g., `your-refresh-secret`)
- `ACCESS_SECRET_TOKEN_EXPIRY`: Expiry time for access tokens (e.g., `15m`)
- `REFRESH_SECRET_TOKEN_EXPIRY`: Expiry time for refresh tokens (e.g., `7d`)
- `SMPT_HOST`: SMTP host for email (e.g., `smtp.gmail.com`)
- `SMPT_PORT`: SMTP port (e.g., `465`)
- `SMPT_SERVICE`: SMTP service (e.g., `gmail`)
- `SMPT_MAIL`: saikatlidhroni20019@gmail.com
- `SMPT_PASSWORD`: tztt ykpn eohe sknm 
- `CLOUDINARY_NAME`: dvkyxnqpc
- `CLOUDINARY_API_KEY`: 245391754637279
- `CLOUDINARY_API_SECRET`: DjDfes1u0hiGZEmh0lapyNsNrpY
- `GOOGLE_CLIENT_ID`: 348497864598-abv8l5gj88v2ev978fcb15oc1vbdutjl.apps.googleusercontent.com
- `GOOGLE_CLIENT_SECRET`: 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

### Client (.env.local in client/ directory)
Create a `.env.local` file in the `client/` directory with the following variables:

- `NEXT_PUBLIC_CLIENT_ID_FOR_GOOLE`: 348497864598-abv8l5gj88v2ev978fcb15oc1vbdutjl.apps.googleusercontent.com
- `NEXT_PUBLIC_BASE_URL`: Server API base URL (e.g., `http://localhost:8000/api/v1`)
- `NEXT_PUBLIC_SOCKET_URL`: Socket.io server URL (e.g., `http://localhost:8000`)

**Note**: Never commit `.env` or `.env.local` files to version control. They contain sensitive information.

## Usage

1. Start the server and client as described in Installation.
2. Open http://localhost:3000 in your browser.
3. Register a new account or login with existing credentials.
4. Start chatting with friends or create/join groups.
5. Access the admin panel if you have admin privileges.

## API Endpoints

The server provides RESTful APIs for authentication, user management, chats, and admin functions. Key endpoints include:

- **Auth**: `/api/v1/auth/login`, `/api/v1/auth/register`, etc.
- **User**: `/api/v1/user/profile`, `/api/v1/user/friends`, etc.
- **Chat**: `/api/v1/chat/create`, `/api/v1/chat/messages`, etc.
- **Admin**: `/api/v1/admin/users`, `/api/v1/admin/stats`, etc.

For detailed API documentation, refer to the server routes in `server/app/routes/`.

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Open a pull request.

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Admin Credentials

email : owner@yopmail.com
password: owner10

## Author

Saikat Lodh
