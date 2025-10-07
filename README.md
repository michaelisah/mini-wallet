# Mini Wallet Application

<p align="center">
  <img src="https://laravel.com/img/logomark.min.svg" alt="Laravel" height="80">
  <img src="https://vuejs.org/images/logo.png" alt="Vue.js" height="80" style="margin: 0 20px">
  <img src="https://pinia.vuejs.org/logo.svg" alt="Pinia" height="80">
</p>

A modern, full-stack wallet application built with Laravel 12, Vue 3, and Pinia. This application allows users to send and receive money, view transaction history, and manage their account with real-time updates.

## Features

- 💰 Send and receive money between users
- 🔒 Secure authentication with Laravel Sanctum
- ⚡ Real-time transaction updates with Laravel Echo and Pusher
- 📱 Responsive design with Tailwind CSS
- 📊 Transaction history with filtering and pagination
- 📱 PWA ready

## Screenshots

### Dashboard View
![Transactions View](/screenshots/Screenshot%202025-10-07%20at%2019.35.19.png)

### Transactions View
![Dashboard View](/screenshots/Screenshot%202025-10-07%20at%2019.35.05.png)

### Transfer Form
![Transfer Form](/screenshots/Screenshot%202025-10-07%20at%2020.12.09.png)

## Tech Stack

### Backend
- Laravel 12.x
- Laravel Sanctum for API authentication
- Laravel Echo for real-time events
- SQLite (can be configured to use MySQL/PostgreSQL)

### Frontend
- Vue 3 with Composition API
- Vue Router for navigation
- Pinia for state management
- Axios for HTTP requests
- Tailwind CSS for styling
- Headless UI for accessible components

## Prerequisites

Before you begin, ensure you have the following installed:

- PHP 8.1 or higher
- Composer (PHP package manager)
- Node.js 16.x or higher
- npm or Yarn
- SQLite (or MySQL/PostgreSQL if you prefer)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/mini-wallet.git
cd mini-wallet
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install JavaScript Dependencies

```bash
cd frontend
npm install
cd ..
```

### 4. Environment Setup

Copy the example environment file and generate an application key:

```bash
cp .env.example .env
php artisan key:generate
```

Update the `.env` file with your database and Pusher credentials:

```env
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/your/database.sqlite

# For real-time features
BROADCAST_DRIVER=pusher
PUSHER_APP_ID=your_pusher_app_id
PUSHER_APP_KEY=your_pusher_key
PUSHER_APP_SECRET=your_pusher_secret
PUSHER_APP_CLUSTER=your_pusher_cluster

MIX_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
MIX_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"
```

### 5. Database Setup

Create the SQLite database file:

```bash
touch database/database.sqlite
```

Run migrations and seed the database:

```bash
php artisan migrate --seed
```

### 6. Build Frontend Assets

Build the frontend assets with Vite:

```bash
cd frontend
npm run build
cd ..
```

### 7. Start the Development Servers

In one terminal, start the Laravel development server:

```bash
php artisan serve
```

In another terminal, start the Vite development server:

```bash
cd frontend
npm run dev
```

In a third terminal, start the queue worker to process background jobs:

```bash
php artisan queue:work
```

The application should now be available at `http://localhost:8000`.

## Development

### Running Tests

To run the PHP tests:

```bash
php artisan test
```

### Code Style

This project uses Laravel Pint for code style fixing:

```bash
composer pint
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `APP_ENV` | Application environment | `local` |
| `APP_DEBUG` | Enable debug mode | `true` in local |
| `APP_URL` | Application URL | `http://localhost:8000` |
| `DB_CONNECTION` | Database connection | `sqlite` |
| `BROADCAST_DRIVER` | Broadcast driver | `pusher` |

## API Documentation

API documentation is available at `/api/documentation` when running the application locally.

## Contributing

Contributions are welcome! Please read the [contributing guide](CONTRIBUTING.md) before submitting pull requests.

## License

This project is open-source and available under the [MIT License](LICENSE).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
