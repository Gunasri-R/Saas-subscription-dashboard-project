// Mock data with CORRECT billing cycles
const mockSubscriptions = [
  {
    id: 1,
    appName: 'Netflix',
    category: 'Entertainment',
    logo: '🎬',
    color: '#E50914',
    plan: 'Premium',
    price: 649,
    billingCycle: 'monthly',
    status: 'Active',
    nextBilling: 'April 15, 2024',
    devices: '4 screens',
    availablePlans: [
      { name: 'Mobile', price: 149, billingCycle: 'monthly' },
      { name: 'Basic', price: 199, billingCycle: 'monthly' },
      { name: 'Standard', price: 499, billingCycle: 'monthly' },
      { name: 'Premium', price: 649, billingCycle: 'monthly' }
    ]
  },
  {
    id: 2,
    appName: 'Spotify',
    category: 'Music',
    logo: '🎵',
    color: '#1DB954',
    plan: 'Individual',
    price: 119,
    billingCycle: 'monthly',
    status: 'Active',
    nextBilling: 'April 10, 2024',
    devices: '1 device',
    availablePlans: [
      { name: 'Individual', price: 119, billingCycle: 'monthly' },
      { name: 'Duo', price: 149, billingCycle: 'monthly' },
      { name: 'Family', price: 179, billingCycle: 'monthly' },
      { name: 'Student', price: 59, billingCycle: 'monthly' }
    ]
  },
  {
    id: 3,
    appName: 'Amazon Prime',
    category: 'Shopping',
    logo: '📦',
    color: '#00A8E1',
    plan: 'Yearly',
    price: 1499,
    billingCycle: 'yearly',
    status: 'Active',
    nextBilling: 'May 1, 2024',
    devices: '3 screens',
    availablePlans: [
      { name: 'Monthly', price: 179, billingCycle: 'monthly' },
      { name: 'Yearly', price: 1499, billingCycle: 'yearly' }
    ]
  },
  {
    id: 4,
    appName: 'Disney+ Hotstar',
    category: 'Entertainment',
    logo: '⭐',
    color: '#1AA2E6',
    plan: 'Premium',
    price: 899,
    billingCycle: 'monthly',
    status: 'Active',
    nextBilling: 'April 20, 2024',
    devices: '4 screens',
    availablePlans: [
      { name: 'Mobile', price: 399, billingCycle: 'monthly' },
      { name: 'Super', price: 699, billingCycle: 'monthly' },
      { name: 'Premium', price: 899, billingCycle: 'monthly' }
    ]
  },
  {
    id: 5,
    appName: 'YouTube Premium',
    category: 'Video',
    logo: '▶️',
    color: '#FF0000',
    plan: 'Family',
    price: 189,
    billingCycle: 'monthly',
    status: 'Active',
    nextBilling: 'April 18, 2024',
    devices: '5 accounts',
    availablePlans: [
      { name: 'Individual', price: 129, billingCycle: 'monthly' },
      { name: 'Family', price: 189, billingCycle: 'monthly' },
      { name: 'Student', price: 79, billingCycle: 'monthly' }
    ]
  }
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  getSubscriptions: async () => {
    await delay(800);
    return [...mockSubscriptions];
  },
  
  updatePlan: async (id, newPlan, newPrice, billingCycle) => {
    await delay(500);
    const subscription = mockSubscriptions.find(sub => sub.id === id);
    if (subscription) {
      subscription.plan = newPlan;
      subscription.price = newPrice;
      subscription.billingCycle = billingCycle;
    }
    return { success: true };
  },
  
  login: async (email, password) => {
    await delay(800);
    if (email === '24bct020@gmail.com' && password === 'Gunasri1820') {
      return { id: 1, name: 'User', email: '24bct020@gmail.com' };
    }
    return null;
  }
};