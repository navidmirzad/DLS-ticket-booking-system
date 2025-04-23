export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'short',
    month: 'short', 
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  };
  
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

export const formatShortDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  };
  
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    hour: 'numeric',
    minute: '2-digit'
  };
  
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

export const getDayOfWeek = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

export const getDayOfMonth = (dateString: string): string => {
  const date = new Date(dateString);
  return date.getDate().toString();
};

export const getMonth = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short' });
};