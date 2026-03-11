import create from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  
  login: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },
  
  setUser: (user) => set({ user }),
}));

export const useBookingStore = create((set) => ({
  bookings: [],
  currentBooking: null,
  
  setBookings: (bookings) => set({ bookings }),
  setCurrentBooking: (booking) => set({ currentBooking: booking }),
  addBooking: (booking) => set((state) => ({ bookings: [...state.bookings, booking] })),
}));

export const usePropertyStore = create((set) => ({
  properties: [],
  currentProperty: null,
  filteredProperties: [],
  
  setProperties: (properties) => set({ properties }),
  setCurrentProperty: (property) => set({ currentProperty: property }),
  setFilteredProperties: (properties) => set({ filteredProperties: properties }),
}));
