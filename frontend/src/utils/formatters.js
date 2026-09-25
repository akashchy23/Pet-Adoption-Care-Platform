// Formatters and Styling Color Mappers

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  return phone;
};

export const getStatusBadgeClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'available':
    case 'completed':
    case 'approved':
    case 'active':
    case 'up to date':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'pending':
    case 'under review':
    case 'upcoming':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'overdue':
    case 'rejected':
    case 'cancelled':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'adopted':
      return 'bg-teal-50 text-teal-700 border-teal-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
