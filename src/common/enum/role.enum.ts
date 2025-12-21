// role.enum.ts
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

// show-status.enum.ts
export enum ShowStatus {
  UPCOMING = 'UPCOMING',
  RUNNING = 'RUNNING',
  CLOSED = 'CLOSED',
}

// seat-status.enum.ts
export enum SeatStatus {
  AVAILABLE = 'AVAILABLE',
  LOCKED = 'LOCKED',
  BOOKED = 'BOOKED',
}

// booking-status.enum.ts
export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

// payment-status.enum.ts
export enum PaymentStatus {
  INITIATED = 'INITIATED',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  TIMEOUT = 'TIMEOUT',
}
