function EmptyState({ onReset }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-4">
      <div className="stamp bg-turmeric/20 w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-5">
        🍽️
      </div>
      <h3 className="font-display font-bold text-xl text-ink mb-1">
        No dishes match your cravings
      </h3>
      <p className="text-ink/60 text-sm mb-5 max-w-xs">
        Try a different category, lower the rating filter, or clear your
        search.
      </p>
      <button
        onClick={onReset}
        className="bg-chili text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-chili-dark transition-colors"
      >
        Reset filters
      </button>
    </div>
  );
}

export default EmptyState;
