export default function MetricCard({ title, value, icon, trend, trendLabel, borderColor = 'border-l-secondary-fixed' }) {
  return (
    <div className={`glass-card p-6 rounded-xl flex flex-col gap-4 group hover:shadow-lg transition-all border-l-4 ${borderColor}`}>
      <div className="flex justify-between items-start">
        <div className="p-3 bg-secondary-fixed/20 text-secondary rounded-lg">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        {trend !== undefined && (
          <div className={`flex items-center font-label-sm text-label-sm ${trend >= 0 ? 'text-secondary' : 'text-error'}`}>
            <span className="material-symbols-outlined text-sm">{trend >= 0 ? 'trending_up' : 'trending_down'}</span>
            <span>{trend >= 0 ? '+' : ''}{trendLabel}</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-on-surface-variant font-label-md text-label-md uppercase tracking-tight">{title}</p>
        <h3 className="font-headline-md text-headline-md text-primary mt-1">{value}</h3>
      </div>
    </div>
  );
}
