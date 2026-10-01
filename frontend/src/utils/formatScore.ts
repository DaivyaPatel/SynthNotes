export function formatPercentage(val: number): string {
  const percent = val > 1 ? val : Math.round(val * 100);
  return `${percent}%`;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function getFaithfulnessTier(score: number): {
  label: 'Highly Reliable' | 'Moderate' | 'Needs Attention';
  color: string;
  textColor: string;
  bgColor: string;
  badgeBg: string;
} {
  const normalized = score > 1 ? score / 100 : score;
  if (normalized >= 0.88) {
    return {
      label: 'Highly Reliable',
      color: '#6BA588', // Success sage
      textColor: 'text-[#6BA588]',
      bgColor: 'bg-[#EDF7F1]',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    };
  } else if (normalized >= 0.75) {
    return {
      label: 'Moderate',
      color: '#D6A34B', // Warning amber
      textColor: 'text-[#D6A34B]',
      bgColor: 'bg-[#FBF3E4]',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    };
  } else {
    return {
      label: 'Needs Attention',
      color: '#C97A6D', // Error coral
      textColor: 'text-[#C97A6D]',
      bgColor: 'bg-[#FBEEEC]',
      badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
    };
  }
}

export function formatDateRelative(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const now = new Date();
    const diffHours = Math.round((now.getTime() - d.getTime()) / (1000 * 60 * 60));
    if (diffHours < 24) {
      if (diffHours <= 1) return 'Just now';
      return `${diffHours} hours ago`;
    }
    const diffDays = Math.round(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}
